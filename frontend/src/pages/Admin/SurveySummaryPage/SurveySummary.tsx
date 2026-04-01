import { Download, Eye, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import apiClient from "../../../services/apiClient";
import { Course } from "../../../shared/types/course";
import { Pagination } from "../ProductPage/ProductPage";
import DetailedSurveyResponse from "./DetailedSurveyResponse";

interface SurveyRow {
	surveyId: string;
	surveyName: string;
	version: number;
	courses: string[];
	totalResponses: number;
}

export default function SurveySummary() {
	const [searchOptions, setSearchOptions] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage] = useState(15);
	const [surveys, setSurveys] = useState<SurveyRow[]>([]);
	const [loading, setLoading] = useState(true);

	// Modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [modalSurveyId, setModalSurveyId] = useState<string>("");
	const [modalSurveyName, setModalSurveyName] = useState<string>("");

	const fetchSearchOptions = async () => {
		try {
			const response = await apiClient.get("/courses");
			const courseTitles: string[] = response.data.data.map(
				(course: Course) => course.className.toLowerCase()
			);
			setSearchOptions(courseTitles);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchSurveys = async () => {
		try {
			setLoading(true);

			// Fetch all active surveys
			const surveysResponse = await apiClient.get("/surveys");
			const allSurveys = surveysResponse.data.data || [];

			// Fetch stats for all surveys
			const statsResponse = await apiClient.get("/surveyResponses/stats");
			const allStats = statsResponse.data.data || [];

			// Build a map of surveyId -> total responses
			const responseCountMap: Record<string, number> = {};
			for (const stat of allStats) {
				const sid = stat.surveyId?.toString() || "";
				responseCountMap[sid] = (responseCountMap[sid] || 0) + stat.totalResponses;
			}

			// Fetch courses for name resolution
			const coursesResponse = await apiClient.get("/courses");
			const coursesMap: Record<string, string> = {};
			for (const course of coursesResponse.data.data || []) {
				coursesMap[course._id] = course.className;
			}

			const rows: SurveyRow[] = allSurveys.map((survey: any) => ({
				surveyId: survey._id,
				surveyName: survey.name || "Untitled Survey",
				version: survey.version || 1,
				courses: (survey.courseIds || []).map(
					(cid: string) => coursesMap[cid] || "Unknown"
				),
				totalResponses: responseCountMap[survey._id] || 0,
			}));

			setSurveys(rows);
		} catch (error) {
			console.error("Error fetching surveys:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSearchOptions();
		fetchSurveys();
	}, []);

	// Filter surveys by course name search
	const displayedSurveys = surveys.filter(
		(survey) =>
			searchQuery.length === 0 ||
			survey.courses.some((c) =>
				searchQuery.includes(c.toLowerCase())
			)
	);

	const totalPages = Math.ceil(displayedSurveys.length / itemsPerPage);
	const paginatedSurveys = displayedSurveys.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleViewDetails = (survey: SurveyRow) => {
		setModalSurveyId(survey.surveyId);
		setModalSurveyName(survey.surveyName);
		setModalOpen(true);
	};

	const handleExportAll = async () => {
		try {
			const response = await apiClient.get(
				"/surveyResponses/export?format=row-per-response",
				{ responseType: "blob" }
			);
			const blob = new Blob([response.data], {
				type: "text/csv;charset=utf-8;",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "all_survey_responses.csv";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error exporting all:", error);
		}
	};

	const handleExportSingle = async (surveyId: string, surveyName: string) => {
		try {
			const response = await apiClient.get(
				`/surveyResponses/export?surveyId=${surveyId}&format=row-per-response`,
				{ responseType: "blob" }
			);
			const blob = new Blob([response.data], {
				type: "text/csv;charset=utf-8;",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `${surveyName.replace(/\s+/g, "_")}_responses.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error exporting:", error);
		}
	};

	return (
		<div className="w-full min-h-screen bg-gray-100">
			{modalOpen && (
				<DetailedSurveyResponse
					surveyId={modalSurveyId}
					surveyName={modalSurveyName}
					toggleModal={setModalOpen}
				/>
			)}

			<div className="max-w-screen-2xl mx-auto px-8 py-6 space-y-4">
				<div className="bg-white border rounded-xl shadow-sm p-6">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-800">
								Survey Results
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								{surveys.length} survey{surveys.length !== 1 ? "s" : ""} &middot;{" "}
								{surveys.reduce((sum, s) => sum + s.totalResponses, 0)} total
								responses
							</p>
						</div>
						<button
							onClick={handleExportAll}
							className="flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
							style={{ backgroundColor: "#8757a3" }}
						>
							<Download className="w-4 h-4" />
							Export All
						</button>
					</div>

					{/* Search */}
					<SearchDropdown
						options={searchOptions}
						selected={searchQuery}
						setSelected={setSearchQuery}
						placeholder="Filter by course name..."
					/>

					{/* Table */}
					{loading ? (
						<div className="flex justify-center py-12">
							<p className="text-gray-500">Loading surveys...</p>
						</div>
					) : displayedSurveys.length === 0 ? (
						<div className="flex justify-center py-12">
							<p className="text-gray-500">No surveys found.</p>
						</div>
					) : (
						<div className="overflow-hidden rounded-lg border border-gray-200 mt-4">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-gray-50 text-left text-gray-600">
										<th className="px-4 py-3 font-medium">Survey Name</th>
										<th className="px-4 py-3 font-medium">
											Associated Courses
										</th>
										<th className="px-4 py-3 font-medium text-center">
											Version
										</th>
										<th className="px-4 py-3 font-medium text-center">
											Responses
										</th>
										<th className="px-4 py-3 font-medium text-center">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{paginatedSurveys.map((survey, rowIdx) => (
										<tr
											key={survey.surveyId}
											className={`hover:bg-gray-50 transition ${
												rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
											}`}
										>
											<td className="px-4 py-3 font-medium text-gray-800">
												{survey.surveyName}
											</td>
											<td className="px-4 py-3">
												<div className="flex flex-wrap gap-1">
													{survey.courses.length > 0 ? (
														survey.courses.map((course, idx) => (
															<span
																key={idx}
																className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full"
															>
																{course}
															</span>
														))
													) : (
														<span className="text-gray-400 text-xs">
															No courses
														</span>
													)}
												</div>
											</td>
											<td className="px-4 py-3 text-center text-gray-500">
												v{survey.version}
											</td>
											<td className="px-4 py-3 text-center">
												<span
													className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
														survey.totalResponses > 0
															? "bg-green-50 text-green-700"
															: "bg-gray-100 text-gray-500"
													}`}
												>
													{survey.totalResponses}
												</span>
											</td>
											<td className="px-4 py-3">
												<div className="flex items-center justify-center gap-2">
													<button
														onClick={() => handleViewDetails(survey)}
														className="p-1.5 hover:bg-gray-100 rounded-md transition"
														title="View details"
													>
														<Eye className="w-4 h-4 text-gray-500" />
													</button>
													<button
														onClick={() =>
															handleExportSingle(
																survey.surveyId,
																survey.surveyName
															)
														}
														className="p-1.5 hover:bg-gray-100 rounded-md transition"
														title="Export CSV"
													>
														<Download className="w-4 h-4 text-gray-500" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-end mt-6">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
