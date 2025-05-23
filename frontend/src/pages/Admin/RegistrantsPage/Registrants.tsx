import { useEffect, useState } from "react";
import { FaTrashAlt as _FaTrashAlt } from "react-icons/fa";
import { ComponentType } from "react";
import apiClient from "../../../services/apiClient";
import qs from "qs";
import { useCourseEditStore } from "../../../store/useCourseEditStore";

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

export default function Registrants() {
	const { students, setField, setAllFields } = useCourseEditStore();

	const courseId = "67acf95247f5d8867107e881"; // Replace with useParams later

	const [registrants, setRegistrants] = useState<RegistrantDisplayInfo[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRegistrants = async () => {
			try {
				const query = qs.stringify(
					{ _id: { $in: students } },
					{ arrayFormat: "brackets" }
				);
				const usersRes = await apiClient.get(`/users?${query}`);
				const users = usersRes.data.users;

				const formatted: RegistrantDisplayInfo[] = users.map((user: any) => ({
					id: user._id,
					userType: user.userType || "N/A",
					fullName: user.name || "Unknown",
					email: user.email || "No email",
					registrationDate: "N/A",
					completed: "N/A",
					paid: "$?.??",
					transactionId: "-",
					preRegistered: "N/A",
				}));

				// TODO: fix this

				setRegistrants(formatted);
			} catch (err: any) {
				console.error("Failed to load registrants", err);
				setError("Failed to load registrants.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRegistrants();
	}, [courseId]);

	const handleDelete = (id: string) => {
		console.log("Delete user:", id);
		setRegistrants((prev) => prev.filter((r) => r.id !== id));
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
						onClick={handleDownloadCSV}
					>
						Download as CSV
					</button>
				</div>

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
												className="text-red-500 hover:text-red-700"
												aria-label={`Delete ${registrant.fullName}`}
											>
												<FaTrashAlt />
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
