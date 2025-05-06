import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import adminApiClient from "../../../services/adminApiClient";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropdown from "../../../components/dropdown-select";
import "../EmailPage/EmailModal.css";
import { ALLOWED_PLACEHOLDERS } from "../../../shared/placeholders";
import apiClient from "../../../services/apiClient";
import { EmailTemplate } from "../../../shared/types";

interface ModalProps {
	modalOpen: boolean;
	onClose: () => void;
	title: string;
	isEdit: boolean;
	templates: EmailTemplate[];
	setTemplates: Dispatch<SetStateAction<EmailTemplate[]>>;
	template: EmailTemplate | null;
}

export default function EmailTemplateModal({
	modalOpen,
	onClose,
	title,
	isEdit,
	templates,
	setTemplates,
	template,
}: ModalProps) {
	const [subject, setSubject] = useState<string>("");
	const [body, setBody] = useState<string>("");

	const createEmailTemplate = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await apiClient.post("/emailTemplates", {
				subject,
				body,
			});

			const newTemplate = response.data.data;

			setTemplates((prev) => [...prev, newTemplate]);

			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const updateEmailTemplate = async (e: React.FormEvent) => {
		e.preventDefault();

		console.log(template);

		if (template) {
			try {
				const response = await apiClient.put(
					`/emailTemplates/${template._id}`,
					{
						subject,
						body,
					}
				);

				const updatedTemplate = response.data.data;

				setTemplates((prev) =>
					prev.map((t) => (t._id === updatedTemplate._id ? updatedTemplate : t))
				);

				onClose();
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		if (isEdit && template) {
			setSubject(template.subject);
			setBody(template.body);
		} else {
			setSubject("");
			setBody("");
		}
	}, [isEdit, template]);

	return (
		<Modal
			isOpen={modalOpen}
			onClose={onClose}
			title={title}
			showCloseIcon={true}
			footer={
				<div className="flex justify-end">
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
					>
						Save Template and Exit
					</button>
				</div>
			}
		>
			<form
				id="email-form"
				onSubmit={isEdit ? updateEmailTemplate : createEmailTemplate}
			>
				<input
					type="text"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					placeholder="Subject"
					required
				/>
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
