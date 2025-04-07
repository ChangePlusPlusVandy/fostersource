import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import apiClient from "../../../services/apiClient";
import qs from "qs"; // Import query string library

interface User {
	_id: string;
	name: string; // Assuming 'fullName' comes from a 'name' field
	email: string;
	userType?: string; // Assuming userType might be part of the User model
}

interface RegistrantDisplayInfo {
	id: string; // Use User ID as key now
	userType: string;
	fullName: string;
	email: string;
	// Registration-specific fields - **NEED A SEPARATE SOURCE**
	registrationDate: string;
	completed: string;
	paid: string;
	transactionId: string;
	preRegistered: string;
}

export default function Registrants() {
	// const { courseId } = useParams<{ courseId: string }>(); //TODO Use useParams in real scenario
	const courseId = "67acf95247f5d8867107e881"; //Hardcoded for now based on previous code

	// --- State Variables ---
	const [registrants, setRegistrants] = useState<RegistrantDisplayInfo[]>([]);
	const [courseTitle, setCourseTitle] = useState<string>("Loading course...");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	// --- Data Fetching ---
	useEffect(() => {
		if (!courseId) {
			setError("Course ID is missing.");
			setIsLoading(false);
			return;
		}

		const fetchRegistrantData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				// 1. Fetch Course Details (Title and Student IDs)
				const courseResponse = await apiClient.get(`/courses/${courseId}`);
				const courseData = courseResponse.data.data;
				setCourseTitle(courseData.className || "Course Registrants");

				const studentIds: string[] = courseData.students || []; // Expecting an array of strings (ObjectIDs)

				if (studentIds.length === 0) {
					setRegistrants([]); // No students registered
					setIsLoading(false);
					return;
				}

				const userQuery = qs.stringify(
					{ _id: { $in: studentIds } },
					{ arrayFormat: "brackets" }
				);

				const usersResponse = await apiClient.get(`/users?${userQuery}`);
				const usersData: User[] = usersResponse.data; // Assuming the endpoint returns an array of users

				const displayData = usersData.map((user) => ({
					id: user._id, // Use user ID as the key
					userType: user.userType || "N/A", // Get from user object
					fullName: user.name || "Unknown User",
					email: user.email || "No email",
					// --- Placeholder Data ---
					registrationDate: "N/A", // Need source
					completed: "N/A", // Need source
					paid: "$?.??", // Need source
					transactionId: "-", // Need source
					preRegistered: "N/A", // Need source
				}));

				setRegistrants(displayData);
			} catch (err: any) {
				console.error("Failed to fetch registrants:", err);
				setError(
					`Failed to load registrant data. ${err.response?.data?.message || err.message}`
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRegistrantData();
	}, [courseId]); // Re-fetch if courseId changes

	// --- Event Handlers (handleDelete, handleSearch remain the same) ---
	const handleDelete = (registrantId: string) => {
		console.log("Attempting to delete registrant:", registrantId);
		// TODO: Implement API call to delete the user *or* registration? Clarify requirement.
		alert(`Deletion for user ID ${registrantId} not implemented yet.`);
	};

	const handleSearch = () => {
		console.log("Searching for:", searchTerm);
		// TODO: Implement search logic (client or server-side)
		alert("Search functionality not fully implemented.");
	};

	// --- Filtering for Search (Client-side example) ---
	const filteredRegistrants = registrants.filter(
		(r) =>
			r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			r.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading Registrants...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen text-red-500">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-gray-100">
			<div className="flex flex-col items-stretch w-full max-w-7xl h-full bg-white rounded-lg shadow">
				{/* Header Bar */}
				<div className="flex flex-row items-center justify-between w-full bg-[#a881c2] text-white h-12 rounded-t-lg p-3 text-sm font-medium">
					<span className="text-white text-lg font-semibold truncate px-2">
						{courseTitle} - Registrants
					</span>
				</div>

				{/* Content Area */}
				<div className="flex flex-col w-full p-6 gap-4">
					{/* Search and Download Bar */}
					<div className="flex items-center w-full gap-4 flex-wrap">
						<div className="flex-grow flex focus-within:ring-2 focus-within:ring-[#a881c2] focus-within:ring-offset-1 rounded-md min-w-[300px]">
							<input
								type="text"
								placeholder="Search by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								className="peer p-2 border border-gray-300 rounded-l-md flex-grow focus:outline-none text-sm"
							/>
							<button
								onClick={handleSearch}
								className="peer-focus:bg-[#7b4899] px-4 py-2 bg-[#a881c2] text-white rounded-r-md hover:bg-[#936aa9] transition-colors duration-200 text-sm font-medium"
							>
								Search
							</button>
						</div>
						<button className="flex-shrink-0 px-4 py-2 bg-[#7b4899] text-white rounded-md hover:bg-[#6a3e83] transition-colors duration-200 text-sm font-medium min-w-max">
							Download as TSV
						</button>
					</div>

					{/* Table Area */}
					<div className="overflow-x-auto">
						<table className="w-full table-auto divide-y divide-gray-200 border border-gray-200">
							<thead className="bg-gray-50">
								<tr>
									{tableHeaderCategories.map((category) => (
										<TableHeader key={category.name} category={category.name} />
									))}
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{/* Map over filtered registrants */}
								{filteredRegistrants.map((registrant) => (
									<tr
										key={registrant.id} // Using user ID now
										className="hover:bg-gray-100 text-sm text-gray-700"
									>
										{/* Render cells based on the user data (+ placeholders) */}
										<TableCell text={registrant.userType} />
										<TableCell text={registrant.fullName} />
										<TableCell text={registrant.email} />
										<TableCell text={registrant.registrationDate} />
										<TableCell text={registrant.completed} />
										<td className="px-2 py-2 border-r border-gray-200 break-words text-xs text-right">
											{registrant.paid}
										</td>
										<TableCell text={registrant.transactionId} />
										<TableCell text={registrant.preRegistered} />
										<td className="px-4 py-3 text-center">
											<button
												onClick={() => handleDelete(registrant.id)} // Pass user ID
												className="text-red-500 hover:text-red-700"
												aria-label={`Delete ${registrant.fullName}`}
											>
												<FaTrashAlt />
											</button>
										</td>
									</tr>
								))}
								{/* Empty/No Results States */}
								{filteredRegistrants.length === 0 && registrants.length > 0 && (
									<tr>
										<td
											colSpan={tableHeaderCategories.length}
											className="text-center py-4 text-gray-500"
										>
											No registrants found matching your search.
										</td>
									</tr>
								)}
								{registrants.length === 0 &&
									!isLoading && ( // Check isLoading to prevent flash of "No registrants"
										<tr>
											<td
												colSpan={tableHeaderCategories.length}
												className="text-center py-4 text-gray-500"
											>
												No registrants found for this course.
											</td>
										</tr>
									)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

// --- Static Definitions (TableHeader, TableCell, tableHeaderCategories remain the same) ---
const tableHeaderCategories = [
	{ name: "User Type" },
	{ name: "Full Name" },
	{ name: "Email" },
	{ name: "Registration" },
	{ name: "Completed" },
	{ name: "$ Paid" },
	{ name: "Transaction ID" },
	{ name: "Pre-registered" },
	{ name: "Delete" },
];

const TableHeader = ({ category }: { category: string }) => {
	return (
		<th
			scope="col"
			className={`px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0`}
		>
			{category}
		</th>
	);
};

const TableCell = ({ text }: { text: string }) => {
	return (
		<td className="px-2 py-2 border-r border-gray-200 break-words text-xs">
			{text}
		</td>
	);
};
