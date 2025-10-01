import React, { useState, useEffect } from "react";
import { Expand } from "lucide-react";
import { Pagination } from "../ProductPage/ProductPage";
import apiClient from "../../../services/apiClient";
import { Payment } from "../../../shared/types/payment";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import { Course } from "../../../shared/types/course";
import { format } from "date-fns";

interface Registration {
	title: string;
	user: string;
	email: string;
	date: Date;
	transactionId: string;
	paid: number;
	userId: string; // Add userId for better tracking
}

export default function RegistrationPage() {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [regType, setRegType] = useState("In-Person");
	const regTypes = ["In-Person", "Online"];
	const [excludeZero, setExcludeZero] = useState(false);

	const [searchOptions, setSearchOptions] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string[]>([]);
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const displayedRegistrations = registrations
		.filter((registration) => {
			if (startDate && endDate) {
				return (
					registration.date >= new Date(startDate) &&
					registration.date <= new Date(endDate)
				);
			}
			return true;
		})
		.filter((registration) => {
			if (searchQuery.length === 0) return true;
			return searchQuery.includes(registration.title.toLowerCase());
		})
		.filter((registration) => (excludeZero ? registration.paid > 0 : true))
		.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const tableHeaders = [
		"Product Title",
		"Registered User Name",
		"Registered User Email",
		"Order Date",
		"Transaction ID",
		"$ Paid",
	];

	const fetchSearchOptions = async () => {
		try {
			const response = await apiClient.get("/courses");

			const courseTitles: string[] = response.data.data.map((course: Course) =>
				course.className.toLowerCase()
			);

			setSearchOptions(courseTitles);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchRegistrations = async () => {
		try {
			console.log("Fetching registrations from progress data...");
			const response = await apiClient.get("/progress");
			console.log("Progress response:", response.data);

			const receivedRegistrations: Registration[] = [];
			const courseTitles = new Map<string, string>();
			const userEmails = new Map<string, string>();
			const userNames = new Map<string, string>();
			const paymentData = new Map<
				string,
				{ transactionId: string; amount: number }
			>();

			// First, fetch payment data to get transaction info
			try {
				const paymentsResponse = await apiClient.get("/payments");
				for (const payment of paymentsResponse.data) {
					for (const courseId of payment.courses) {
						const key = `${payment.userId}-${courseId}`;
						paymentData.set(key, {
							transactionId: payment.transactionId || "N/A",
							amount: payment.amount || 0,
						});
					}
				}
			} catch (paymentError) {
				console.error("Error fetching payment data:", paymentError);
			}

			// Process progress data
			for (const progress of response.data.progresses || response.data || []) {
				console.log("Processing progress:", progress);

				const userId = progress.user?._id || progress.user;
				const courseId = progress.course?._id || progress.course;

				if (!userId || !courseId) {
					console.warn(
						"Skipping progress with missing user or course:",
						progress
					);
					continue;
				}

				// Get user info - check if already populated first
				let userEmail: string;
				let userName: string;

				// Check if user data is already populated in progress
				if (
					progress.user &&
					typeof progress.user === "object" &&
					progress.user.email
				) {
					userEmail = progress.user.email;
					userName = progress.user.name || "Unknown User";
					console.log("Using populated user data:", {
						email: userEmail,
						name: userName,
					});
				} else if (userEmails.has(userId) && userNames.has(userId)) {
					userEmail = userEmails.get(userId)!;
					userName = userNames.get(userId)!;
				} else {
					try {
						console.log("Fetching user:", userId);
						const userResp = await apiClient.get(`/users/${userId}`);
						console.log("User response:", userResp.data);
						userEmail = userResp.data.email || "Unknown Email";
						userName = userResp.data.name || "Unknown User";
						userEmails.set(userId, userEmail);
						userNames.set(userId, userName);
					} catch (userError) {
						console.error("Error fetching user:", userError);
						userEmail = "Unknown Email";
						userName = "Unknown User";
					}
				}

				// Get course info - check if already populated first
				let courseTitle: string;

				// Check if course data is already populated in progress
				if (
					progress.course &&
					typeof progress.course === "object" &&
					progress.course.className
				) {
					courseTitle = progress.course.className;
					console.log("Using populated course data:", courseTitle);
				} else if (courseTitles.has(courseId)) {
					courseTitle = courseTitles.get(courseId)!;
				} else {
					try {
						console.log("Fetching course:", courseId);
						const courseResp = await apiClient.get(`/courses/${courseId}`);
						console.log("Course response:", courseResp.data);
						courseTitle = courseResp.data.data.className;
						courseTitles.set(courseId, courseTitle);
					} catch (courseError) {
						console.error("Error fetching course:", courseError);
						courseTitle = "Unknown Course";
					}
				}

				// Get payment info
				const paymentKey = `${userId}-${courseId}`;
				const payment = paymentData.get(paymentKey) || {
					transactionId: "N/A",
					amount: 0,
				};

				// Use progress creation date as registration date
				const registrationDate = progress.createdAt
					? new Date(progress.createdAt)
					: new Date();

				receivedRegistrations.push({
					title: courseTitle,
					user: userName,
					userId: userId,
					email: userEmail,
					date: registrationDate,
					transactionId: payment.transactionId,
					paid: payment.amount,
				});
			}

			console.log("Final registrations:", receivedRegistrations);
			setRegistrations(receivedRegistrations);
		} catch (error) {
			console.error("Error in fetchRegistrations:", error);
		}
	};

	const handleToggle = () => {
		setExcludeZero(!excludeZero);
	};

	const downloadData = () => {
		if (!registrations.length) return;

		const headers = [
			"Product Title",
			"Registered User Name",
			"Registered User Email",
			"Order Date",
			"Transaction ID",
			"Amount Paid",
		];

		const rows = registrations.map((registration) => [
			registration.title,
			registration.user,
			registration.email,
			format(new Date(registration.date), "MM/dd/yyyy h:mm a"),
			registration.transactionId,
			`$${registration.paid.toFixed(2)}`,
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", "registration_report.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const removeQuery = (index: number) => {
		setSearchQuery((searchQuery) => searchQuery.filter((_, i) => i !== index));
	};

	useEffect(() => {
		fetchSearchOptions();
		fetchRegistrations();
	}, []);

	const totalPages: number = Math.ceil(
		displayedRegistrations.length / itemsPerPage
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="max-w-screen-2xl mx-auto px-8 py-6 space-y-4">
				<div className="bg-white border rounded-lg p-6">
					<div className="flex justify-between">
						<div className="mb-6">
							<h1 className="text-2xl font-bold">Registration Report</h1>
						</div>
						<Expand className="w-6 border rounded-lg p-1 cursor-pointer"></Expand>
					</div>

					<SearchDropdown
						options={searchOptions}
						selected={searchQuery}
						setSelected={setSearchQuery}
						placeholder="Search"
					></SearchDropdown>

					<div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
						<div className="flex space-x-2 py-2 text-xs">
							{searchQuery.map((title, index) => (
								<div
									key={index}
									className="text-white px-2 py-2 rounded-2xl flex items-center"
									style={{ backgroundColor: "#7B4899" }}
								>
									{title}
									<button
										className="ml-2 text-white"
										onClick={() => removeQuery(index)}
									>
										✕
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-between text-xs items-center mt-5">
						<div className="flex space-x-4">
							<div className="space-x-2">
								<label className="font-bold">Start Date</label>
								<input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									className="border rounded-md p-2"
								/>
							</div>
							<div className="space-x-2">
								<label className="font-bold">End Date</label>
								<input
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									className="border rounded-md p-2"
								/>
							</div>
							<div className="space-x-2">
								<label className="font-bold">Product Type</label>
								<select
									className="border rounded-md p-2"
									value={regType}
									onChange={(e) => setRegType(e.target.value)}
								>
									{regTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={excludeZero}
									onChange={handleToggle}
									className="w-5 h-5"
								/>
								<span className="font-bold">
									Exclude product users who paid $0
								</span>
							</div>
						</div>

						<button
							className={`text-white px-6 py-2.5 rounded-lg font-medium ${
								registrations.length
									? "hover:opacity-90"
									: "opacity-50 cursor-not-allowed"
							}`}
							style={{ backgroundColor: "#8757a3" }}
							onClick={downloadData}
							disabled={!registrations.length}
						>
							Download as CSV
						</button>
					</div>

					<table className="w-full border border-gray-300 rounded-md border-separate border-spacing-0 text-sm mt-5">
						<thead className="bg-gray-100 rounded-md">
							<tr>
								{tableHeaders.map((header, idx) => (
									<th
										key={idx}
										className="border border-gray-200 first:rounded-tl-md last:rounded-tr-md text-left px-3 py-3"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{displayedRegistrations.map((registration, rowIdx) => (
								<tr
									key={rowIdx}
									className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
								>
									<td className="border border-gray-200 text-left px-3 py-2">
										{registration.title}
									</td>
									<td className="border border-gray-200 text-left px-3 py-2">
										{registration.user}
									</td>
									<td className="border border-gray-200 text-left px-3 py-2">
										{registration.email}
									</td>
									<td className="border border-gray-200 text-left px-3 py-2">
										{registration.date instanceof Date &&
										!isNaN(registration.date.getTime())
											? registration.date.toDateString()
											: "Invalid Date"}
									</td>
									<td className="border border-gray-200 text-left px-3 py-2">
										{registration.transactionId}
									</td>
									<td className="border border-gray-200 text-left px-3 py-2">
										{registration.paid}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="flex justify-end mt-6">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages || 1}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
