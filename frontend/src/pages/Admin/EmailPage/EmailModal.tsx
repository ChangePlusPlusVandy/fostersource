import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import adminApiClient from "../../../services/adminApiClient";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropdown from "../../../components/dropdown-select";
import "./EmailModal.css";
import { ALLOWED_PLACEHOLDERS } from "../../../shared/placeholders";
import apiClient from "../../../services/apiClient";

interface ModalProps {
	modalOpen: boolean;
	onClose: () => void;
	title: string;
	isEdit: boolean;
}

export default function EmailModal({
	modalOpen,
	onClose,
	title,
	isEdit,
}: ModalProps) {
	const [courseOptions, setCourseOptions] = useState<
		{ label: string; value: string }[]
	>([]);
	const [subject, setSubject] = useState<string>("");
	const [course, setCourse] = useState<string[]>([]);
	const [body, setBody] = useState<string>("");
	const [sendOption, setSendOption] = useState<"now" | "later">("now");
	const [scheduledTime, setScheduledTime] = useState<string>(""); // ISO format

	const createEmail = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			console.log("making api request");
			await apiClient.post("/emails/send", {
				subject,
				body,
				courseId: selectedCourseId,
			});
			console.log("finished api request");

			// await adminApiClient.post("/emails", {
			// 	subject,
			// 	body,
			// 	course: course[0], // assuming only one course selected
			// 	sendDate:
			// 		sendOption === "later"
			// 			? new Date(scheduledTime).toISOString()
			// 			: new Date().toISOString(),
			// });
		} catch (error) {
			console.error(error);
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
						type="submit"
						form="email-form"
						className="bg-[#8757a3] text-white px-4 py-2 rounded-lg"
						onClick={onClose}
					>
						Save and Exit
					</button>
				</div>
			}
		>
			<form id="email-form" onSubmit={createEmail}>
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
