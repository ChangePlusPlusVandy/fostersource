import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import WebinarComponent from "./Webinar";
import InPersonComponent from "./InPerson";
import OnDemandComponent from "./OnDemand";
import Modal from "./Modal";

interface WorkshopCreationProps {
	workshopName: string;
}
export default function WorkshopCreation({
	workshopName,
}: WorkshopCreationProps) {
	const [formData, setFormData] = useState({
		title: "",
		summary: "",
		type: "webinar",
		audioInstructions: "",
		markAttendance: false,
		requireAttendance: false,
		gradeUser: false,
		emailUnattended: false,
		hideAfter: false,
		minTime: 0,
	});

	const [webinarData, setWebinarData] = useState({
		serviceType: "",
		meetingID: "string",
		startTime: new Date(),
		duration: 0,
		authParticipants: false,
		autoRecord: false,
		enablePractice: false,
	});

	const [inPersonData, setInPersonData] = useState({
		startTime: null,
		duration: 0,
		location: "",
	});

	const [onDemandData, setOnDemandData] = useState({
		embeddingLink: "",
	});

	const [openModal, setOpenModal] = useState<"New" | "Existing" | null>(null);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log("Form submitted:", formData);
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="p-6 w-full ">
				<h2 className="text-xl font-semibold flex items-center gap-2">
					{workshopName}
				</h2>
				<div className="mt-4">
					<label className="text-sm font-medium block">Title</label>
					<input
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="mt-1 w-full p-2 border rounded"
						placeholder=""
						required
					/>
				</div>
				<div className="mt-4">
					<label className="text-sm font-medium block">Summary</label>
					<textarea
						name="summary"
						value={formData.summary}
						onChange={handleChange}
						className="mt-1 w-full p-2 border rounded"
						required
					/>
				</div>
				<div className="mt-4">
					<label className="text-sm font-medium block">Type</label>
					<div className="mt-2 flex gap-4">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="webinar"
								checked={formData.type === "webinar"}
								onChange={handleChange}
								required
							/>{" "}
							Webinar
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="in-person"
								onChange={handleChange}
							/>{" "}
							In-Person
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="on-demand"
								onChange={handleChange}
							/>{" "}
							On-Demand
						</label>
					</div>
				</div>
				<div className="py-5">
					{formData.type === "webinar" ? (
						<WebinarComponent
							setWebinarData={setWebinarData}
							webinarData={webinarData}
							openModal={openModal}
							setOpenModal={setOpenModal}
						/>
					) : formData.type === "in-person" ? (
						<InPersonComponent
							inPersonData={inPersonData}
							setInPersonData={setInPersonData}
						/>
					) : (
						<OnDemandComponent
							onDemandData={onDemandData}
							setOnDemandData={setOnDemandData}
						/>
					)}
				</div>

				<div className="grid grid-cols-2 gap-6 py-5">
					{/* Left Column */}
					<div className="space-y-3">
						<label className="flex items-center gap-2 font-medium">
							<input
								type="checkbox"
								className="w-5 h-5"
								name="markAttendance"
								checked={formData.markAttendance}
								onChange={(e) => {
									const checked = e.target.checked;
									setFormData((prev) => ({
										...prev,
										markAttendance: checked,
										requireAttendance: checked ? prev.requireAttendance : false, // Reset if unchecked
										minTime: checked ? prev.minTime : 0, // Reset minTime
									}));
								}}
							/>
							Mark User Attendance
						</label>

						<div
							className={`pl-6 space-y-2 ${!formData.markAttendance ? "opacity-50 pointer-events-none" : ""}`}
						>
							<label className="flex items-center gap-2 text-gray-500">
								<input
									type="checkbox"
									className="w-4 h-4"
									name="requireAttendance"
									checked={formData.requireAttendance}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											requireAttendance: e.target.checked,
										}))
									}
								/>
								Attendance required for completion
							</label>
							<div>
								<label className="block text-gray-500 text-sm">
									Minimum Time (mins)
								</label>
								<input
									type="number"
									className="w-16 border rounded px-2 py-1 text-gray-500"
									min="0"
									value={formData.minTime}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											minTime: parseInt(e.target.value),
										}))
									}
								/>
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-3">
						<label className="flex items-center gap-2 font-medium">
							<input
								type="checkbox"
								className="w-5 h-5"
								name="gradeUser"
								checked={formData.gradeUser}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										gradeUser: e.target.checked,
									}))
								}
							/>
							Grade User
						</label>

						<label className="flex items-center gap-2 font-medium">
							<input
								type="checkbox"
								className="w-5 h-5"
								name="emailUnattended"
								checked={formData.emailUnattended}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										emailUnattended: e.target.checked,
									}))
								}
							/>
							Email Registrants Who Do Not Attend
						</label>

						<label className="flex items-center gap-2 font-medium">
							<input
								type="checkbox"
								className="w-5 h-5"
								name="hideAfter"
								checked={formData.hideAfter}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										hideAfter: e.target.checked,
									}))
								}
							/>
							Hide Component after Live Event
						</label>
					</div>
				</div>

				<div className="mt-4">
					<label className="text-sm font-medium block">
						Audio Instructions
					</label>
					<textarea
						name="audioInstructions"
						value={formData.audioInstructions}
						onChange={handleChange}
						className="mt-1 w-full p-2 border rounded"
						required
					/>
				</div>
				<div className="mt-6 flex justify-end gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-purple-800 text-white rounded"
					>
						Save and Exit
					</button>
					<button
						type="button"
						className="px-4 py-2 border border-purple-800 text-purple-800 rounded"
					>
						Exit
					</button>
				</div>
			</form>

			{/* First Modal */}
			<Modal
				isOpen={openModal === "New"}
				onClose={() => setOpenModal(null)}
				title="Create New Webinar"
			>
				<p>
					This is the placeholder for adding a new webinar (once we get zoom).
				</p>
			</Modal>

			{/* Second Modal */}
			<Modal
				isOpen={openModal === "Existing"}
				onClose={() => setOpenModal(null)}
				title="Add Existing Webinar"
			>
				<p>This is placeholder for finding existing webinars.</p>
			</Modal>
		</div>
	);
}
