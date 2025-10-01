import React, { useState, useEffect } from "react";
import { Search, Edit2, Download, X } from "lucide-react";
import { Course } from "../../../shared/types/course";
import { User } from "../../../shared/types/user";
import { Progress } from "../../../shared/types/progress";
import apiClient from "../../../services/apiClient";
import { format } from "date-fns";
import Select from "react-select/async";
import { useParams } from "react-router-dom";

interface UserProgress {
	user: User;
	course: Course;
	isComplete: boolean;
	completedComponents: {
		webinar?: boolean;
		survey?: boolean;
		certificate?: boolean;
	};
	dateCompleted?: Date;
	registeredDate?: Date;
}

interface CourseOption {
	value: string;
	label: string;
	course: Course;
}

interface EditProgressModalProps {
	isOpen: boolean;
	onClose: () => void;
	progress: UserProgress;
	onSave: (updatedProgress: UserProgress) => void;
}

const EditProgressModal: React.FC<EditProgressModalProps> = ({
	isOpen,
	onClose,
	progress,
	onSave,
}) => {
	const [editedProgress, setEditedProgress] = useState<UserProgress>(progress);

	// Update local state when progress prop changes
	useEffect(() => {
		setEditedProgress(progress);
	}, [progress]);

	if (!isOpen) return null;

	const handleComponentChange = (
		component: "webinar" | "survey" | "certificate",
		checked: boolean
	) => {
		console.log("Component change:", component, checked);
		const updatedProgress = {
			...editedProgress,
			completedComponents: {
				...editedProgress.completedComponents,
				[component]: checked,
			},
		};

		// Check if all components are complete
		const allComplete = Object.values(
			updatedProgress.completedComponents
		).every(Boolean);
		updatedProgress.isComplete = allComplete;
		if (allComplete && !updatedProgress.dateCompleted) {
			updatedProgress.dateCompleted = new Date();
		}

		setEditedProgress(updatedProgress);
	};

	const handleSave = () => {
		console.log("Save button clicked");
		console.log("Current edited progress:", editedProgress);
		onSave(editedProgress);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-[400px]">
				<div className="flex justify-between items-start mb-6">
					<div className="space-y-1 flex-1">
						<h2 className="text-xl font-semibold">Edit User Progress</h2>
						<div className="space-y-1">
							<p className="text-sm text-gray-600">
								<span className="font-medium">Product: </span>
								{progress.course.className}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">User: </span>
								{progress.user.name}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<X size={20} />
					</button>
				</div>

				<div className="space-y-4">
					<div className="space-y-3">
						<div className="flex items-center">
							<span className="w-20 text-sm">Workshop</span>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={editedProgress.completedComponents.webinar}
									onChange={(e) =>
										handleComponentChange("webinar", e.target.checked)
									}
									className="rounded border-gray-300"
								/>
								<span className="text-sm">Done?</span>
							</label>
						</div>

						<div className="flex items-center">
							<span className="w-20 text-sm">Survey</span>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={editedProgress.completedComponents.survey}
									onChange={(e) =>
										handleComponentChange("survey", e.target.checked)
									}
									className="rounded border-gray-300"
								/>
								<span className="text-sm">Done?</span>
							</label>
						</div>

						<div className="flex items-center">
							<span className="w-20 text-sm">Certificate</span>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={editedProgress.completedComponents.certificate}
									onChange={(e) =>
										handleComponentChange("certificate", e.target.checked)
									}
									className="rounded border-gray-300"
								/>
								<span className="text-sm">Done?</span>
							</label>
						</div>
					</div>

					<div className="flex justify-end space-x-2 mt-6">
						<button
							onClick={onClose}
							className="px-4 py-2 text-gray-600 hover:text-gray-800"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 bg-[#8757a3] text-white rounded hover:bg-[#6d4a92]"
						>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

interface ProductProgressReportProps {
	fixedCourseId: boolean;
}

const ProductProgressReport: React.FC<ProductProgressReportProps> = ({
	fixedCourseId,
}) => {
	const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(
		null
	);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedUserType, setSelectedUserType] = useState("All");
	const [excludeFinished, setExcludeFinished] = useState(false);
	const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
	const [originalUserProgress, setOriginalUserProgress] = useState<
		UserProgress[]
	>([]);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(15);
	const [allCourses, setAllCourses] = useState<CourseOption[]>([]);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedProgress, setSelectedProgress] = useState<UserProgress | null>(
		null
	);

	const { id: courseId } = useParams();

	// Load courses from API
	useEffect(() => {
		const fetchAllCourses = async () => {
			try {
				const response = await apiClient.get("/courses");
				const courses = response.data.data.map((course: Course) => ({
					value: course._id,
					label: course.className,
					course: course,
				}));
				setAllCourses(courses);
			} catch (error) {
				console.error("Error fetching courses:", error);
				setAllCourses([]);
			}
		};
		if (!fixedCourseId) fetchAllCourses();
	}, []);

	useEffect(() => {
		const fetchFixedCourse = async () => {
			if (!fixedCourseId) return;

			try {
				const response = await apiClient.get(`/courses/${courseId}`);
				const course = response.data.data;
				setSelectedCourse({
					value: course._id,
					label: course.className,
					course: course,
				});
			} catch (err) {
				console.error("Failed to load fixed course", err);
			}
		};

		fetchFixedCourse();
	}, [fixedCourseId]);

	// Load course options with search
	const loadCourseOptions = async (inputValue: string) => {
		if (!inputValue) {
			return allCourses;
		}

		const filteredCourses = allCourses.filter((course) =>
			course.label.toLowerCase().includes(inputValue.toLowerCase())
		);
		return filteredCourses;
	};

	// Fetch progress from API
	const fetchProgress = async () => {
		if (!selectedCourse?.value) return;

		setIsLoading(true);
		try {
			// Get enrolled users for the course
			const usersResponse = await apiClient.get(
				`/courses/${selectedCourse.value}/users`
			);
			const enrolledUsers = usersResponse.data.users;

			// Get progress data for the course
			const progressResponse = await apiClient.get(
				`/courses/${selectedCourse.value}/progress`
			);
			const courseProgress = progressResponse.data.progress || [];

			// Combine user data with progress data
			const combinedProgress: UserProgress[] = enrolledUsers.map(
				(user: User) => {
					const userProgress = courseProgress.find(
						(p: any) => p.user?._id === user._id
					);

					// Default progress values
					const defaultProgress = {
						isComplete: false,
						completedComponents: {
							webinar: false,
							survey: false,
							certificate: false,
						},
						dateCompleted: null,
						createdAt: new Date(),
					};

					// Merge user progress with defaults
					const mergedProgress = userProgress
						? {
								isComplete: userProgress.isComplete || false,
								completedComponents: {
									webinar: userProgress.completedComponents?.webinar || false,
									survey: userProgress.completedComponents?.survey || false,
									certificate:
										userProgress.completedComponents?.certificate || false,
								},
								dateCompleted: userProgress.dateCompleted || null,
								createdAt: userProgress.createdAt || new Date(),
							}
						: defaultProgress;

					return {
						user,
						course: selectedCourse.course,
						...mergedProgress,
					};
				}
			);

			let filteredProgress = combinedProgress;

			// Apply filters
			if (selectedUserType !== "All") {
				filteredProgress = filteredProgress.filter(
					(p) => p.user.role === selectedUserType
				);
			}

			if (startDate) {
				const start = new Date(startDate);
				filteredProgress = filteredProgress.filter(
					(p) => p.registeredDate && p.registeredDate >= start
				);
			}
			if (endDate) {
				const end = new Date(endDate);
				end.setHours(23, 59, 59, 999);
				filteredProgress = filteredProgress.filter(
					(p) => p.registeredDate && p.registeredDate <= end
				);
			}

			if (excludeFinished) {
				filteredProgress = filteredProgress.filter((p) => !p.isComplete);
			}

			setUserProgress(filteredProgress);
			setOriginalUserProgress(JSON.parse(JSON.stringify(filteredProgress))); // Deep copy
			setHasUnsavedChanges(false); // Reset change tracking when new data is loaded
		} catch (error) {
			console.error("Error fetching data:", error);
			setUserProgress([]);
			setOriginalUserProgress([]);
			setHasUnsavedChanges(false);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch progress when filters change
	useEffect(() => {
		if (selectedCourse) {
			fetchProgress();
		}
	}, [selectedCourse, startDate, endDate, selectedUserType, excludeFinished]);

	const handleSaveProgress = (updatedProgress: UserProgress) => {
		setUserProgress((prevProgress) =>
			prevProgress.map((p) =>
				p.user._id === updatedProgress.user._id
					? { ...p, ...updatedProgress }
					: p
			)
		);
		setHasUnsavedChanges(true); // Mark that changes have been made
		setEditModalOpen(false);
	};

	const handleSaveAllProgress = async () => {
		if (!selectedCourse?.value) return;

		try {
			const payload = userProgress.map((p) => ({
				userId: p.user._id,
				webinarComplete: p.completedComponents.webinar,
				surveyComplete: p.completedComponents.survey,
				certificateComplete: p.completedComponents.certificate,
				isComplete: p.isComplete,
				dateCompleted: p.dateCompleted,
			}));

			const response = await apiClient.put(
				`/courses/${selectedCourse.value}/progress/batch`,
				{ updates: payload }
			);

			if (response.data.success) {
				alert("All progress saved successfully.");
				// Reset change tracking after successful save
				setOriginalUserProgress(JSON.parse(JSON.stringify(userProgress))); // Deep copy
				setHasUnsavedChanges(false);
			} else {
				console.error("Batch update failed:", response.data.message);
				alert("Batch update failed.");
			}
		} catch (error) {
			console.error("Error during batch update:", error);
			alert("Error occurred while saving progress.");
		}
	};

	const handleDownloadCSV = () => {
		if (!userProgress.length) return;

		const headers = [
			"Name",
			"Email",
			"User Type",
			"Registered",
			"Completed",
			"Webinar",
			"Survey",
			"Certificate",
		];

		const rows = userProgress.map((progress) => [
			progress.user.name,
			progress.user.email,
			progress.user.role,
			progress.registeredDate
				? format(progress.registeredDate, "MM/dd/yyyy h:mm a")
				: "N/A",
			progress.dateCompleted
				? format(progress.dateCompleted, "MM/dd/yyyy h:mm a")
				: "N/A",
			progress.completedComponents.webinar ? "Complete" : "Incomplete",
			progress.completedComponents.survey ? "Complete" : "Incomplete",
			progress.completedComponents.certificate ? "Complete" : "Incomplete",
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`${selectedCourse?.label}_progress_report.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const displayedProgress = userProgress.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(userProgress.length / itemsPerPage);

	// Custom styles for react-select
	const selectStyles = {
		control: (base: any) => ({
			...base,
			minHeight: "42px",
			borderRadius: "0.5rem",
			borderColor: "#E5E7EB",
			boxShadow: "none",
			"&:hover": {
				borderColor: "#8757a3",
			},
		}),
		option: (
			base: any,
			state: { isSelected: boolean; isFocused: boolean }
		) => ({
			...base,
			backgroundColor: state.isSelected
				? "#8757a3"
				: state.isFocused
					? "#F3F4F6"
					: "white",
			color: state.isSelected ? "white" : "#374151",
			"&:active": {
				backgroundColor: "#8757a3",
			},
		}),
		input: (base: any) => ({
			...base,
			color: "#374151",
		}),
		placeholder: (base: any) => ({
			...base,
			color: "#9CA3AF",
		}),
		singleValue: (base: any) => ({
			...base,
			color: "#374151",
		}),
		menu: (base: any) => ({
			...base,
			borderRadius: "0.5rem",
			boxShadow:
				"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		}),
	};

	const handleEditClick = (progress: UserProgress) => {
		setSelectedProgress(progress);
		setEditModalOpen(true);
	};

	const [userTypes, setUserTypes] = useState<{ _id: string; name: string }[]>(
		[]
	);

	useEffect(() => {
		const fetchUserTypes = async () => {
			try {
				const response = await apiClient.get("/user-types");
				setUserTypes(response.data.data);
			} catch (error) {
				console.error("Error fetching user types:", error);
			}
		};
		fetchUserTypes();
	}, []);

	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="max-w-screen-2xl mx-auto px-8 py-6 h-full">
				<div className="bg-white border rounded-lg p-6 h-full flex flex-col">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Product Progress Report</h1>
					</div>

					<div className="flex flex-col flex-1 min-h-0">
						{/* Course Search */}
						{!fixedCourseId && (
							<div className="relative mb-4">
								<Select
									placeholder="Search for a course..."
									value={selectedCourse}
									onChange={(option) =>
										setSelectedCourse(option as CourseOption)
									}
									loadOptions={loadCourseOptions}
									defaultOptions={allCourses}
									cacheOptions
									styles={selectStyles}
									isClearable
									className="w-full"
									noOptionsMessage={({ inputValue }) =>
										inputValue ? "No courses found" : "Type to search courses"
									}
								/>
							</div>
						)}

						{/* Filters */}
						<div className="flex items-center gap-4 mb-4">
							<button
								onClick={handleDownloadCSV}
								className="ml-auto bg-[#8757a3] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={!userProgress.length}
							>
								<Download size={16} />
								Download as CSV
							</button>
						</div>

						{/* Table Container */}
						<div className="flex-1 min-h-0 overflow-hidden">
							{isLoading ? (
								<div className="flex justify-center items-center h-full">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8757a3]"></div>
								</div>
							) : !selectedCourse ? (
								<div className="flex justify-center items-center h-full text-gray-500">
									Select a course to view progress report
								</div>
							) : displayedProgress.length === 0 ? (
								<div className="flex justify-center items-center h-full text-gray-500">
									No progress records found for the selected filters
								</div>
							) : (
								<div className="h-full overflow-auto">
									<table className="w-full table-fixed">
										<thead className="bg-gray-50 border-b sticky top-0">
											<tr>
												<th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Name
												</th>
												<th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Email
												</th>
												<th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Type
												</th>
												<th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Registered
												</th>
												<th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Completed
												</th>
												<th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Webinar
												</th>
												<th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Survey
												</th>
												<th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Certificate
												</th>
												<th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
													Edit
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{displayedProgress.map((progress) => (
												<tr
													key={progress.user._id}
													className="hover:bg-gray-50"
												>
													<td
														className="px-4 py-2 text-sm truncate"
														title={progress.user.name}
													>
														{progress.user.name}
													</td>
													<td
														className="px-4 py-2 text-sm truncate"
														title={progress.user.email}
													>
														{progress.user.email}
													</td>
													<td
														className="px-4 py-2 text-sm truncate"
														title={
															(progress.user.role as any)?.name ||
															progress.user.role ||
															"N/A"
														}
													>
														{(progress.user.role as any)?.name ||
															progress.user.role ||
															"N/A"}
													</td>
													<td className="px-4 py-2 text-sm">
														{progress.registeredDate ? (
															<div className="flex flex-col">
																<span>
																	{format(progress.registeredDate, "MM/dd/yy")}
																</span>
																<span className="text-xs text-gray-500">
																	{format(progress.registeredDate, "h:mm a")}{" "}
																	EST
																</span>
															</div>
														) : (
															"N/A"
														)}
													</td>
													<td className="px-4 py-2 text-sm">
														{progress.dateCompleted ? (
															<div className="flex flex-col">
																<span>
																	{format(progress.dateCompleted, "MM/dd/yy")}
																</span>
																<span className="text-xs text-gray-500">
																	{format(progress.dateCompleted, "h:mm a")} EST
																</span>
															</div>
														) : (
															"N/A"
														)}
													</td>
													<td className="px-4 py-2 text-sm">
														{progress.completedComponents.webinar ? (
															<div className="flex flex-col">
																<span className="text-green-600">✓</span>
																<span className="text-xs text-gray-500">
																	{format(new Date(), "MM/dd/yy")}
																</span>
															</div>
														) : (
															<span className="text-red-600">✗</span>
														)}
													</td>
													<td className="px-4 py-2 text-sm">
														{progress.completedComponents.survey ? (
															<div className="flex flex-col">
																<span className="text-green-600">✓</span>
																<span className="text-xs text-gray-500">
																	{format(new Date(), "MM/dd/yy")}
																</span>
															</div>
														) : (
															<span className="text-red-600">✗</span>
														)}
													</td>
													<td className="px-4 py-2 text-sm">
														{progress.completedComponents.certificate ? (
															<div className="flex flex-col">
																<span className="text-green-600">✓</span>
																<span className="text-xs text-gray-500">
																	{format(new Date(), "MM/dd/yy")}
																</span>
															</div>
														) : (
															<span className="text-red-600">✗</span>
														)}
													</td>
													<td className="px-4 py-2 text-sm">
														<button
															onClick={() => handleEditClick(progress)}
															className="text-gray-600 hover:text-gray-900"
														>
															<Edit2 size={16} />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>

						<button
							onClick={handleSaveAllProgress}
							disabled={!hasUnsavedChanges}
							className={`mt-4 px-4 py-2 rounded self-end ${
								hasUnsavedChanges
									? "bg-green-600 text-white hover:bg-green-700"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
						>
							Save All Changes
						</button>

						{/* Pagination */}
						{displayedProgress.length > 0 && (
							<div className="flex justify-end items-center gap-2 mt-4">
								<button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
								>
									‹
								</button>
								<span className="px-4 py-1 bg-[#8757a3] text-white rounded">
									{currentPage}
								</span>
								{Array.from(
									{ length: Math.min(3, totalPages - currentPage) },
									(_, i) => (
										<button
											key={currentPage + i + 1}
											onClick={() => setCurrentPage(currentPage + i + 1)}
											className="px-2 py-1 border rounded hover:bg-gray-50"
										>
											{currentPage + i + 1}
										</button>
									)
								)}
								{currentPage + 3 < totalPages && <span>...</span>}
								{currentPage + 3 < totalPages && (
									<button
										onClick={() => setCurrentPage(totalPages)}
										className="px-2 py-1 border rounded hover:bg-gray-50"
									>
										{totalPages}
									</button>
								)}
								<button
									onClick={() =>
										setCurrentPage((p) => Math.min(totalPages, p + 1))
									}
									disabled={currentPage === totalPages}
									className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
								>
									›
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Add the EditProgressModal component */}
			{selectedProgress && (
				<EditProgressModal
					isOpen={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					progress={selectedProgress}
					onSave={handleSaveProgress}
				/>
			)}
		</div>
	);
};

export default ProductProgressReport;
