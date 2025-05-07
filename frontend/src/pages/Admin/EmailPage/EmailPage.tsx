import React, { useEffect, useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import EmailModel from "./EmailModal";
import EmailModal from "./EmailModal";
import adminApiClient from "../../../services/adminApiClient";
import { Email, MongoEmail } from "../../../shared/types";
import apiClient from "../../../services/apiClient";
import EmailPreviewModal from "../../../components/EmailPreviewModal";
import { useParams } from "react-router-dom";

export default function EmailPage({
	isSingleCourse,
}: {
	isSingleCourse: boolean;
}) {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [emails, setEmails] = useState<MongoEmail[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [currentEmail, setCurrentEmail] = useState<MongoEmail | null>(null);

	const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

	const selectedCount = emails.filter((e) => e.selected).length;

	const handleDelete = async (id: string, wasSent: boolean) => {
		try {
			const confirmMessage = wasSent
				? "This email has already been sent. Deleting it will NOT unsend the email. Do you still want to delete it?"
				: "Are you sure you want to delete this email?";

			const confirmed = window.confirm(confirmMessage);
			if (!confirmed) return;

			await apiClient.delete(`/emails/${id}`);
			const updatedEmails = emails.filter((e) => e._id !== id);
			setEmails(updatedEmails);
			const totalPages = Math.ceil(updatedEmails.length / itemsPerPage);
			if (currentPage > totalPages) {
				setCurrentPage(totalPages > 0 ? totalPages : 1);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleBulkDelete = async () => {
		const selectedEmails = emails.filter((e) => e.selected);

		if (selectedEmails.length === 0) return;

		const hasSentEmails = selectedEmails.some(
			(e) => new Date(e.sendDate) < new Date()
		);

		const confirmMessage = hasSentEmails
			? "Some emails have already been sent. Deleting them will NOT unsend them. Do you still want to delete the selected emails?"
			: "Are you sure you want to delete the selected emails?";

		const confirmed = window.confirm(confirmMessage);
		if (!confirmed) return;

		try {
			await Promise.all(
				selectedEmails.map((email) => apiClient.delete(`/emails/${email._id}`))
			);

			const updatedEmails = emails.filter((e) => !e.selected);
			setEmails(updatedEmails);

			const totalPages = Math.ceil(updatedEmails.length / itemsPerPage);
			if (currentPage > totalPages) {
				setCurrentPage(totalPages > 0 ? totalPages : 1);
			}
		} catch (error) {
			console.error("Error deleting selected emails:", error);
		}
	};

	const totalPages: number = Math.ceil(emails.length / itemsPerPage);

	const filteredEmails = emails.filter((email) =>
		email.subject.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const displayedEmails = filteredEmails.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const { id: courseId } = useParams();

	const fetchEmails = async () => {
		try {
			let response;
			if (isSingleCourse) {
				response = await apiClient.get("/emails", {
					params: { course: courseId },
				});
			} else {
				response = await adminApiClient.get("/emails");
			}

			const transformed = response.data.map((email: any) => ({
				...email,
				id: email._id,
			}));

			setEmails(transformed);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchEmails();
	}, []);

	useEffect(() => {
		console.log("current email:", currentEmail);
	}, [currentEmail]);

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="max-w-screen-2xl mx-auto px-8 py-6">
				<div className="bg-white border rounded-lg p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Emails</h1>
					</div>

					<div className="flex justify-between items-center mb-3">
						<div>
							{selectedCount === 0 ? (
								<></>
							) : (
								<div className="flex items-center gap-4">
									<span className="text-sm" style={{ color: "#8757a3" }}>
										{selectedCount} Selected
									</span>
									<button
										className="text-sm text-red-600 font-bold"
										onClick={handleBulkDelete}
									>
										Delete
									</button>
								</div>
							)}
						</div>

						<div className="flex gap-4 items-center">
							<input
								type="text"
								className="text-sm px-4 py-2 border rounded-md"
								placeholder="Search emails..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<button
								className="text-sm text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
								style={{ backgroundColor: "#8757a3" }}
								onClick={() => {
									setCurrentEmail(null);
									setModalOpen(true);
									setIsEdit(false);
								}}
							>
								New Email
							</button>
						</div>
					</div>

					{displayedEmails.length === 0 ? (
						<div className="text-center text-gray-500">No emails found.</div>
					) : (
						<>
							<div className="overflow-x-auto border border-gray-300 rounded-lg">
								<table className="min-w-full table-auto border-collapse">
									<thead>
										<tr>
											<th className="px-3 py-3 text-left text-sm font-bold text-black w-[40px]"></th>
											<th className="px-3 py-3 text-left text-sm font-bold text-black border-r">
												Subject
											</th>
											<th className="px-3 py-3 text-left text-sm font-bold text-black border-r">
												Product
											</th>
											<th className="px-3 py-3 text-left text-sm font-bold text-black border-r">
												Send Time
											</th>
											<th className="px-3 py-3 text-center text-sm font-bold text-black">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{displayedEmails.map((email) => (
											<tr
												key={email._id}
												className={`border-t odd:bg-[#f2f2f2]`}
											>
												<td className="px-4 py-2 h-12">
													<input
														type="checkbox"
														checked={email.selected}
														onChange={() => {
															setEmails(
																emails.map((e) =>
																	e._id === email._id
																		? { ...e, selected: !e.selected }
																		: e
																)
															);
														}}
														className="w-5 h-5"
														style={{ accentColor: "#8757a3" }}
													/>
												</td>
												<td className="px-3 py-2 text-sm font-medium text-gray-900 border-r truncate max-w-[200px] overflow-hidden text-ellipsis h-12">
													{email.subject}
												</td>
												<td className="px-3 py-2 text-sm font-medium text-gray-900 border-r truncate max-w-[200px] overflow-hidden text-ellipsis h-12">
													{email.course.className}
												</td>
												<td className="px-3 py-2 text-sm font-medium text-gray-900 border-r truncate max-w-[140px] overflow-hidden text-ellipsis h-12">
													{new Date(email.sendDate) < new Date()
														? "Sent on "
														: "Scheduled for "}
													{new Date(email.sendDate).toLocaleString("en-US", {
														dateStyle: "long",
														timeStyle: "short",
													})}
												</td>
												<td className="px-3 py-2 text-sm text-gray-500 w-[100px] h-12">
													<div className="flex justify-center gap-4">
														<button
															onClick={() => {
																setCurrentEmail(email);
																console.log(email);
																setPreviewModalOpen(true);
															}}
														>
															<Search className="w-4 h-4 text-gray-400" />
														</button>
														{new Date(email.sendDate) < new Date() ? (
															<></>
														) : (
															<button
																onClick={() => {
																	setCurrentEmail(email);
																	setIsEdit(true);
																	setModalOpen(true);
																}}
															>
																<Edit2 className="w-4 h-4 text-gray-400" />
															</button>
														)}

														<button
															onClick={() =>
																handleDelete(
																	email._id,
																	new Date(email.sendDate) < new Date()
																)
															}
														>
															<Trash2 className="w-4 h-4 text-gray-400" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Pagination Section */}
							<div className="flex justify-end mt-4">
								<div className="flex items-center rounded-lg border bg-white overflow-hidden shadow-sm relative">
									<button
										onClick={() => handlePageChange(currentPage - 1)}
										disabled={currentPage === 1}
										className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
										aria-label="Previous page"
									>
										&#171;
									</button>

									{Array.from({ length: totalPages }, (_, i) => (
										<button
											key={i + 1}
											onClick={() => handlePageChange(i + 1)}
											className={`px-3 py-2 min-w-[40px] ${currentPage === i + 1 ? "text-white bg-[#8757a3] rounded-lg" : "hover:bg-gray-50"}`}
										>
											{i + 1}
										</button>
									))}

									<button
										onClick={() => handlePageChange(currentPage + 1)}
										disabled={currentPage === totalPages}
										className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
										aria-label="Next page"
									>
										&#187;
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
			<EmailModal
				modalOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title={isEdit ? "Edit Email" : "Create New Email"}
				isEdit={isEdit}
				setEmails={setEmails}
				email={currentEmail}
				courseId={
					isSingleCourse ? courseId || "" : currentEmail?.course._id || ""
				}
				setCurrentEmail={setCurrentEmail}
				isSingleCourse={isSingleCourse}
			/>
			<EmailPreviewModal
				modalOpen={previewModalOpen}
				onClose={() => setPreviewModalOpen(false)}
				email={currentEmail}
			/>
		</div>
	);
}
