import React from "react";
import Modal from "./Modal";
import { Email, EmailTemplate, MongoEmail } from "../shared/types";
import { ALLOWED_PLACEHOLDERS } from "../shared/placeholders";

interface PreviewProps {
	modalOpen: boolean;
	onClose: () => void;
	email: Email | EmailTemplate | MongoEmail | null;
}

export default function EmailPreviewModal({
	modalOpen,
	onClose,
	email,
}: PreviewProps) {
	// Replace placeholders with preview values
	const previewBody = email?.body
		?.replaceAll("{{name}}", "Jane Doe")
		.replaceAll("{{course}}", "Trauma 101")
		.replaceAll("{{courselink}}", "https://fostersource.org/courses/123");

	return (
		<Modal
			isOpen={modalOpen}
			onClose={onClose}
			title="Preview"
			showCloseIcon={true}
		>
			<div className="max-h-[80vh] overflow-y-auto px-2 py-1 space-y-4">
				<h2 className="text-lg font-semibold text-gray-900">
					{email?.subject}
				</h2>
				<div
					className="prose max-w-none"
					dangerouslySetInnerHTML={{ __html: previewBody || "" }}
				/>
			</div>
		</Modal>
	);
}
