import React, { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import { Edit2, Search, Trash2 } from "lucide-react";
import EmailTemplateModal from "./EmailTemplateModal";
import { EmailTemplate } from "../../../shared/types";

export default function EmailTemplates() {
	const [templates, setTemplates] = useState<EmailTemplate[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(
		null
	);

	const getTemplates = async () => {
		try {
			const response = await apiClient.get("/emailTemplates");
			setTemplates(response.data.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTemplates();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await apiClient.delete(`/emailTemplates/${id}`);
			setTemplates((prevTemplates) =>
				prevTemplates.filter((template) => template._id !== id)
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="max-w-screen-2xl mx-auto px-8 py-6">
				<div className="bg-white border rounded-lg p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Email Templates</h1>
					</div>
					<div className="flex justify-end mb-6">
						<button
							className="text-sm text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
							style={{ backgroundColor: "#8757a3" }}
							onClick={() => {
								setIsEdit(false);
								setModalOpen(true);
							}}
						>
							New Template
						</button>
					</div>
					<div className="overflow-x-auto border border-gray-300 rounded-lg">
						<table className="min-w-full table-auto border-collapse">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-3 py-3 text-left text-sm font-bold text-black border-r">
										Email Template Name
									</th>

									<th className="px-3 py-3 text-center text-sm font-bold text-black">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{templates.map((template) => (
									<tr
										key={template._id}
										className={`border-t odd:bg-white even:bg-gray-100`}
									>
										<td className="px-3 py-2 text-sm font-medium text-gray-900 border-r truncate max-w-[200px] overflow-hidden text-ellipsis h-12">
											{template.subject}
										</td>

										<td className="px-3 py-2 text-sm text-gray-500 w-[100px] h-12">
											<div className="flex justify-center gap-4">
												<button>
													<Search className="w-4 h-4 text-gray-400" />
												</button>
												<button
													onClick={() => {
														setCurrentTemplate(template);
														setIsEdit(true);
														setModalOpen(true);
													}}
												>
													<Edit2 className="w-4 h-4 text-gray-400" />
												</button>
												<button onClick={() => handleDelete(template._id)}>
													<Trash2 className="w-4 h-4 text-gray-400" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<EmailTemplateModal
				onClose={() => setModalOpen(false)}
				modalOpen={modalOpen}
				isEdit={isEdit}
				title={isEdit ? "Edit Template" : "Create New Template"}
				templates={templates}
				setTemplates={setTemplates}
				template={currentTemplate}
			/>
		</div>
	);
}
