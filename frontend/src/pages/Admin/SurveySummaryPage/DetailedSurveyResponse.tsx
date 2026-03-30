import React, { useState, useEffect } from "react";
import apiClient from "../../../services/apiClient";
import { X, Download, Filter } from "lucide-react";
import PercentBar from "./PercentBar";

interface DetailedSurveyResponseProps {
	surveyId: string;
	surveyName: string;
	toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface QuestionStat {
	questionId: string;
	questionText: string;
	answerType: string;
	options: string[];
	totalAnswered: number;
	breakdown: Record<string, number>;
}

interface StatGroup {
	surveyId: string;
	surveyName: string;
	surveyVersion: number;
	courseId: string;
	courseName: string;
	totalResponses: number;
	questions: QuestionStat[];
}

export default function DetailedSurveyResponse({
	surveyId,
	surveyName,
	toggleModal,
}: DetailedSurveyResponseProps) {
	const [stats, setStats] = useState<StatGroup[]>([]);
	const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
	const [loading, setLoading] = useState(true);
	const [exportFormat, setExportFormat] = useState<string>("row-per-response");

	useEffect(() => {
		fetchStats();
	}, [surveyId]);

	const fetchStats = async () => {
		try {
			setLoading(true);
			const response = await apiClient.get(
				`/surveyResponses/stats?surveyId=${surveyId}`
			);
			setStats(response.data.data || []);
		} catch (error) {
			console.error("Error fetching survey stats:", error);
		} finally {
			setLoading(false);
		}
	};

	// Aggregate questions across all course groups or filter to one
	const filteredStats =
		selectedCourseId === "all"
			? stats
			: stats.filter((s) => s.courseId === selectedCourseId);

	// Merge question stats across filtered groups
	const mergedQuestions: QuestionStat[] = [];
	let totalResponses = 0;
	for (const group of filteredStats) {
		totalResponses += group.totalResponses;
		for (const q of group.questions) {
			const existing = mergedQuestions.find(
				(mq) => mq.questionId === q.questionId
			);
			if (existing) {
				existing.totalAnswered += q.totalAnswered;
				for (const [key, count] of Object.entries(q.breakdown)) {
					existing.breakdown[key] = (existing.breakdown[key] || 0) + count;
				}
			} else {
				mergedQuestions.push({
					...q,
					breakdown: { ...q.breakdown },
				});
			}
		}
	}

	// Unique courses for filter dropdown
	const courseOptions = stats.map((s) => ({
		id: s.courseId,
		name: s.courseName,
	}));
	const uniqueCourses = courseOptions.filter(
		(c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
	);

	const handleExport = async (format: string) => {
		try {
			const params = new URLSearchParams({ surveyId, format });
			if (selectedCourseId !== "all") {
				params.set("courseId", selectedCourseId);
			}
			const response = await apiClient.get(
				`/surveyResponses/export?${params.toString()}`,
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
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
			<div className="bg-white flex flex-col w-full max-w-7xl h-[90vh] shadow-xl rounded-xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
					<div>
						<h1 className="text-xl font-bold text-gray-800">{surveyName}</h1>
						<p className="text-sm text-gray-500">
							{totalResponses} total response{totalResponses !== 1 ? "s" : ""}
						</p>
					</div>
					<button
						className="p-2 hover:bg-gray-200 rounded-lg transition"
						onClick={() => toggleModal(false)}
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{/* Toolbar */}
				<div className="flex items-center justify-between px-6 py-3 border-b gap-4">
					<div className="flex items-center gap-3">
						<Filter className="w-4 h-4 text-gray-400" />
						<select
							value={selectedCourseId}
							onChange={(e) => setSelectedCourseId(e.target.value)}
							className="border rounded-lg px-3 py-2 text-sm bg-white"
						>
							<option value="all">All Courses</option>
							{uniqueCourses.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={exportFormat}
							onChange={(e) => setExportFormat(e.target.value)}
							className="border rounded-lg px-3 py-2 text-sm bg-white"
						>
							<option value="row-per-response">One row per response</option>
							<option value="row-per-answer">One row per answer</option>
						</select>
						<button
							className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
							style={{ backgroundColor: "#8757a3" }}
							onClick={() => handleExport(exportFormat)}
						>
							<Download className="w-4 h-4" />
							Export CSV
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="flex flex-1 overflow-hidden">
					{loading ? (
						<div className="flex items-center justify-center w-full">
							<p className="text-gray-500">Loading statistics...</p>
						</div>
					) : mergedQuestions.length === 0 ? (
						<div className="flex items-center justify-center w-full">
							<p className="text-gray-500">No responses yet.</p>
						</div>
					) : (
						<>
							{/* Left Panel - Question Breakdown */}
							<div className="w-5/12 border-r overflow-y-auto p-6 space-y-6">
								<h2 className="text-lg font-semibold text-gray-800">
									Question Breakdown
								</h2>
								{mergedQuestions.map((question, index) => (
									<div
										key={question.questionId}
										className="bg-gray-50 rounded-lg p-4 space-y-3"
									>
										<div className="flex items-start gap-3">
											<span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8757a3] text-white text-sm flex items-center justify-center font-medium">
												{index + 1}
											</span>
											<div className="flex-1">
												<p className="font-medium text-gray-800">
													{question.questionText}
												</p>
												<p className="text-xs text-gray-400 mt-0.5">
													{question.answerType} &middot;{" "}
													{question.totalAnswered} response
													{question.totalAnswered !== 1 ? "s" : ""}
												</p>
											</div>
										</div>

										{question.answerType === "Multiple Choice" ||
										question.answerType === "Multi-select" ? (
											<div className="space-y-2 ml-10">
												{question.options.map((option, opIdx) => {
													const count = question.breakdown[option] || 0;
													const pct =
														question.totalAnswered > 0
															? Math.round(
																	(count / question.totalAnswered) * 100
																)
															: 0;
													return (
														<div key={opIdx}>
															<div className="text-sm text-gray-700 mb-1">
																{option}
															</div>
															<PercentBar percentage={pct} total={count} />
														</div>
													);
												})}
											</div>
										) : (
											<div className="ml-10">
												<PercentBar
													percentage={100}
													total={question.totalAnswered}
												/>
											</div>
										)}
									</div>
								))}
							</div>

							{/* Right Panel - Per-Course Breakdown */}
							<div className="w-7/12 overflow-y-auto p-6">
								<h2 className="text-lg font-semibold text-gray-800 mb-4">
									Responses by Course
								</h2>
								{filteredStats.length === 0 ? (
									<p className="text-gray-500 text-sm">
										No data for selected filter.
									</p>
								) : (
									<div className="space-y-4">
										{filteredStats.map((group) => (
											<div
												key={`${group.surveyId}-${group.courseId}`}
												className="bg-gray-50 rounded-lg p-4"
											>
												<div className="flex items-center justify-between mb-3">
													<div>
														<h3 className="font-medium text-gray-800">
															{group.courseName}
														</h3>
														<p className="text-xs text-gray-400">
															v{group.surveyVersion} &middot;{" "}
															{group.totalResponses} response
															{group.totalResponses !== 1 ? "s" : ""}
														</p>
													</div>
												</div>
												<div className="overflow-x-auto">
													<table className="w-full text-sm border-collapse">
														<thead>
															<tr className="bg-gray-100">
																<th className="text-left p-2 border border-gray-200 font-medium text-gray-600">
																	#
																</th>
																<th className="text-left p-2 border border-gray-200 font-medium text-gray-600">
																	Question
																</th>
																<th className="text-center p-2 border border-gray-200 font-medium text-gray-600">
																	Responses
																</th>
																<th className="text-left p-2 border border-gray-200 font-medium text-gray-600">
																	Top Answer
																</th>
															</tr>
														</thead>
														<tbody>
															{group.questions.map((q, idx) => {
																const topAnswer =
																	Object.entries(q.breakdown).sort(
																		([, a], [, b]) => b - a
																	)[0] || [];
																return (
																	<tr
																		key={q.questionId}
																		className={
																			idx % 2 === 0
																				? "bg-white"
																				: "bg-gray-50"
																		}
																	>
																		<td className="p-2 border border-gray-200 text-gray-500">
																			{idx + 1}
																		</td>
																		<td className="p-2 border border-gray-200 text-gray-700">
																			{q.questionText}
																		</td>
																		<td className="p-2 border border-gray-200 text-center">
																			{q.totalAnswered}
																		</td>
																		<td className="p-2 border border-gray-200 text-gray-600">
																			{topAnswer[0] || "—"}
																			{topAnswer[1]
																				? ` (${topAnswer[1]})`
																				: ""}
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
