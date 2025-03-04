import React, { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";

interface Email {
	id: number;
	subject: string;
	product: string;
	sendTime: string;
	selected: boolean;
}

export default function EmailPage() {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [emails, setEmails] = useState<Email[]>([
		...Array(50)
			.fill(null)
			.map((_, i) => ({
				id: i + 1,
				subject:
					"Details for Tomorrow #" +
					(i + 1) +
					": Please READ: This is going to be AWESOME!",
				product:
					"Avoiding Head Trauma and Early Exposure - Live Virtual (01/18/2025)",
				sendTime: "Scheduled: 02/15/2025 13:00",
				selected: false,
			})),
	]);

	const selectedCount = emails.filter((e) => e.selected).length;

	const handleDelete = (id: number) => {
		const updatedEmails = emails.filter((e) => e.id !== id);
		setEmails(updatedEmails);
		const totalPages = Math.ceil(updatedEmails.length / itemsPerPage);
		if (currentPage > totalPages) {
			setCurrentPage(totalPages > 0 ? totalPages : 1);
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

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="max-w-screen-2xl mx-auto px-8 py-6">
				<div className="bg-white border rounded-lg p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Emails</h1>
					</div>

					<div className="flex justify-between items-center mb-3">
						<div className="flex items-center gap-4">
							<span className="text-sm" style={{ color: "#8757a3" }}>
								{selectedCount} Selected
							</span>
							<button
								className="text-sm text-red-600 font-bold"
								onClick={() => {
									setEmails(emails.filter((e) => !e.selected));
									setCurrentPage((prevPage) => {
										const totalPages = Math.ceil(
											emails.filter((e) => !e.selected).length / itemsPerPage
										);
										return prevPage > totalPages
											? Math.max(totalPages, 1)
											: prevPage;
									});
								}}
							>
								Delete
							</button>
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
								onClick={() => {}}
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
												key={email.id}
												className={`border-t odd:bg-[#f2f2f2]`}
											>
												<td className="px-4 py-2 h-12">
													<input
														type="checkbox"
														checked={email.selected}
														onChange={() => {
															setEmails(
																emails.map((e) =>
																	e.id === email.id
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
													{email.product}
												</td>
												<td className="px-3 py-2 text-sm font-medium text-gray-900 border-r truncate max-w-[140px] overflow-hidden text-ellipsis h-12">
													{email.sendTime}
												</td>
												<td className="px-3 py-2 text-sm text-gray-500 w-[100px] h-12">
													<div className="flex justify-center gap-4">
														<button>
															<Search className="w-4 h-4 text-gray-400" />
														</button>
														<button>
															<Edit2 className="w-4 h-4 text-gray-400" />
														</button>
														<button onClick={() => handleDelete(email.id)}>
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
		</div>
	);
}
