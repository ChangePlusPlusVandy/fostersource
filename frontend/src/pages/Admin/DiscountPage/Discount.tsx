import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Users, Layers } from "lucide-react";
import Modal from "../../../components/Modal";

interface Discount {
	id: number;
	code: string;
	amount: number;
	date: string;
	time: string;
	timeZone: string;
	selected: boolean;
}

const Pagination = ({
	currentPage = 1,
	totalPages = 1,
	onPageChange = (page: number) => console.log(page),
}) => {
	const [showDropdown, setShowDropdown] = useState<number | null>(null);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
			setShowDropdown(null);
		}
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];

		if (totalPages <= 3) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(
					<button
						key={i}
						onClick={() => handlePageChange(i)}
						className={`px-4 py-2 min-w-[40px] ${currentPage === i ? "text-white bg-[#8757a3] rounded-lg" : "hover:bg-gray-50"}`}
					>
						{i}
					</button>
				);
			}
		} else {
			pageNumbers.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className={`px-4 py-2 min-w-[40px] ${currentPage === 1 ? "text-white bg-[#8757a3] rounded-lg" : "hover:bg-gray-50"}`}
				>
					1
				</button>
			);

			if (currentPage > 2) {
				pageNumbers.push(
					<div key="ellipsis-1" className="relative">
						<button onClick={() => setShowDropdown(1)} className="px-4 py-2">
							...
						</button>
						{showDropdown === 1 && (
							<div className="absolute bg-white shadow-md border rounded-md p-2">
								{Array.from({ length: currentPage - 2 }, (_, i) => (
									<button
										key={i + 2}
										onClick={() => handlePageChange(i + 2)}
										className="block w-full px-4 py-2 hover:bg-gray-100"
									>
										{i + 2}
									</button>
								))}
							</div>
						)}
					</div>
				);
			}

			let startPage = Math.max(2, currentPage);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(
					<button
						key={i}
						onClick={() => handlePageChange(i)}
						className={`px-4 py-2 min-w-[40px] ${currentPage === i ? "text-white bg-[#8757a3] rounded-lg" : "hover:bg-gray-50"}`}
					>
						{i}
					</button>
				);
			}

			if (currentPage < totalPages - 2) {
				pageNumbers.push(
					<div key="ellipsis-2" className="relative">
						<button onClick={() => setShowDropdown(2)} className="px-4 py-2">
							...
						</button>
						{showDropdown === 2 && (
							<div className="absolute bg-white shadow-md border rounded-md p-2">
								{Array.from(
									{ length: totalPages - (currentPage + 2) },
									(_, i) => (
										<button
											key={currentPage + 2 + i}
											onClick={() => handlePageChange(currentPage + 2 + i)}
											className="block w-full px-4 py-2 hover:bg-gray-100"
										>
											{currentPage + 2 + i}
										</button>
									)
								)}
							</div>
						)}
					</div>
				);
			}

			pageNumbers.push(
				<button
					key={totalPages}
					onClick={() => handlePageChange(totalPages)}
					className={`px-4 py-2 min-w-[40px] ${currentPage === totalPages ? "text-white bg-[#8757a3] rounded-lg" : "hover:bg-gray-50"}`}
				>
					{totalPages}
				</button>
			);
		}

		return pageNumbers;
	};

	return (
		<div className="flex items-center rounded-lg border bg-white overflow-hidden shadow-sm relative">
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
				aria-label="Previous page"
			>
				&#171;
			</button>

			{renderPageNumbers()}

			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
				aria-label="Next page"
			>
				&#187;
			</button>
		</div>
	);
};

const timeZones = ["(PST)", "(MST)", "(CST)", "(EST)", "(AKT)", "(HAT)"];

const times = Array.from({ length: 24 * 2 }, (_, i) => {
	const hour = i % 24;
	const period = hour < 12 ? "AM" : "PM";
	const displayHour = hour % 12 === 0 ? 12 : hour % 12;
	const minutes = i % 2 === 0 ? "00" : "30";
	return `${displayHour}:${minutes} ${period}`;
});

interface AddDiscountModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (newDiscount: {
		code: string;
		amount: number;
		date: string;
		time: string;
		timeZone: string;
	}) => void;
	discountToEdit?: Discount | null;
	onUpdate?: (updatedDiscount: Discount) => void;
	discounts: Discount[];
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
	isOpen,
	onClose,
	onAdd,
	discountToEdit,
	onUpdate,
	discounts,
}) => {
	const [newDiscount, setNewDiscount] = useState({
		code: "",
		amount: 0,
		date: "",
		time: "",
		timeZone: "",
	});

	useEffect(() => {
		if (discountToEdit) {
			setNewDiscount({
				code: discountToEdit.code,
				amount: discountToEdit.amount,
				date: discountToEdit.date,
				time: discountToEdit.time,
				timeZone: discountToEdit.timeZone,
			});
		} else {
			setNewDiscount({ code: "", amount: 0, date: "", time: "", timeZone: "" });
		}
	}, [discountToEdit]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formattedDate = newDiscount.date.split("-").reverse().join("/");

		if (discountToEdit) {
			onUpdate?.({ ...discountToEdit, ...newDiscount, date: formattedDate });
		} else {
			const newId = Math.max(...discounts.map((d) => d.id)) + 1;
			onAdd({
				id: newId,
				...newDiscount,
				date: formattedDate,
				selected: false,
			} as Discount);
		}

		setNewDiscount({ code: "", amount: 0, date: "", time: "", timeZone: "" });
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={discountToEdit ? "Edit Discount" : "Add Discount"}
			showCloseIcon
			footer={
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="mr-2 text-gray-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="discount-form"
						className="bg-[#8757a3] text-white px-4 py-2 rounded-lg"
					>
						{discountToEdit ? "Update Discount" : "Add Discount"}
					</button>
				</div>
			}
		>
			<form id="discount-form" onSubmit={handleSubmit}>
				<input
					type="text"
					value={newDiscount.code}
					onChange={(e) =>
						setNewDiscount({ ...newDiscount, code: e.target.value })
					}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					placeholder="Discount Code"
					required
				/>
				<input
					type="number"
					value={newDiscount.amount}
					onChange={(e) =>
						setNewDiscount({
							...newDiscount,
							amount: parseFloat(e.target.value),
						})
					}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					placeholder="Amount"
					required
				/>
				<input
					type="date"
					value={newDiscount.date}
					onChange={(e) =>
						setNewDiscount({ ...newDiscount, date: e.target.value })
					}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					required
				/>
				<select
					value={newDiscount.time}
					onChange={(e) =>
						setNewDiscount({ ...newDiscount, time: e.target.value })
					}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					required
				>
					<option value="">Select Time</option>
					{times.map((time) => (
						<option key={time} value={time}>
							{time}
						</option>
					))}
				</select>
				<select
					value={newDiscount.timeZone}
					onChange={(e) =>
						setNewDiscount({ ...newDiscount, timeZone: e.target.value })
					}
					className="border rounded-lg px-4 py-2 mb-4 w-full"
					required
				>
					<option value="">Select Time Zone</option>
					{timeZones.map((zone) => (
						<option key={zone} value={zone}>
							{zone}
						</option>
					))}
				</select>
			</form>
		</Modal>
	);
};

export default function DiscountsPage() {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [searchQuery, setSearchQuery] = useState("");
	const [discounts, setDiscounts] = useState<Discount[]>([
		...Array(50)
			.fill(null)
			.map((_, i) => ({
				id: i + 1,
				code: "newmexico",
				amount: 25.0,
				date: "09/01/2023",
				time: "12:00 AM",
				timeZone: "(PST)",
				selected: false,
			})),
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [discountToEdit, setDiscountToEdit] = useState<Discount | null>(null);

	useEffect(() => {
		const updateItemsPerPage = () => {
			const itemHeight = 100;
			const windowHeight = window.innerHeight;
			const headerHeight = 100;
			const footerHeight = 50;

			const availableHeight = windowHeight - headerHeight - footerHeight;
			const newItemsPerPage = Math.floor(availableHeight / itemHeight);
			setItemsPerPage(newItemsPerPage > 0 ? newItemsPerPage : 1);
		};

		updateItemsPerPage();
		window.addEventListener("resize", updateItemsPerPage);

		return () => {
			window.removeEventListener("resize", updateItemsPerPage);
		};
	}, []);

	const selectedCount = discounts.filter((d) => d.selected).length;

	const toggleSelection = (id: number) => {
		setDiscounts(
			discounts.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
		);
	};

	const handleDelete = (id: number) => {
		const updatedDiscounts = discounts.filter((d) => d.id !== id);
		setDiscounts(updatedDiscounts);

		const totalPages: number = Math.ceil(
			updatedDiscounts.length / itemsPerPage
		);
		if (currentPage > totalPages) {
			setCurrentPage(totalPages > 0 ? totalPages : 1);
		}
	};

	const handleAddDiscount = (newDiscount: {
		code: string;
		amount: number;
		date: string;
		time: string;
		timeZone: string;
	}) => {
		const newId = discounts.length
			? Math.max(...discounts.map((d) => d.id)) + 1
			: 1;
		const updatedDiscounts = [
			...discounts,
			{ id: newId, ...newDiscount, selected: false },
		];
		setDiscounts(updatedDiscounts);

		const totalItems = updatedDiscounts.length;
		const newPage = Math.ceil(totalItems / itemsPerPage);
		setCurrentPage(newPage);
	};

	const handleEditDiscount = (discount: Discount) => {
		setDiscountToEdit(discount);
		setIsModalOpen(true);
	};

	const handleUpdateDiscount = (updatedDiscount: Discount) => {
		setDiscounts(
			discounts.map((d) => (d.id === updatedDiscount.id ? updatedDiscount : d))
		);
		setDiscountToEdit(null);
		setIsModalOpen(false);
	};

	const totalPages: number = Math.ceil(
		discounts.filter((discount) =>
			discount.code.toLowerCase().includes(searchQuery.toLowerCase())
		).length / itemsPerPage
	);

	const displayedDiscounts = discounts
		.filter((discount) =>
			discount.code.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
						<h1 className="text-2xl font-bold">Discounts</h1>
					</div>

					<div className="mb-6">
						<div className="relative w-full">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-4 pr-16 py-3 rounded-lg border bg-white text-gray-800 placeholder-gray-400"
								placeholder="Search discounts..."
							/>
							<div className="absolute right-0 top-0 bottom-0 flex items-center rounded-r-lg overflow-hidden">
								<div className="h-full px-4 flex items-center bg-[#9c74b4]">
									<Search className="w-5 h-5 text-white" />
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-between items-center mb-6">
						<div className="flex items-center gap-4">
							<span style={{ color: "#8757a3" }}>{selectedCount} Selected</span>
							<button
								className="text-red-600 font-bold"
								onClick={() => {
									setDiscounts(discounts.filter((d) => !d.selected));
									setCurrentPage((prevPage) => {
										const totalPages = Math.ceil(
											discounts.filter((d) => !d.selected).length / itemsPerPage
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
						<button
							className="text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
							style={{ backgroundColor: "#8757a3" }}
							onClick={() => {
								setDiscountToEdit(null);
								setIsModalOpen(true);
							}}
						>
							Add Discount
						</button>
					</div>

					{displayedDiscounts.length === 0 ? (
						<div className="text-center text-gray-500">No discounts found.</div>
					) : (
						<>
							<div className="space-y-3">
								{displayedDiscounts.map((discount) => (
									<div
										key={discount.id}
										className={`flex items-center justify-between w-full p-4 rounded-lg border`}
										style={{
											backgroundColor: discount.selected ? "#f5f0f7" : "white",
										}}
									>
										<div className="flex items-center space-x-8 flex-1">
											<input
												type="checkbox"
												checked={discount.selected}
												onChange={() => toggleSelection(discount.id)}
												className="w-5 h-5"
												style={{ accentColor: "#8757a3" }}
											/>
											<div className="flex items-center gap-2">
												<span className="font-medium">{discount.code}</span>
												<div className="flex items-center gap-1">
													<div
														className="p-1 rounded-full"
														style={{ backgroundColor: "#8757a3" }}
													>
														<Users className="w-3 h-3 text-white" />
													</div>
													<div
														className="p-1 rounded-full"
														style={{ backgroundColor: "#8757a3" }}
													>
														<Layers className="w-3 h-3 text-white" />
													</div>
												</div>
											</div>
											<span className="font-medium">
												${discount.amount.toFixed(2)}
											</span>
										</div>
										<div className="flex items-center justify-end space-x-8 flex-1">
											<span className="text-gray-500">
												{discount.date} {discount.time} {discount.timeZone}
											</span>
											<div className="flex gap-4">
												<button onClick={() => handleEditDiscount(discount)}>
													<Edit2 className="w-4 h-4 text-gray-400" />
												</button>
												<button onClick={() => handleDelete(discount.id)}>
													<Trash2 className="w-4 h-4 text-gray-400" />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="flex justify-end mt-6">
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages || 1}
									onPageChange={handlePageChange}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			<AddDiscountModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setDiscountToEdit(null);
				}}
				onAdd={handleAddDiscount}
				discountToEdit={discountToEdit}
				onUpdate={handleUpdateDiscount}
				discounts={discounts}
			/>
		</div>
	);
}
