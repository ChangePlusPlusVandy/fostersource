import { FaTrashAlt } from "react-icons/fa";

export default function Registrants() {
	// Sample data based on the image - replace with your actual data source
	const registrantsData = [
		{
			userType: "Foster Parent (Colorado)",
			fullName: "Angela Shultzabergergacdaca",
			email: "vince.lin@vanderbilt.edu",
			registrationDate: "02/01/2025",
			completed: "03/01/2025", // Or could be a status like 'Completed'
			paid: "$20.00",
			transactionId: "9873214832147381",
			preRegistered: "Yes",
			id: "1", // Unique ID for key prop and delete action
		},
		{
			userType: "Former FP/Adoptive Parent/ Not currently fostering",
			fullName: "Angelafdsa Shultzaberfdafdsager",
			email: "vince.lin@vanderbilt.edu",
			registrationDate: "02/01/2025",
			completed: "1 out of 3", // Example of progress
			paid: "$0.00",
			transactionId: "", // Example of empty field
			preRegistered: "No",
			id: "2",
		},
		{
			userType: "Foster Parent (Non-Colorado)",
			fullName: "Angelagdasvdsa Shultzaberger",
			email: "vince.lin@vanderbilt.edu",
			registrationDate: "02/01/2025",
			completed: "0 out of 3",
			paid: "$10.00",
			transactionId: "4315636436147347",
			preRegistered: "No",
			id: "3",
		},
		// Add a longer name example to test wrapping
		{
			userType: "Very Long User Type Description That Might Need Wrapping",
			fullName: "Maximillian Bartholomew Von Shultzaberger III Esquire",
			email: "long.email.address.for.testing.wrapping@institution.example.com",
			registrationDate: "02/01/2025",
			completed: "Pending Review",
			paid: "$100.00",
			transactionId: "LongTransactionIDString1234567890abcdef",
			preRegistered: "Yes",
			id: "4",
		},
	];

	// Placeholder for delete function
	const handleDelete = (userId: string) => {
		console.log("Delete user:", userId);
		// Add your actual delete logic here
	};

	return (
		<div className="flex flex-col items-center justify-start min-h-screen w-full p-4 bg-gray-100">
			<div className="flex flex-col items-stretch w-full h-full bg-white rounded-lg shadow">
				<div className="flex flex-row items-center justify-between w-full bg-[#a881c2] text-white h-12 rounded-t-lg p-3 text-sm font-medium">
					<span className="text-white text-lg font-semibold">
						The Inclusive Family Support Model - Live Virtual (01/25/2025)
					</span>
					<div className="flex flex-row items-center gap-2 border border-solid px-2 p-1 rounded-md">
						✕
					</div>
				</div>

				<div className="flex flex-col w-full p-6 gap-4">
					<h1 className="text-2xl font-semibold text-gray-800">Registrants</h1>

					<div className="flex items-center w-full gap-4">
						<div className="w-full flex focus-within:ring-2 focus-within:ring-[#a881c2] focus-within:ring-offset-1 rounded-md">
							<input
								type="text"
								placeholder="Enter registrant name"
								className="peer p-2 border border-gray-300 rounded-l-md flex-grow focus:outline-none text-sm"
							/>
							<button className="peer-focus:bg-[#7b4899] px-4 py-2 bg-[#a881c2] text-white rounded-r-md hover:bg-[#936aa9] transition-colors duration-200 text-sm font-medium">
								Search
							</button>
						</div>
						<button className="px-4 py-2 bg-[#7b4899] text-white rounded-md hover:bg-[#6a3e83] transition-colors duration-200 text-sm font-medium min-w-max">
							Download as TSV
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
								{registrantsData.map((registrant) => (
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
										<TableCell text={registrant.preRegistered} />
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
								))}
								{registrantsData.length === 0 && (
									<tr>
										<td colSpan={9} className="text-center py-4 text-gray-500">
											No registrants found.
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

const tableHeaderCategories = [
	{ name: "User Type", width: "10%" },
	{ name: "Full Name", width: "30%" },
	{ name: "Email", width: "21%" },
	{ name: "Registration", width: "8%" },
	{ name: "Completed", width: "7%" },
	{ name: "$ Paid", width: "7%" },
	{ name: "Transaction ID", width: "10%" },
	{ name: "Pre-registered", width: "7%" },
	{ name: "Delete", width: "5%" },
];

const TableHeader = ({
	category,
	width,
}: {
	category: string;
	width: string;
}) => {
	return (
		<th
			scope="col"
			className={`min-w-content w-[${width}] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200`}
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
