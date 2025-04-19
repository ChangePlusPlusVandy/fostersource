import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import WebinarComponent from "./Webinar";
import InPersonComponent from "./InPerson";
import OnDemandComponent from "./OnDemand";
import Modal from "./Modal";
import MeetingComponent from "./Meeting";
import ExistingMeetingList from "./ModalComponents/ExistingMeetingList";
import NewMeeting from "./ModalComponents/NewMeeting";
import ExistingWebinarList from "./ModalComponents/ExistingWebinarList";
import NewWebinar from "./ModalComponents/NewWebinar";
import SaveCourseButton from "../../../components/SaveCourseButtons";
import apiClient from "../../../services/apiClient";
import { getCleanCourseData } from "../../../store/useCourseEditStore";

export default function WorkshopCreation() {
	const [formData, setFormData] = useState({
		title: "",
		summary: "",
		type: "meeting",
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

	const [meetingData, setMeetingData] = useState({
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

	const [openModal, setOpenModal] = useState<"NewWebinar" | "ExistingWebinar" | "NewMeeting" | "ExistingMeeting" | null>(null);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const course = getCleanCourseData();

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log("Form submitted:", formData);
	};

	const createVideo = async () => {
		try {
			const response = await apiClient.post("/videos", {
				title: formData.title,
				description: formData.summary,
				videoUrl: onDemandData.embeddingLink,
				courseId: course._id,
				published: true, // could be toggled later
			});
		} catch (error) {
			console.error(error);
		}
	};

	// TODO: get video or webinar

	return (
		<div>
			<form onSubmit={handleSubmit} className="p-6 w-full ">
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
								value="meeting"
								checked={formData.type === "meeting"}
								onChange={handleChange}
								required
							/>{" "}
							Meeting
						</label>
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
					): formData.type === "meeting" ? (
						<MeetingComponent
							meetingData={meetingData}
							setMeetingData={setMeetingData}
							openModal={openModal}
							setOpenModal={setOpenModal}
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
				<div className="flex gap-4 justify-end">
					<button className="text-purple2">Discard</button>
					<button
						onClick={createVideo}
						className="bg-purple2 text-white px-10 py-2 rounded-md"
					>
						Save
					</button>
				</div>
			</form>

			{/* New Meeting Modal */}
			<Modal
				isOpen={openModal === "NewMeeting"}
				onClose={() => setOpenModal(null)}
				title="Create New Meeting"
			>
				<NewMeeting
					setMeetingData={setMeetingData}
					setOpenModal={setOpenModal}
				/>
			</Modal>

			{/* Existing Meeting Modal */}
			<Modal
				isOpen={openModal === "ExistingMeeting"}
				onClose={() => setOpenModal(null)}
				title="Add Existing Meeting"
			>
				<ExistingMeetingList
					setMeetingData={setMeetingData}
					setOpenModal={setOpenModal}
				/>
			</Modal>

			{/* New Webinar Modal */}
			<Modal
				isOpen={openModal === "NewWebinar"}
				onClose={() => setOpenModal(null)}
				title="Create New Webinar"
			>
				<NewWebinar
					setWebinarData={setWebinarData}
					setOpenModal={setOpenModal}
				/>
			</Modal>

			{/* Existing Webinar Modal */}
			<Modal
				isOpen={openModal === "ExistingWebinar"}
				onClose={() => setOpenModal(null)}
				title="Add Existing Webinar"
			>
				<ExistingWebinarList
					setWebinarData={setWebinarData}
					setOpenModal={setOpenModal}
				/>
			</Modal>
		</div>
	);
}
