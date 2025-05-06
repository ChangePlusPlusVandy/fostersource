import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import {getCleanCourseData} from "../../../store/useCourseEditStore";

interface OnDemandComponentProps {
	onDemandData: any;
	setOnDemandData: Dispatch<SetStateAction<any>>;
}
export default function OnDemandComponent({
	onDemandData,
	setOnDemandData,
}: OnDemandComponentProps) {
	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setOnDemandData({ ...onDemandData, [name]: value });
	};
	const course = getCleanCourseData();

	const createVideo = async () => {
		try {
			const response = await apiClient.post("/videos", {
				title: course.className,
				description: course.courseDescription,
				videoUrl: onDemandData.embeddingLink,
				courseId: course._id,
				published: true, // could be toggled later
			});
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div
		>
			<label className="text-sm font-medium block">Embedding Link</label>
			<input
				name="embeddingLink"
				value={onDemandData.embeddingLink}
				onChange={handleChange}
				className="mt-1 p-2 border rounded"
				placeholder=""
				required
			/>

				<button
					onClick={createVideo}
					className="bg-purple2 text-white px-10 py-2 rounded-md mx-5"
				>
					Save
				</button>
		</div>
	);
}
