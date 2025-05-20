import React, { Dispatch, SetStateAction, useEffect } from "react";
import apiClient from "../../../services/apiClient";
import {
	getCleanCourseData,
	useCourseEditStore,
} from "../../../store/useCourseEditStore";

interface OnDemandComponentProps {
	onDemandData: any;
	setOnDemandData: Dispatch<SetStateAction<any>>;
}

function isValidYouTubeUrl(url: string): boolean {
	return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
}

export default function OnDemandComponent({
	onDemandData,
	setOnDemandData,
}: OnDemandComponentProps) {
	const course = getCleanCourseData();
	const hydrated = useCourseEditStore.persist.hasHydrated();

	useEffect(() => {
		if (
			hydrated &&
			course?.productType === "Virtual Training - On Demand" &&
			typeof course.productInfo === "string" &&
			isValidYouTubeUrl(course.productInfo)
		) {
			setOnDemandData((prev: any) => ({
				...prev,
				embeddingLink: course.productInfo,
			}));
		}
	}, [hydrated, course.productInfo, course.productType, setOnDemandData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setOnDemandData((prev: any) => ({ ...prev, [name]: value }));
	};

	// const createVideo = async () => {
	// 	try {
	// 		await apiClient.put(`/courses/${course._id}`, {
	// 			productType: "Virtual Training - On Demand",
	// 			productInfo: onDemandData.embeddingLink,
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	return (
		<div>
			<label className="text-sm font-medium block">YouTube Link</label>
			<input
				name="embeddingLink"
				value={onDemandData.embeddingLink}
				onChange={handleChange}
				className="mt-1 p-2 border rounded"
				placeholder=""
				required
			/>

			{/* <button
				onClick={createVideo}
				className="bg-purple2 text-white px-10 py-2 rounded-md mx-5"
			>
				Save
			</button> */}
		</div>
	);
}
