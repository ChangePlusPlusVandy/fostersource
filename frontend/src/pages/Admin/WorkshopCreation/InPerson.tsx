import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getCleanCourseData } from "../../../store/useCourseEditStore";

interface InPersonComponentProps {
	inPersonData: any;
	setInPersonData: Dispatch<SetStateAction<any>>;
}

export default function InPersonComponent({
	inPersonData,
	setInPersonData,
}: InPersonComponentProps) {
	useEffect(() => {
		const course = getCleanCourseData();

		// Only prepopulate if values are empty
		if (
			course.productType === "In-Person Training" &&
			!inPersonData.startTime &&
			!inPersonData.location &&
			!inPersonData.duration
		) {
			try {
				const parsed = JSON.parse(course.productInfo);
				setInPersonData({
					serviceType: "in-person",
					startTime: parsed.startTime || "",
					duration:
						parsed.duration !== undefined && parsed.duration !== null
							? parsed.duration.toString()
							: "",
					location: parsed.location || "",
				});
			} catch (err) {
				console.error("Could not parse in-person productInfo", err);
			}
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInPersonData((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="mt-6 flex flex-col gap-4">
			<div>
				<label className="text-sm font-medium block">Start Time</label>
				<input
					name="startTime"
					type="datetime-local"
					value={inPersonData.startTime || ""}
					onChange={handleChange}
					className="mt-1 w-full p-2 border rounded"
					required
				/>
			</div>
			<div>
				<label className="text-sm font-medium block">Location</label>
				<input
					name="location"
					value={inPersonData.location}
					onChange={handleChange}
					className="mt-1 w-full p-2 border rounded"
					required
				/>
			</div>
			<div>
				<label className="text-sm font-medium block">Duration (minutes)</label>
				<input
					name="duration"
					type="text"
					value={inPersonData.duration}
					onChange={handleChange}
					className="mt-1 w-full p-2 border rounded"
					placeholder="e.g. 60"
				/>
			</div>
		</div>
	);
}
