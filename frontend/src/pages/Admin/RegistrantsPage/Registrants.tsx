import { useEffect, useState, useCallback } from "react";
import { FaTrashAlt as _FaTrashAlt } from "react-icons/fa";
import { ComponentType } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import adminApiClient from "../../../services/adminApiClient";

const FaTrashAlt = _FaTrashAlt as ComponentType<{
	size?: number;
	color?: string;
}>;

interface RegistrantDisplayInfo {
	id: string;
	userType: string;
	fullName: string;
	email: string;
	registrationDate: string;
	completed: string;
	paid: string;
	transactionId: string;
}

interface UserSearchResult {
	_id: string;
	name: string;
	email: string;
}

export default function Registrants() {
	const { id: courseId } = useParams<{ id: string }>();

	const [registrants, setRegistrants] = useState<RegistrantDisplayInfo[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Add user modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userSearch, setUserSearch] = useState("");
	const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
	const [hasSearchedUsers, setHasSearchedUsers] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
		null
	);
	const [isEnrolling, setIsEnrolling] = useState(false);
	const [enrollMessage, setEnrollMessage] = useState<{
		text: string;
		isError: boolean;
	} | null>(null);
	const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
	const fetchRegistrants = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			// First, fetch the course data to get the students array
			const courseRes = await apiClient.get(`/courses/${courseId}`);
			const courseData = courseRes.data.data; // API returns course in data.data, not data.course

			// If no students in the course, set empty array
			if (!courseData?.students || courseData.students.length === 0) {
				setRegistrants([]);
				return;
			}

			// Use backend _id filtering for efficiency
			const userIdsParam = courseData.students.join(",");
			const usersRes = await apiClient.get(
				`/users?_id=${userIdsParam}&pagination=false`
			);
			const registeredUsers = usersRes.data.users;

			// Try to fetch progress data for registration dates and completion status
			const progressPromises = courseData.students.map(
				async (studentId: string) => {
					try {
						const progressRes = await apiClient.get(
							`/progress/progress/${studentId}`
						);
						const courseProgress = progressRes.data.progresses?.find(
							(p: any) => p.course._id === courseId || p.course === courseId
						);
						return {
							userId: studentId,
							registrationDate: courseProgress?.createdAt || null,
							completed: courseProgress?.completed || false,
						};
					} catch {
						return {
							userId: studentId,
							registrationDate: null,
							completed: false,
						};
					}
				}
			);

			const progressData = await Promise.all(progressPromises);
			const progressMap = new Map(progressData.map((p) => [p.userId, p]));

			// Try to fetch payment data
			const paymentPromises = courseData.students.map(
				async (studentId: string) => {
					try {
						const paymentsRes = await apiClient.get(
							`/payments?user=${studentId}&course=${courseId}`
						);
						const payment = paymentsRes.data.payments?.[0];
						return {
							userId: studentId,
							paid: payment?.amount ? `$${payment.amount}` : "$0.00",
							transactionId: payment?.transactionId || "-",
						};
					} catch {
						return {
							userId: studentId,
							paid: "$0.00",
							transactionId: "-",
						};
					}
				}
			);

			const paymentData = await Promise.all(paymentPromises);
			const paymentMap = new Map(paymentData.map((p) => [p.userId, p]));

			const formatted: RegistrantDisplayInfo[] = registeredUsers.map(
				(user: any) => {
					const progress = progressMap.get(user._id);
					const payment = paymentMap.get(user._id);

					return {
						id: user._id,
						userType: user.role?.name || user.userType || "N/A",
						fullName: user.name || "Unknown",
						email: user.email || "No email",
						registrationDate: progress?.registrationDate
							? new Date(progress.registrationDate).toLocaleDateString()
							: "N/A",
						completed: progress?.completed ? "Yes" : "No",
						paid: payment?.paid || "$0.00",
						transactionId: payment?.transactionId || "-",
					};
				}
			);

			setRegistrants(formatted);
		} catch (err: any) {
			console.error("Failed to load registrants", err);
			setError("Failed to load registrants.");
		} finally {
			setIsLoading(false);
		}
	}, [courseId]);

	useEffect(() => {
		if (courseId) {
			fetchRegistrants();
		}
	}, [courseId, fetchRegistrants]);

	const handleSearchUsers = async () => {
		if (!userSearch.trim()) return;
		setHasSearchedUsers(true);
		setIsSearching(true);
		setSearchResults([]);
		setSelectedUser(null);
		try {
			const res = await apiClient.get(
				`/users?search=${encodeURIComponent(userSearch)}&pagination=false`
			);
			setSearchResults(res.data.users || []);
		} catch {
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleEnrollUser = async () => {
		if (!selectedUser || !courseId) return;
		setIsEnrolling(true);
		setEnrollMessage(null);
		try {
			const res = await apiClient.post("/users/register", {
				userId: selectedUser._id,
				courseIds: [courseId],
			});
			const result = res.data.results?.[0];
			if (result?.status === "already-enrolled") {
				setEnrollMessage({
					text: "This user is already enrolled in the course.",
					isError: true,
				});
			} else if (result?.status === "waitlisted") {
				setEnrollMessage({
					text: "User has been added to the waitlist.",
					isError: false,
				});
				await fetchRegistrants();
			} else {
				setEnrollMessage({
					text: `${selectedUser.name} has been enrolled successfully.`,
					isError: false,
				});
				await fetchRegistrants();
			}
		} catch (err: any) {
			setEnrollMessage({
				text: err?.response?.data?.message || "Enrollment failed.",
				isError: true,
			});
		} finally {
			setIsEnrolling(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setUserSearch("");
		setSearchResults([]);
		setHasSearchedUsers(false);
		setSelectedUser(null);
		setEnrollMessage(null);
	};

	const handleDelete = async (id: string) => {
		setIsDeletingId(id);
		try {
			await adminApiClient.post(`/courses/${courseId}/drop`, { userId: id });
			setRegistrants((prev) => prev.filter((r) => r.id !== id));
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message;
			if (error?.response?.status === 409) {
				alert("Cannot remove user who has already completed the course.");
			} else {
				alert(errorMsg || "Failed to remove user from course.");
			}
		} finally {
			setIsDeletingId(null);
		}
	};

	const handleDownloadCSV = () => {
		if (!registrants.length) {
			console.warn("No registrants data available to download");
			return;
		}

		// Create headers
		const headers = [
			"User Type",
			"Full Name",
			"Email",
			"Registration Date",
			"Completed",
			"Amount Paid",
			"Transaction ID",
		];

		// Create rows
		const rows = registrants.map((registrant) => [
			registrant.userType,
			registrant.fullName,
			registrant.email,
			registrant.registrationDate,
			registrant.completed,
			registrant.paid,
			registrant.transactionId,
		]);

		// Combine headers and rows
		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		// Create and trigger download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", "registrants.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const filteredRegistrants = registrants.filter((r) =>
		r.fullName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="text-center py-12 text-sm">Loading registrants...</div>
		);
	}

	if (error) {
		return <div className="text-center py-12 text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col items-stretch w-full h-full bg-white">
			<div className="flex flex-col w-full p-6 gap-4">
				<h1 className="text-2xl font-semibold text-gray-800">Registrants</h1>

				<div className="flex items-center w-full gap-4">
					<div className="w-full flex focus-within:ring-2 focus-within:ring-[#a881c2] focus-within:ring-offset-1 rounded-md">
						<input
							type="text"
							placeholder="Enter registrant name"
							className="peer p-2 border border-gray-300 rounded-l-md flex-grow focus:outline-none text-sm"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button className="peer-focus:bg-[#7b4899] px-4 py-2 bg-[#a881c2] text-white rounded-r-md hover:bg-[#936aa9] transition-colors duration-200 text-sm font-medium">
							Search
						</button>
					</div>
					<button
						className="px-4 py-2 bg-[#7b4899] text-white rounded-md hover:bg-[#6a3e83] transition-colors duration-200 text-sm font-medium min-w-max"
						onClick={() => setIsModalOpen(true)}
					>
						+ Add New User
					</button>
					<button
						className="px-4 py-2 bg-[#7b4899] text-white rounded-md hover:bg-[#6a3e83] transition-colors duration-200 text-sm font-medium min-w-max"
						onClick={handleDownloadCSV}
					>
						Download as CSV
					</button>
				</div>

				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
							<h2 className="text-lg font-semibold text-gray-800">
								Enroll a User
							</h2>

							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Search by name or email"
									className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#a881c2]"
									value={userSearch}
									onChange={(e) => setUserSearch(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
								/>
								<button
									className="px-3 py-2 bg-[#a881c2] text-white rounded-md hover:bg-[#936aa9] text-sm font-medium disabled:opacity-50"
									onClick={handleSearchUsers}
									disabled={isSearching}
								>
									{isSearching ? "..." : "Search"}
								</button>
							</div>

							{searchResults.length > 0 && (
								<ul className="border border-gray-200 rounded-md max-h-48 overflow-y-auto divide-y divide-gray-100">
									{searchResults.map((user) => (
										<li
											key={user._id}
											className={`px-3 py-2 cursor-pointer text-sm hover:bg-purple-50 ${selectedUser?._id === user._id ? "bg-purple-100 font-medium" : ""}`}
											onClick={() => setSelectedUser(user)}
										>
											<span className="text-gray-800">{user.name}</span>
											<span className="text-gray-400 ml-2 text-xs">
												{user.email}
											</span>
										</li>
									))}
								</ul>
							)}

							{hasSearchedUsers &&
								searchResults.length === 0 &&
								userSearch.trim() &&
								!isSearching && (
									<p className="text-sm text-gray-400">No users found.</p>
								)}

							{selectedUser && (
								<p className="text-sm text-gray-600">
									Selected:{" "}
									<span className="font-medium">{selectedUser.name}</span> (
									{selectedUser.email})
								</p>
							)}

							{enrollMessage && (
								<p
									className={`text-sm ${enrollMessage.isError ? "text-red-500" : "text-green-600"}`}
								>
									{enrollMessage.text}
								</p>
							)}

							<div className="flex justify-end gap-2 pt-2">
								<button
									className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
									onClick={handleCloseModal}
								>
									Cancel
								</button>
								<button
									className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
									onClick={handleEnrollUser}
									disabled={!selectedUser || isEnrolling}
								>
									{isEnrolling ? "Enrolling..." : "Enroll"}
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="overflow-x-auto">
					<table className="w-full table-fixed divide-y divide-gray-200 border border-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{tableHeaderCategories.map((category) => (
									<TableHeader
										key={category.name}
										category={category.name}
										width={category.width}
									/>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredRegistrants.length === 0 ? (
								<tr>
									<td colSpan={9} className="text-center py-4 text-gray-500">
										No registrants found.
									</td>
								</tr>
							) : (
								filteredRegistrants.map((registrant) => (
									<tr
										key={registrant.id}
										className="hover:bg-gray-100 text-sm text-gray-700"
									>
										<TableCell text={registrant.userType} />
										<TableCell text={registrant.fullName} />
										<TableCell text={registrant.email} />
										<TableCell text={registrant.registrationDate} />
										<TableCell text={registrant.completed} />
										<TableCell text={registrant.paid} />
										<TableCell text={registrant.transactionId} />
										<td className="px-4 py-3 text-center">
											<button
												onClick={() => handleDelete(registrant.id)}
												className="text-red-500 hover:text-red-700 disabled:opacity-50"
												disabled={isDeletingId === registrant.id}
												aria-label={`Delete ${registrant.fullName}`}
											>
												{isDeletingId === registrant.id ? (
													"..."
												) : (
													<FaTrashAlt />
												)}
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

const tableHeaderCategories = [
	{ name: "User Type", width: "17%" },
	{ name: "Full Name", width: "30%" },
	{ name: "Email", width: "21%" },
	{ name: "Registration", width: "8%" },
	{ name: "Completed", width: "7%" },
	{ name: "$ Paid", width: "7%" },
	{ name: "Transaction ID", width: "10%" },
	{ name: "Delete", width: "5%" },
];

const TableHeader = ({
	category,
	width,
}: {
	category: string;
	width: string;
}) => (
	<th
		scope="col"
		className={`min-w-content w-[${width}] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200`}
	>
		{category}
	</th>
);

const TableCell = ({ text }: { text: string }) => (
	<td className="px-2 py-2 border-r border-gray-200 break-words text-xs">
		{text}
	</td>
);
