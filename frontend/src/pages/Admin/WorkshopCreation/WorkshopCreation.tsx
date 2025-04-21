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

	const [webinarData, setWebinarData] = useState({
		serviceType: "webinar",
		meetingURL: "string",
	});

	const [meetingData, setMeetingData] = useState({
		serviceType: "meeting",
		meetingID: "string",
	});

	const [inPersonData, setInPersonData] = useState({
		serviceType: "in person",
		startTime: null,
		duration: 0,
		location: "",
	});

	const [onDemandData, setOnDemandData] = useState({
		serviceType: "on demand",
		embeddingLink: "",
	});

	const [openModal, setOpenModal] = useState<"NewWebinar" | "ExistingWebinar" | "NewMeeting" | "ExistingMeeting" | null>(null);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const course = getCleanCourseData();

	const [formData, setFormData] = useState({
		className: course.className,
		courseDescription: course.courseDescription,
		type: "meeting",
		markAttendance: false,
		requireAttendance: false,
		gradeUser: false,
		emailUnattended: false,
		hideAfter: false,
		minTime: 0,
	});

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log("Form submitted:", formData);
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="p-6 w-full ">
				<div className="mt-4">
					<label className="text-sm font-medium block">Title</label>
					<input
						name="title"
						value={formData.className}
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
						value={formData.courseDescription}
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
				<SaveCourseButton prevLink="pricing" nextLink="speakers"></SaveCourseButton>
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