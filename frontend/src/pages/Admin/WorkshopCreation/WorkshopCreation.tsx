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
import {
	getCleanCourseData,
	useCourseEditStore,
} from "../../../store/useCourseEditStore";

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
		serviceType: "in-person",
		startTime: null,
		duration: "",
		location: "",
	});

	const [onDemandData, setOnDemandData] = useState({
		serviceType: "on demand",
		embeddingLink: "",
	});

	const [openModal, setOpenModal] = useState<
		"NewWebinar" | "ExistingWebinar" | "NewMeeting" | "ExistingMeeting" | null
	>(null);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const course = getCleanCourseData();

	function getInitialType() {
		if (course.productType === "Virtual Training - On Demand") {
			return "on demand";
		} else if (course.productType === "Virtual Training - Live Meeting") {
			return "meeting";
		} else if (course.productType === "Virtual Training - Live Webinar") {
			return "webinar";
		} else if (course.productType === "In-Person Training") {
			return "in-person";
		} else {
			return "meeting";
		}
	}

	const [formData, setFormData] = useState({
		className: course.className,
		courseDescription: course.courseDescription,
		type: getInitialType(),
		markAttendance: false,
		requireAttendance: false,
		gradeUser: false,
		emailUnattended: false,
		hideAfter: false,
		minTime: 0,
	});

	useEffect(() => {
		const mappedType = (() => {
			switch (course.productType) {
				case "Virtual Training - On Demand":
					return "on-demand";
				case "Virtual Training - Live Meeting":
					return "meeting";
				case "Virtual Training - Live Webinar":
					return "webinar";
				case "In-Person Training":
					return "in-person";
				default:
					return "meeting";
			}
		})();

		// Only update type if it's not already set (prevents override if user changes it)
		if (!formData.type) {
			setFormData((prev) => ({
				...prev,
				type: mappedType,
			}));
		}
	}, [course.productType]);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log("Form submitted:", formData);
	};

	const setField = useCourseEditStore((state) => state.setField);

	const [hasHydratedFormData, setHasHydratedFormData] = useState(false);

	useEffect(() => {
		if (!hasHydratedFormData) {
			// Hydrate formData type
			const mappedType = (() => {
				switch (course.productType) {
					case "Virtual Training - On Demand":
						return "on-demand";
					case "Virtual Training - Live Meeting":
						return "meeting";
					case "Virtual Training - Live Webinar":
						return "webinar";
					case "In-Person Training":
						return "in-person";
					default:
						return "meeting";
				}
			})();

			setFormData((prev) => ({
				...prev,
				type: mappedType,
			}));

			// Hydrate type-specific data
			if (
				mappedType === "in-person" &&
				typeof course.productInfo === "string"
			) {
				try {
					const parsed = JSON.parse(course.productInfo);
					setInPersonData({
						serviceType: "in-person",
						startTime: parsed.startTime || "",
						duration:
							parsed.duration !== undefined ? parsed.duration.toString() : "",
						location: parsed.location || "",
					});
				} catch (e) {
					console.error("Failed to parse in-person data", e);
				}
			}

			if (
				mappedType === "on-demand" &&
				typeof course.productInfo === "string"
			) {
				setOnDemandData({
					serviceType: "on demand",
					embeddingLink: course.productInfo || "",
				});
			}

			if (mappedType === "meeting") {
				setMeetingData({
					serviceType: "meeting",
					meetingID: course.productInfo || "",
				});
			}

			if (mappedType === "webinar") {
				setWebinarData({
					serviceType: "webinar",
					meetingURL: course.productInfo || "",
				});
			}

			setHasHydratedFormData(true); // ✅ lock hydration
		}
	}, [hasHydratedFormData, course]);

	// Watch onDemandData
	useEffect(() => {
		if (formData.type === "on-demand") {
			setField("productType", "Virtual Training - On Demand");
			setField("productInfo", onDemandData.embeddingLink || "");
		}
	}, [onDemandData, formData.type]);

	// Watch meetingData
	useEffect(() => {
		if (formData.type === "meeting") {
			setField("productType", "Virtual Training - Live Meeting");
			setField("productInfo", meetingData.meetingID || "");
		}
	}, [meetingData, formData.type]);

	// Watch webinarData
	useEffect(() => {
		if (formData.type === "webinar") {
			setField("productType", "Virtual Training - Live Webinar");
			setField("productInfo", webinarData.meetingURL || "");
		}
	}, [webinarData, formData.type]);

	// Watch inPersonData
	useEffect(() => {
		console.log("formData.type:", JSON.stringify(inPersonData));
		if (formData.type === "in-person") {
			setField("productType", "In-Person Training");
			setField(
				"productInfo",
				JSON.stringify(inPersonData) // duration stays string
			);
		}
	}, [inPersonData, formData.type]);

	const productType = useCourseEditStore((state) => state.productType);
	const productInfo = useCourseEditStore((state) => state.productInfo);

	useEffect(() => {
		console.log("🧠 Zustand updated:", {
			productType,
			productInfo,
		});
	}, [productType, productInfo]);

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
							/>
							Meeting
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="webinar"
								checked={formData.type === "webinar"}
								onChange={handleChange}
							/>
							Webinar
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="in-person"
								checked={formData.type === "in-person"}
								onChange={handleChange}
							/>
							In-Person
						</label>
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="type"
								value="on-demand"
								checked={formData.type === "on-demand"}
								onChange={handleChange}
							/>
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
					) : formData.type === "meeting" ? (
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
				<SaveCourseButton
					prevLink="pricing"
					nextLink="speakers"
				></SaveCourseButton>
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
