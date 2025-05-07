import CoursePayment from "../../components/PaymentButton";
import {
	registerFromCart,
	removeFromCart,
} from "../../services/registrationServices";

interface CartItem {
	className: string;
	cost: number;
	creditNumber: number;
	instructor: string;
	_id: string;
}
export default function Cart() {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const cartItems: CartItem[] = user?.cart ? user.cart : [];
	const totalCost = cartItems.reduce((sum, item) => sum + item.cost, 0);
	const courseIds = cartItems.map((item) => item._id);

	const handleRemoveItem = (course: {
		className: string;
		cost: number;
		creditNumber: number;
		instructor: string;
	}): void => {
		removeFromCart(course);
	};

	const handleCheckout = (): void => {
		registerFromCart();
	};

	return (
		<div className="p-6 w-full">
			<h1 className="text-2xl font-bold mb-4">Checkout</h1>
			<div className="space-y-4">
				{cartItems.map((item, index) => (
					<div
						key={index}
						className="p-4 border border-black rounded-lg inline-flex gap-8 items-center"
					>
						<div>
							<h2 className="text-lg font-semibold">{item.className}</h2>
							<p className="text-sm">
								Instructor:{" "}
								<span className="font-medium">{item.instructor}</span>
							</p>
							<p className="text-sm">
								Credits:{" "}
								<span className="font-medium">{item.creditNumber}</span>
							</p>
							<p className="text-sm">
								Price:{" "}
								<span className="font-medium">${item.cost.toFixed(2)}</span>
							</p>
						</div>
						<button
							onClick={() => handleRemoveItem(item)}
							className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
						>
							Remove
						</button>
					</div>
				))}
			</div>
			<div className="mt-6 p-4 border-t border-black">
				<h2 className="text-xl font-semibold mb-2">Summary</h2>
				<p className="text-lg mb-8">
					Total Cost: <span className="font-bold">${totalCost.toFixed(2)}</span>
				</p>
				{totalCost === 0 ? (
					<button
						onClick={handleCheckout}
						className="mt-4 px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg hover:bg-orange-600 transition"
					>
						Checkout
					</button>
				) : (
					<CoursePayment
						courseIds={courseIds}
						price={totalCost}
						userId={user._id}
						onSuccess={handleCheckout}
					/>
				)}
			</div>
		</div>
	);
}
