import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import adminApiClient from "../../../services/adminApiClient";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropdown from "../../../components/dropdown-select";
import "./EmailModal.css";
import { ALLOWED_PLACEHOLDERS } from "../../../shared/placeholders";
import apiClient from "../../../services/apiClient";
import { Email, MongoEmail } from "../../../shared/types";
import { create } from "domain";

interface ModalProps {
	modalOpen: boolean;
	onClose: () => void;
	title: string;
	isEdit: boolean;
	setEmails: Dispatch<SetStateAction<MongoEmail[]>>;
	email: MongoEmail | null;
	courseId: string;
	setCurrentEmail: Dispatch<SetStateAction<MongoEmail | null>>;
}

export default function EmailModal({
	modalOpen,
	onClose,
	title,
	isEdit,
	setEmails,
	email,
	courseId,
	setCurrentEmail,
}: ModalProps) {
	const [courseOptions, setCourseOptions] = useState<
		{ label: string; value: string }[]
	>([]);
	const [subject, setSubject] = useState<string>("");
	const [course, setCourse] = useState<string[]>([]);
	const [body, setBody] = useState<string>("");
	const [sendOption, setSendOption] = useState<"now" | "later">("now");
	const [scheduledTime, setScheduledTime] = useState<string>(""); // ISO format

	const resetForm = () => {
		setSubject("");
		setBody("");
		setCourse([]);
		setSendOption("now");
		setScheduledTime("");
		setSelectedCourseId("");
	};

	const createEmail = async () => {
		try {
			let response;
			if (sendOption === "now") {
				console.log("starting api");
				response = await apiClient.post("/emails/send", {
					subject,
					body,
					courseId: selectedCourseId,
				});
				console.log("finished api call");
			} else
				response = await apiClient.post("/emails/send", {
					subject,
					body,
					courseId: selectedCourseId,
					sendDate: scheduledTime,
				});

			const newEmail = response.data;
			const selectedCourse = courseOptions.find(
				(opt) => opt.value === selectedCourseId
			);

			setEmails((prev) => [
				{
					...newEmail,
					course: {
						_id: selectedCourseId,
						className: selectedCourse?.label ?? "Unknown Course",
					},
				},
				...prev,
			]);
			resetForm();
			setCurrentEmail({
				...newEmail,
				course: {
					id: selectedCourseId,
					className: selectedCourse?.label ?? "Unknown Course",
				},
			});
		} catch (error) {
			console.error(error);
		}
	};

	const updateEmail = async () => {
		console.log("inside update email function");

		if (email) {
			try {
				const response = await adminApiClient.put(`/emails/${email.id}`, {
					subject,
					body,
					courseId: selectedCourseId,
					sendDate: scheduledTime,
				});

				const updatedEmail = response.data;
				const selectedCourse = courseOptions.find(
					(opt) => opt.value === selectedCourseId
				);

				setEmails((prev) =>
					prev.map((t) =>
						t.id === updatedEmail._id
							? {
									...updatedEmail,
									course: {
										id: selectedCourseId,
										className: selectedCourse?.label ?? "Unknown Course",
									},
								}
							: t
					)
				);
				resetForm();
				setCurrentEmail(null);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const getCourses = async () => {
		try {
			const response = await apiClient.get("/courses");
			const mapped = response.data.data.map((course: any) => ({
				label: course.className,
				value: course._id,
			}));
			setCourseOptions(mapped);
		} catch (error) {
			console.error("Failed to fetch courses:", error);
		}
	};

	const saveAsTemplate = async () => {
		try {
			await apiClient.post("/emailTemplates", {
				subject,
				body,
			});
			window.alert("Template created successfully");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (modalOpen) getCourses();
	}, [modalOpen]);

	const [selectedCourseId, setSelectedCourseId] = useState<string>("");

	useEffect(() => {
		if (course.length > 0) {
			const selectedOption = courseOptions.find(
				(opt) => opt.label === course[0]
			);
			if (selectedOption) {
				setSelectedCourseId(selectedOption.value);
			}
		}
	}, [course, courseOptions]);

	useEffect(() => {
		if (email) {
			setSubject(email.subject);
			setBody(email.body);

			const now = new Date();
			const sendDate = new Date(email.sendDate);
			if (sendDate > now) {
				setSendOption("later");
				setScheduledTime(
					new Date(sendDate.getTime() - new Date().getTimezoneOffset() * 60000)
						.toISOString()
						.slice(0, 16)
				);
			} else {
				setSendOption("now");
				setScheduledTime("");
			}
		} else {
			setSubject("");
			setBody("");
			setCourse([]);
			setSendOption("now");
			setScheduledTime("");
			setSelectedCourseId("");
		}
	}, [email]);

	useEffect(() => {
		if (email && courseOptions.length > 0) {
			console.log("📩 Email course:", email.course);
			console.log("📩 Email course ID:", courseId);
			console.log("📚 Available course options:", courseOptions);
			const courseOption = courseOptions.find((opt) => opt.value === courseId);
			console.log("🎯 Matched course option:", courseOption);
			if (courseOption) {
				setCourse([courseOption.label]); // triggers selectedCourseId logic
			}
		}
	}, [email, courseOptions]);

	return (
		<Modal
			isOpen={modalOpen}
			onClose={onClose}
			title={title}
			showCloseIcon={true}
			footer={
				<div className="flex justify-end">
					{isEdit ? (
						<></>
					) : (
						<button
							type="button"
							onClick={() => {
								saveAsTemplate();
								onClose();
							}}
							className="mr-2 text-purple2 underline"
						>
							Save as Template
						</button>
					)}
					<button
						type="button"
						onClick={onClose}
						className="mr-2 text-gray-500"
					>
						Exit
					</button>
					<button
						className="bg-[#8757a3] text-white px-4 py-2 rounded-lg"
						onClick={() => {
							if (isEdit) updateEmail();
							else createEmail();
							onClose();
						}}
					>
						Save and Exit
					</button>
				</div>
			}
		>
			<form id="email-form" onSubmit={isEdit ? updateEmail : createEmail}>
				<SearchDropdown
					options={courseOptions.map((opt) => opt.label)}
					selected={course}
					setSelected={setCourse}
					placeholder="Select course"
				/>
				<input
					type="text"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					placeholder="Subject"
					required
				/>
				<div className="flex gap-4 mb-6">
					<div className="flex flex-col justify-start">
						<label>Send</label>
						<Dropdown
							buttonLabel={
								sendOption === "now" ? "Send Now" : "Schedule for Later"
							}
							menuItems={[
								{
									label: "Send Now",
									onClick: () => setSendOption("now"),
								},
								{
									label: "Schedule for Later",
									onClick: () => setSendOption("later"),
								},
							]}
						/>
					</div>

					{sendOption === "later" && (
						<div className="">
							<label className="block text-gray-700 mb-1">
								Schedule Date & Time
							</label>
							<input
								type="datetime-local"
								value={scheduledTime}
								onChange={(e) => setScheduledTime(e.target.value)}
								className="border rounded-lg px-4 py-2 w-full"
								required
							/>
						</div>
					)}
				</div>
				<div className="mb-6 border rounded h-[300px] overflow-hidden">
					<ReactQuill
						value={body}
						onChange={setBody}
						placeholder="Write your email here..."
						className="h-full flex flex-col"
						modules={{
							toolbar: [
								[{ header: [1, 2, false] }],
								["bold", "italic", "underline", "strike"],
								[{ list: "ordered" }, { list: "bullet" }],
								["link", "image"],
								["clean"],
							],
						}}
					/>
				</div>
				<div>
					<p>Available placeholders:</p>
					{ALLOWED_PLACEHOLDERS.map((placeholder) => (
						<p key={placeholder}>{placeholder}</p>
					))}
				</div>
			</form>
		</Modal>
	);
}
