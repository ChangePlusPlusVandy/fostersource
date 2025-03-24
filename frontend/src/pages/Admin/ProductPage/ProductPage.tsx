import React, { useState, useEffect } from "react";
import {
	Search,
	Edit2,
	Trash2,
	Calendar,
	Star,
	ChevronDown,
	PictureInPicture2,
	List,
	ShieldCheck,
} from "lucide-react";
import apiClient from "../../../services/apiClient";
import { Course } from "../../../shared/types/course";
import { Rating } from "../../../shared/types/rating";
import { Link } from "react-router-dom";

export interface Product {
	id: number;
	course: Course;
	status: string;
	avgRating: number;
	startTime: Date;
	endTime: Date;
	timeZone: string;
	selected: boolean;
}

export const Pagination = ({
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

export default function ProductPage() {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [searchQuery, setSearchQuery] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const elemColors: Record<string, string> = {
		Ongoing: "#30CD5A",
		"Open Registration": "#F79518",
		"Closed Registration": "#BE0000",
		Storage: "#444444",
	};

	const selectedCount = products.filter((d) => d.selected).length;
	const displayedProducts = products
		.filter((product) =>
			product.course.className.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const totalPages: number = Math.ceil(
		products.filter((product) =>
			product.course.className.toLowerCase().includes(searchQuery.toLowerCase())
		).length / itemsPerPage
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const calculateAverageRating = (ratings: Rating[]) => {
		let average = 0;
		let num = 0;
		let times = 0;
		for (let i = 0; i < ratings.length; i++) {
			num += ratings[i].rating;
			times++;
		}
		average = times > 0 ? num / times : 0;
		average.toFixed(2);
		return average;
	};

	const fetchProducts = async () => {
		try {
			const response = await apiClient.get("/courses");
			console.log(response);

			const receivedCourses: Product[] = response.data.data.map(
				(course: Course) => ({
					course: course,
					status: "Ongoing",
					avgRating: calculateAverageRating(course.ratings),
					startTime: new Date(course.time),
					endTime: new Date(
						new Date(course.time).getTime() + course.lengthCourse * 60000
					),
					timeZone: "(CST)",
					selected: false,
				})
			);

			const currentTime = new Date();
			for (let i = 0; i < receivedCourses.length; ++i) {
				if (
					receivedCourses[i].course.regStart <= currentTime &&
					currentTime <= receivedCourses[i].course.regEnd
				) {
					receivedCourses[i].status = "Open Registration";
				} else if (currentTime > receivedCourses[i].endTime) {
					receivedCourses[i].status = "Storage";
				} else if (receivedCourses[i].startTime <= currentTime) {
					receivedCourses[i].status = "Ongoing";
				} else {
					receivedCourses[i].status = "Closed Registration";
				}
			}

			setProducts(receivedCourses);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleSelection = (id: number) => {
		setProducts(
			products.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
		);
	};

	const setFilter = (filterType: string, filterSpec: string) => {};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="max-w-screen-2xl mx-auto px-8 py-6">
				<div className="bg-white border rounded-lg p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Products</h1>
					</div>

					<div className="mb-6">
						<div className="relative w-full">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-4 pr-16 py-3 rounded-lg border bg-white text-gray-800 placeholder-gray-400"
								placeholder="Search products..."
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
							{selectedCount === 0 ? (
								<>
									<button
										className="flex rounded-lg border px-4 py-2.5 font-medium"
										style={{ borderColor: "#6C6C6C", color: "#6C6C6C" }}
										onClick={() => {}}
									>
										CATEGORY
										<ChevronDown></ChevronDown>
									</button>
									<button
										className="flex rounded-lg border px-4 py-2.5 font-medium"
										style={{ borderColor: "#6C6C6C", color: "#6C6C6C" }}
										onClick={() => {}}
									>
										STATUS
										<ChevronDown></ChevronDown>
									</button>
									<button
										className="flex rounded-lg border px-4 py-2.5 font-medium"
										style={{ borderColor: "#6C6C6C", color: "#6C6C6C" }}
										onClick={() => {}}
									>
										TYPE
										<ChevronDown></ChevronDown>
									</button>
									<button
										className="flex rounded-lg border px-4 py-2.5 font-medium"
										style={{ borderColor: "#6C6C6C", color: "#6C6C6C" }}
										onClick={() => {}}
									>
										FORMAT
										<ChevronDown></ChevronDown>
									</button>
									<button
										className="flex rounded-lg border px-4 py-2.5 font-medium"
										style={{ borderColor: "#6C6C6C", color: "#6C6C6C" }}
										onClick={() => {}}
									>
										CREATED
										<ChevronDown></ChevronDown>
									</button>
								</>
							) : (
								<>
									<span style={{ color: "#8757a3" }}>
										{selectedCount} Selected
									</span>
									<button
										className="text-red-600 font-bold"
										onClick={() => {
											setProducts(products.filter((d) => !d.selected));
											setCurrentPage((prevPage) => {
												const totalPages = Math.ceil(
													products.filter((d) => !d.selected).length /
														itemsPerPage
												);
												return prevPage > totalPages
													? Math.max(totalPages, 1)
													: prevPage;
											});
										}}
									>
										Delete
									</button>
								</>
							)}
						</div>
						<button
							className="text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
							style={{ backgroundColor: "#8757a3" }}
							onClick={() => {
								setIsModalOpen(true);
							}}
						>
							Add Course
						</button>
					</div>

					{displayedProducts.length === 0 ? (
						<div className="text-center text-gray-500">No courses found.</div>
					) : (
						<>
							<div className="space-y-2 text-sm">
								{displayedProducts.map((product) => (
									<div
										key={product.id}
										className={`flex items-center justify-between w-full pr-3 rounded-lg border relative`}
										style={{
											backgroundColor: product.selected ? "#f5f0f7" : "white",
										}}
									>
										<div
											className="absolute left-0 top-0 rounded-l-lg w-1 h-full"
											style={{ backgroundColor: elemColors[product.status] }}
										></div>

										<div className="flex items-center space-x-6 flex-1 py-3 ml-3">
											<input
												type="checkbox"
												checked={product.selected}
												onChange={() => toggleSelection(product.id)}
												className="w-5 h-5"
												style={{ accentColor: "#8757a3" }}
											/>
											<div className="flex items-center gap-2">
												<span className="font-medium">
													{product.course.className}
												</span>
											</div>
										</div>

										<div className="flex items-center justify-end space-x-6 flex-1 py-3">
											<span className="text-gray-500">{product.avgRating}</span>
											<div className="flex">
												{Array.from(
													{ length: Math.floor(product.avgRating) },
													() => (
														<Star className="w-4"></Star>
													)
												)}
												{Array.from(
													{ length: 5 - Math.floor(product.avgRating) },
													() => (
														<Star className="w-4"></Star>
													)
												)}
											</div>

											<span className="text-gray-500 w-16">
												{product.course.creditNumber} credits
											</span>
											<Calendar className="w-12"></Calendar>
											<span className="text-gray-500 w-24">
												{product.course.isLive ? "Live" : "Virtual"} Event{" "}
												{product.startTime.getMonth()}/
												{product.startTime.getDate()}/
												{product.startTime.getFullYear()} at{" "}
												{product.startTime.getHours()}:
												{product.startTime
													.getMinutes()
													.toString()
													.padStart(2, "0")}{" "}
												{product.timeZone}
											</span>

											<div className="flex flex-col space-y-2 w-36">
												<div className="flex flex-row justify-between">
													<div
														className="flex rounded-lg border text-white px-1 group relative"
														style={{ backgroundColor: "#9C75B4" }}
													>
														<PictureInPicture2></PictureInPicture2>
														<List></List>
														<ShieldCheck></ShieldCheck>
														<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-24 p-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg group-hover:block">
															{"Includes: Webinar, Survey, Certificate"}
														</div>
													</div>
													<div
														className="text-white rounded-lg px-1 items-center justify-center flex"
														style={{ backgroundColor: "#9C75B4" }}
													>
														$0-$25
													</div>
												</div>
												<div className="flex flex-row justify-between">
													<div
														className="text-white rounded-lg px-1"
														style={{ backgroundColor: "#9C75B4" }}
													>
														Live
													</div>
													<div
														className="text-white rounded-lg px-1"
														style={{ backgroundColor: "#9C75B4" }}
													>
														{product.course.students.length} registered
													</div>
												</div>
											</div>

											<div className="flex gap-4">
												<Link to={`/admin/product/edit?courseId=${product.id}`}>
													<Edit2 className="w-4 h-4 text-gray-400" />
												</Link>
												<button
													onClick={() =>
														// TODO: handle delete Product
														console.log("hi")
													}
												>
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
		</div>
	);
}
