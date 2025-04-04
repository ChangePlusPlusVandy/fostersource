import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

interface Props {
	courseIds: string[];
	price: number;
	userId: string;
	onSuccess?: () => void;
}

export default function CoursePayment({
	courseIds,
	price,
	userId,
	onSuccess,
}: Props) {
	const [orderId, setOrderId] = useState<string | null>(null);

	const createOrder = async () => {
		try {
			const res = await apiClient.post("/payments/create-paypal-order", {
				price,
			});
			setOrderId(res.data.orderId);
			return res.data.orderId;
		} catch (error) {
			console.error("❌ Error creating PayPal order:", error);
			return "";
		}
	};

	const onApprove = async (data: any) => {
		try {
			await apiClient.post("/payments/capture-paypal-order", {
				orderId: data.orderID,
				userId,
				courseIds,
				amount: price,
			});
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error("❌ Error capturing PayPal payment:", error);
		}
	};

	return (
		<PayPalScriptProvider
			options={{ clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID! }}
		>
			<PayPalButtons
				style={{ layout: "vertical" }}
				forceReRender={[price]}
				createOrder={createOrder}
				onApprove={onApprove}
				onError={(err) => console.error("PayPal error:", err)}
			/>
		</PayPalScriptProvider>
	);
}
