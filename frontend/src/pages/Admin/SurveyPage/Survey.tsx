import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Trash2, X, Eye, Copy, Link } from "lucide-react";
import apiClient from "../../../services/apiClient";
import {
	getCleanCourseData,
	useCourseEditStore,
} from "../../../store/useCourseEditStore";

interface SurveyQuestion {
	_id: string;
	question: string;
	explanation: string;
	answerType: string;
	answers: string[];
	isRequired: boolean;
	isEdited: boolean;
}

interface ExistingSurvey {
	_id: string;
	name: string;
	questions: any[];
	courseIds: string[];
	version: number;
}

const Survey = () => {
	const course = getCleanCourseData();
	const setAllFields = useCourseEditStore((state) => state.setAllFields);
	const navigate = useNavigate();

	const [surveyName, setSurveyName] = useState("");
	const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [surveyId, setSurveyId] = useState<string | null>(null);
	const [linkedCourseIds, setLinkedCourseIds] = useState<string[]>([]);

	// Versioning modal state
	const [showVersionModal, setShowVersionModal] = useState(false);
	const [courseOptions, setCourseOptions] = useState<
		{ id: string; name: string; checked: boolean }[]
	>([]);
	const [pendingQuestionIds, setPendingQuestionIds] = useState<string[]>([]);

	// Reuse survey state
	const [showReuseModal, setShowReuseModal] = useState(false);
	const [existingSurveys, setExistingSurveys] = useState<ExistingSurvey[]>([]);
	const [previewSurvey, setPreviewSurvey] = useState<ExistingSurvey | null>(
		null
	);

	// Load the survey for this course
	useEffect(() => {
		const fetchSurvey = async () => {
			const sid = course.surveyId;
			if (!sid) return;

			try {
				const response = await apiClient.get(`/surveys/${sid}`);
				const surveyData = response.data.survey || response.data;

				if (surveyData) {
					setSurveyId(surveyData._id);
					setSurveyName(surveyData.name || "");
					setLinkedCourseIds(surveyData.courseIds || []);
					setQuestions(
						(surveyData.questions || []).map((q: any) => ({
							...q,
							isEdited: false,
						}))
					);
				}
			} catch (error) {
				console.error("Error fetching survey:", error);
				setErrorMessage("Error loading survey data.");
			}
		};

		fetchSurvey();
	}, [course.surveyId]);

	// Question editing handlers
	const handleQuestionChange = (index: number, value: string) => {
		const updated = [...questions];
		updated[index].question = value;
		updated[index].isEdited = true;
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				_id: "",
				question: "",
				explanation: "",
				answerType: "Text Input",
				answers: [""],
				isRequired: true,
				isEdited: true,
			},
		]);
		setHasUnsavedChanges(true);
	};

	const deleteQuestion = (index: number) => {
		setQuestions(questions.filter((_, i) => i !== index));
		setHasUnsavedChanges(true);
	};

	const handleExplanationChange = (index: number, value: string) => {
		const updated = [...questions];
		updated[index].explanation = value;
		updated[index].isEdited = true;
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	const handleRequiredChange = (index: number, value: boolean) => {
		const updated = [...questions];
		updated[index].isRequired = value;
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	const handleAnswerTypeChange = (index: number, value: string) => {
		const updated = [...questions];
		updated[index].answerType = value;
		if (value !== "Text Input") {
			updated[index].answers = [""];
		}
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	const handleOptionChange = (
		qIndex: number,
		oIndex: number,
		value: string
	) => {
		const updated = [...questions];
		updated[qIndex].answers[oIndex] = value;
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	const addOption = (qIndex: number) => {
		const updated = [...questions];
		updated[qIndex].answers.push("");
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	const deleteOption = (qIndex: number, oIndex: number) => {
		const updated = [...questions];
		updated[qIndex].answers.splice(oIndex, 1);
		setQuestions(updated);
		setHasUnsavedChanges(true);
	};

	// Unsaved changes warning
	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				event.preventDefault();
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);

	const handleLeave = () => {
		navigate(`/admin/product/edit/${course._id}/components`);
	};

	// Create question documents for edited questions, return array of IDs
	const createQuestionDocs = async (): Promise<string[]> => {
		return Promise.all(
			questions.map(async (q) => {
				if (q.isEdited || !q._id) {
					const response = await apiClient.post("/questions", {
						question: q.question,
						explanation: q.explanation,
						answerType: q.answerType,
						answers: q.answers || [],
						isRequired: q.isRequired,
					});
					return response.data._id;
				}
				return q._id;
			})
		);
	};

	const handleSaveSurvey = async () => {
		setLoading(true);
		setErrorMessage(null);

		try {
			if (questions.length === 0) {
				setErrorMessage("At least one question is required.");
				setLoading(false);
				return;
			}

			if (!surveyName.trim()) {
				setErrorMessage("Survey name is required.");
				setLoading(false);
				return;
			}

			const questionIds = await createQuestionDocs();

			if (surveyId) {
				// Check if survey is shared and has responses — backend versioning handles this,
				// but we need to ask the user which courses to update
				if (linkedCourseIds.length > 1) {
					// Fetch course names for the modal
					const coursesResponse = await apiClient.get("/courses");
					const allCourses = coursesResponse.data.data || [];
					const options = linkedCourseIds.map((cid) => {
						const found = allCourses.find((c: any) => c._id === cid);
						return {
							id: cid,
							name: found?.className || "Unknown",
							checked: true,
						};
					});
					setCourseOptions(options);
					setPendingQuestionIds(questionIds);
					setShowVersionModal(true);
				} else {
					// Single course or no courses — just update
					const response = await apiClient.put(`/surveys/${surveyId}`, {
						name: surveyName,
						questions: questionIds,
					});
					const data = response.data.data;
					setSurveyId(data._id);
					setLinkedCourseIds(data.courseIds || []);
					setAllFields({ surveyId: data._id });
					alert("Survey saved successfully!");
					setHasUnsavedChanges(false);
				}
			} else {
				// Create new survey
				const courseIds = course._id ? [course._id] : [];
				const response = await apiClient.post("/surveys", {
					name: surveyName,
					questions: questionIds,
					courseIds,
				});
				const data = response.data.data;
				setSurveyId(data._id);
				setLinkedCourseIds(data.courseIds || []);
				setAllFields({ surveyId: data._id });
				alert("Survey created successfully!");
				setHasUnsavedChanges(false);
			}
		} catch (err) {
			console.error("Error saving survey:", err);
			setErrorMessage("Error saving survey. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Confirm versioning — which courses get the new version
	const handleConfirmVersion = async () => {
		try {
			setLoading(true);
			const courseIdsToUpdate = courseOptions
				.filter((c) => c.checked)
				.map((c) => c.id);

			const response = await apiClient.put(`/surveys/${surveyId}`, {
				name: surveyName,
				questions: pendingQuestionIds,
				courseIdsToUpdate,
			});
			const data = response.data.data;
			setSurveyId(data._id);
			setLinkedCourseIds(data.courseIds || []);
			setAllFields({ surveyId: data._id });
			setShowVersionModal(false);
			alert("Survey saved successfully!");
			setHasUnsavedChanges(false);
		} catch (err) {
			console.error("Error saving versioned survey:", err);
			setErrorMessage("Error saving survey. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Reuse survey flow
	const handleOpenReuse = async () => {
		try {
			const response = await apiClient.get("/surveys");
			const all = response.data.data || [];
			setExistingSurveys(all);
			setShowReuseModal(true);
		} catch (error) {
			console.error("Error fetching surveys:", error);
		}
	};

	const handleShareSurvey = async (survey: ExistingSurvey) => {
		try {
			if (!course._id) return;
			await apiClient.post(`/surveys/${survey._id}/assign`, {
				courseId: course._id,
			});
			setAllFields({ surveyId: survey._id });
			setSurveyId(survey._id);
			setSurveyName(survey.name);
			setLinkedCourseIds([...survey.courseIds, course._id]);
			setQuestions(
				survey.questions.map((q: any) => ({ ...q, isEdited: false }))
			);
			setShowReuseModal(false);
			setHasUnsavedChanges(false);
		} catch (error) {
			console.error("Error sharing survey:", error);
		}
	};

	const handleDuplicateSurvey = async (survey: ExistingSurvey) => {
		try {
			const response = await apiClient.post(
				`/surveys/${survey._id}/duplicate`,
				{
					courseId: course._id || undefined,
				}
			);
			const data = response.data.data;
			setAllFields({ surveyId: data._id });
			setSurveyId(data._id);
			setSurveyName(data.name);
			setLinkedCourseIds(data.courseIds || []);
			setQuestions(
				(data.questions || []).map((q: any) => ({ ...q, isEdited: false }))
			);
			setShowReuseModal(false);
			setHasUnsavedChanges(false);

			// Re-fetch to populate questions
			const fetched = await apiClient.get(`/surveys/${data._id}`);
			const full = fetched.data.survey || fetched.data;
			setQuestions(
				(full.questions || []).map((q: any) => ({ ...q, isEdited: false }))
			);
		} catch (error) {
			console.error("Error duplicating survey:", error);
		}
	};

	return (
		<div className="bg-white p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-2">
					<List className="w-6 h-6" />
					<h1 className="text-2xl font-semibold text-gray-800">
						{surveyId ? "Edit Survey" : "Create Survey"}
					</h1>
				</div>
				{!surveyId && (
					<button
						onClick={handleOpenReuse}
						className="text-[#8757A3] border border-[#8757A3] py-2 px-4 rounded-md hover:bg-[#8757A3] hover:text-white transition text-sm"
					>
						Use Existing Survey
					</button>
				)}
			</div>

			{/* Survey Name */}
			<div className="mb-6">
				<label htmlFor="survey-name" className="block font-semibold mb-2">
					Survey Name
				</label>
				<input
					type="text"
					id="survey-name"
					value={surveyName}
					onChange={(e) => {
						setSurveyName(e.target.value);
						setHasUnsavedChanges(true);
					}}
					placeholder="Enter survey name"
					className="w-1/2 p-3 border rounded-md"
				/>
			</div>

			{/* Linked courses info */}
			{linkedCourseIds.length > 1 && (
				<div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
					This survey is shared across {linkedCourseIds.length} courses.
					Editing will prompt you to choose which courses receive the update.
				</div>
			)}

			{/* Questions */}
			<div>
				{questions.map((question, index) => (
					<div key={index} className="space-y-4 mt-8 pb-6 border-b border-gray-100">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8757a3] text-white text-sm flex items-center justify-center font-medium">
									{index + 1}
								</span>
								<label
									htmlFor={`question-${index}`}
									className="block font-semibold"
								>
									Question {index + 1}
								</label>
								<button
									onClick={() => deleteQuestion(index)}
									className="text-red-500 hover:text-red-700 transition"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
						<div>
							<input
								type="text"
								id={`question-${index}`}
								value={question.question}
								onChange={(e) => handleQuestionChange(index, e.target.value)}
								placeholder="Enter question"
								className="w-3/4 p-3 border rounded-md"
							/>
						</div>

						<div>
							<label
								htmlFor={`explanation-${index}`}
								className="block font-semibold text-sm"
							>
								Explanation Text
							</label>
							<textarea
								id={`explanation-${index}`}
								value={question.explanation}
								onChange={(e) =>
									handleExplanationChange(index, e.target.value)
								}
								placeholder="Enter optional explanation that will appear above the question."
								className="w-3/4 mt-2 p-3 border rounded-md"
								rows={2}
							/>
						</div>

						<div>
							<label
								htmlFor={`answer-type-${index}`}
								className="block font-semibold text-sm"
							>
								Answer Type
							</label>
							<select
								id={`answer-type-${index}`}
								value={question.answerType}
								onChange={(e) =>
									handleAnswerTypeChange(index, e.target.value)
								}
								className="w-3/4 mt-2 p-3 border rounded-md"
							>
								<option value="Text Input">Text Input</option>
								<option value="Multiple Choice">Multiple Choice</option>
								<option value="Multi-select">Multi-select</option>
							</select>
						</div>

						{(question.answerType === "Multiple Choice" ||
							question.answerType === "Multi-select") && (
							<div className="mt-4 space-y-3 pl-10">
								{question.answers.map((answer, oIndex) => (
									<div key={oIndex} className="flex items-center space-x-3">
										<input
											type="text"
											value={answer}
											onChange={(e) =>
												handleOptionChange(index, oIndex, e.target.value)
											}
											placeholder={`Option ${oIndex + 1}`}
											className="w-3/4 p-3 border rounded-md"
										/>
										<button
											onClick={() => deleteOption(index, oIndex)}
											className="text-red-500 hover:text-red-700"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								))}
								<button
									onClick={() => addOption(index)}
									className="text-[#8757A3] border border-[#8757A3] py-2 px-4 rounded-md hover:bg-[#8757A3] hover:text-white transition text-sm"
								>
									Add Option
								</button>
							</div>
						)}

						<div className="mt-2 flex items-center">
							<input
								type="checkbox"
								checked={question.isRequired}
								onChange={(e) =>
									handleRequiredChange(index, e.target.checked)
								}
								className="mr-2"
							/>
							<label className="text-sm">Required</label>
						</div>
					</div>
				))}

				<button
					onClick={addQuestion}
					className="mt-4 bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] transition"
				>
					Add Question
				</button>

				<div className="flex flex-col items-end mt-6 space-y-2">
					{errorMessage && (
						<div className="text-red-600 text-sm">{errorMessage}</div>
					)}

					<button
						onClick={handleSaveSurvey}
						className="w-[200px] bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] transition"
						disabled={loading}
					>
						{loading ? "Saving..." : "Save"}
					</button>

					<button
						onClick={() =>
							hasUnsavedChanges ? setIsModalOpen(true) : handleLeave()
						}
						className="w-[200px] text-[#8757A3] border border-[#8757A3] py-2 px-4 rounded-md hover:bg-[#8757A3] hover:text-white transition"
					>
						Exit
					</button>
				</div>
			</div>

			{/* Unsaved changes modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-xl font-semibold">Unsaved Changes</h2>
						<p className="mt-2 text-gray-600">
							You have edits that aren't saved yet. Are you sure you want to
							leave?
						</p>
						<div className="mt-4 flex space-x-4 justify-end">
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-gray-600 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100"
							>
								Stay
							</button>
							<button
								onClick={handleLeave}
								className="text-white bg-red-500 py-2 px-4 rounded-md hover:bg-red-600"
							>
								Leave
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Versioning modal — choose which courses get the update */}
			{showVersionModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white w-[480px] p-6 rounded-lg shadow-lg relative">
						<button
							onClick={() => setShowVersionModal(false)}
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-xl font-semibold mb-2">
							Update Shared Survey
						</h2>
						<p className="text-sm text-gray-600 mb-4">
							This survey is used by multiple courses. Select which courses
							should receive the updated version. Unselected courses will keep
							the current version.
						</p>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{courseOptions.map((opt) => (
								<label
									key={opt.id}
									className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
								>
									<input
										type="checkbox"
										checked={opt.checked}
										onChange={(e) => {
											setCourseOptions((prev) =>
												prev.map((o) =>
													o.id === opt.id
														? { ...o, checked: e.target.checked }
														: o
												)
											);
										}}
										className="w-4 h-4"
									/>
									<span className="text-gray-700">{opt.name}</span>
								</label>
							))}
						</div>
						<div className="mt-6 flex justify-end space-x-3">
							<button
								onClick={() => setShowVersionModal(false)}
								className="text-gray-600 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmVersion}
								disabled={loading}
								className="bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] transition"
							>
								{loading ? "Saving..." : "Save & Update"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Reuse existing survey modal */}
			{showReuseModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white w-[640px] max-h-[80vh] rounded-lg shadow-lg relative flex flex-col">
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-xl font-semibold">Use Existing Survey</h2>
							<button
								onClick={() => {
									setShowReuseModal(false);
									setPreviewSurvey(null);
								}}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto p-6">
							{previewSurvey ? (
								// Preview mode
								<div>
									<button
										onClick={() => setPreviewSurvey(null)}
										className="text-sm text-[#8757A3] hover:underline mb-4"
									>
										&larr; Back to list
									</button>
									<h3 className="text-lg font-semibold mb-1">
										{previewSurvey.name}
									</h3>
									<p className="text-sm text-gray-500 mb-4">
										{previewSurvey.questions.length} question
										{previewSurvey.questions.length !== 1 ? "s" : ""} &middot;
										v{previewSurvey.version}
									</p>
									<div className="space-y-3">
										{previewSurvey.questions.map((q: any, idx: number) => (
											<div
												key={q._id || idx}
												className="bg-gray-50 p-3 rounded-md"
											>
												<p className="font-medium text-sm">
													{idx + 1}. {q.question}
												</p>
												<p className="text-xs text-gray-400 mt-1">
													{q.answerType}
													{q.isRequired ? " (Required)" : ""}
												</p>
												{q.answers && q.answers.length > 0 && (
													<ul className="mt-2 space-y-1">
														{q.answers.map((a: string, ai: number) => (
															<li
																key={ai}
																className="text-xs text-gray-600 pl-4"
															>
																&bull; {a}
															</li>
														))}
													</ul>
												)}
											</div>
										))}
									</div>
									<div className="mt-6 flex gap-3">
										<button
											onClick={() => handleShareSurvey(previewSurvey)}
											className="flex items-center gap-2 bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] transition text-sm"
										>
											<Link className="w-4 h-4" />
											Share (Link)
										</button>
										<button
											onClick={() => handleDuplicateSurvey(previewSurvey)}
											className="flex items-center gap-2 text-[#8757A3] border border-[#8757A3] py-2 px-4 rounded-md hover:bg-[#8757A3] hover:text-white transition text-sm"
										>
											<Copy className="w-4 h-4" />
											Duplicate (Copy)
										</button>
									</div>
								</div>
							) : (
								// List mode
								<div className="space-y-3">
									{existingSurveys.length === 0 ? (
										<p className="text-gray-500 text-center py-8">
											No existing surveys found.
										</p>
									) : (
										existingSurveys.map((s) => (
											<div
												key={s._id}
												className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
											>
												<div>
													<p className="font-medium text-gray-800">
														{s.name}
													</p>
													<p className="text-xs text-gray-500">
														{s.questions.length} question
														{s.questions.length !== 1 ? "s" : ""} &middot;
														v{s.version} &middot; {s.courseIds.length} course
														{s.courseIds.length !== 1 ? "s" : ""}
													</p>
												</div>
												<div className="flex gap-2">
													<button
														onClick={() => setPreviewSurvey(s)}
														className="p-2 hover:bg-gray-100 rounded-md transition"
														title="Preview"
													>
														<Eye className="w-4 h-4 text-gray-500" />
													</button>
													<button
														onClick={() => handleShareSurvey(s)}
														className="p-2 hover:bg-gray-100 rounded-md transition"
														title="Share (link same survey)"
													>
														<Link className="w-4 h-4 text-[#8757A3]" />
													</button>
													<button
														onClick={() => handleDuplicateSurvey(s)}
														className="p-2 hover:bg-gray-100 rounded-md transition"
														title="Duplicate (independent copy)"
													>
														<Copy className="w-4 h-4 text-[#8757A3]" />
													</button>
												</div>
											</div>
										))
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Survey;
