import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Trash2, X } from "lucide-react";
import apiClient from "../../../services/apiClient";

const Survey = () => {
	const [questions, setQuestions] = useState([
		{
			_id: "",
			question: "",
			explanation: "",
			answerType: "Text Input",
			answers: [""],
			isRequired: false,
			isEdited: false,
		},
	]);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [surveyId, setSurveyId] = useState<string | null>(null);

	useEffect(() => {
		const fetchSurvey = async () => {
			try {
				const response = await apiClient.get(
					"http://localhost:5001/api/surveys"
				); // Fetch the existing survey
				const surveyData = response.data;
				console.log(response.data);

				if (surveyData) {
					setSurveyId(surveyData._id);
					setQuestions(surveyData.questions);
				}
			} catch (error) {
				console.error("Error fetching survey:", error);
				setErrorMessage("Error loading survey data.");
			}
		};

		fetchSurvey();
	}, []);

	const handleQuestionChange = (index: number, value: string) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index].question = value;
		updatedQuestions[index].isEdited = true;
		setQuestions(updatedQuestions);
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
		const updatedQuestions = questions.filter((_, i) => i !== index);
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	const handleExplanationChange = (index: number, value: string) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index].explanation = value;
		updatedQuestions[index].isEdited = true;
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	const handleRequiredChange = (index: number, value: boolean) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index].isRequired = value;
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	const handleAnswerTypeChange = (index: number, value: string) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index].answerType = value;
		// Reset options (for Multiple Choice and Multi-select)
		if (value !== "Text Input") {
			updatedQuestions[index].answers = [""];
		}
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	const handleOptionChange = (
		qIndex: number,
		oIndex: number,
		value: string
	) => {
		const updatedQuestions = [...questions];
		updatedQuestions[qIndex].answers[oIndex] = value;
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	const addOption = (qIndex: number) => {
		const updatedQuestions = [...questions];
		updatedQuestions[qIndex].answers.push("");
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	const deleteOption = (qIndex: number, oIndex: number) => {
		const updatedQuestions = [...questions];
		updatedQuestions[qIndex].answers.splice(oIndex, 1);
		setQuestions(updatedQuestions);
		setHasUnsavedChanges(true);
	};

	// Confirm before navigating away if there are unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				// Prevent the default action and show the confirmation dialog in modern browsers
				event.preventDefault();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	const handleStay = () => {
		setIsModalOpen(false);
	};

	const handleLeave = () => {
		// TODO: Implement exit logic here (e.g., redirecting the user or closing the form)
		setIsModalOpen(false);
		// Console log that the user is leaving
		// console.log("User left the page.");
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

			// First, create the questions
			const createdQuestions = await Promise.all(
				questions.map(async (q) => {
					if (q.isEdited) {
						// If question is edited, create a new question
						const response = await apiClient.post(
							"http://localhost:5001/api/questions",
							{
								question: q.question,
								explanation: q.explanation,
								answerType: q.answerType,
								answers: q.answers || [],
								isRequired: q.isRequired,
							}
						);
						return response.data._id; // Return new question's ID
					} else {
						// If question is not edited, return the existing question ID
						return q._id; // Assume _id exists if it's an existing question
					}
				})
			);

			// Create survey data to send to backend
			const surveyData = {
				questions: createdQuestions,
			};

			if (surveyId) {
				// If surveyId exists, update the existing survey
				const response = await apiClient.put(
					`http://localhost:5001/api/surveys/${surveyId}`,
					surveyData
				);
				alert("Survey saved successfully!");
				setHasUnsavedChanges(false);
				setSurveyId(response.data._id);
			} else {
				// Create a new survey if there is no surveyId
				//response = await apiClient.post("http://localhost:5001/api/surveys", surveyData);
				console.error("No surveyId");
			}
		} catch (err) {
			// Handle errors from the backend
			console.error("Error saving survey:", err);
			setErrorMessage("Error saving survey. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6">
			<div className="flex items-center space-x-2">
				<List className="w-6 h-6" />
				<h1 className="text-2xl font-semibold text-gray-800">Survey</h1>
			</div>

			{/* Questions */}
			<div>
				{questions.map((question, index) => (
					<div key={index} className="space-y-4 mt-12">
						{/* Question */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<label
									htmlFor={`question-${index}`}
									className="block font-semibold"
								>
									Question {index + 1}
								</label>
								<button
									onClick={() => deleteQuestion(index)}
									className="text-red-600 flex items-center space-x-2"
								>
									<Trash2 className="w-5 h-5" />
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

						{/* Explanation Text */}
						<div>
							<label
								htmlFor={`explanation-${index}`}
								className="block font-semibold"
							>
								Explanation Text
							</label>
							<textarea
								id={`explanation-${index}`}
								value={question.explanation}
								onChange={(e) => handleExplanationChange(index, e.target.value)}
								placeholder="Enter optional explanation that will appear above the question."
								className="w-3/4 mt-2 p-3 border rounded-md"
							/>
						</div>

						{/* Answer Type */}
						<div>
							<label
								htmlFor={`answer-type-${index}`}
								className="block font-semibold"
							>
								Answer Type
							</label>
							<select
								id={`answer-type-${index}`}
								value={question.answerType}
								onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
								className="w-3/4 mt-2 p-3 border rounded-md"
							>
								<option value="Text Input">Text Input</option>
								<option value="Multiple Choice">Multiple Choice</option>
								<option value="Multi-select">Multi-select</option>
							</select>
						</div>

						{/* Options (for Multiple Choice) */}
						{(question.answerType === "Multiple Choice" ||
							question.answerType === "Multi-select") && (
							<div className="mt-4 space-y-3 pl-16">
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
											className="text-red-600"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
								))}
								<button
									onClick={() => addOption(index)}
									className="mt-2 text-[#8757A3] border border-[#8757A3] py-2 px-4 rounded-md hover:bg-[#8757A3] hover:text-white focus:ring-2 focus:ring-[#8757A3]"
								>
									Add Option
								</button>
							</div>
						)}

						{/* Required Checkbox */}
						<div className="mt-2 flex items-center">
							<input
								type="checkbox"
								checked={question.isRequired}
								onChange={(e) => handleRequiredChange(index, e.target.checked)}
								className="mr-2"
							/>
							<label className="text-sm">Required</label>
						</div>
					</div>
				))}

				{/* Add Question Button */}
				<button
					onClick={addQuestion}
					className="mt-4 bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] focus:ring-2 focus:ring-[#8757A3]"
				>
					Add Question
				</button>

				<div className="flex flex-col items-end mt-4 space-y-2">
					{/* Error Message Display */}
					{errorMessage && (
						<div className="text-red-600 mt-4">{errorMessage}</div>
					)}

					{/* Save Button */}
					<button
						onClick={handleSaveSurvey}
						className="w-[200px] bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] focus:ring-2 focus:ring-[#8757A3]"
						disabled={loading}
					>
						{loading ? "Saving..." : "Save"}
					</button>

					{/* Exit Button */}
					<button
						onClick={() => setIsModalOpen(true)}
						className="w-[200px] text-[#8757A3] border border-[#8757A3] py-2 px-4 rounded-md hover:bg-[#8757A3] hover:text-white focus:ring-2 focus:ring-[#8757A3]"
					>
						Exit
					</button>
				</div>
			</div>

			{/* Modal */}
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
						<p className="mt-2">
							It looks like you have edits that aren’t saved yet. Are you sure
							you want to leave?
						</p>
						<div className="mt-4 flex space-x-4 justify-end">
							<button
								onClick={handleStay}
								className="text-[#6C6C6C] border border-[#6C6C6C] py-2 px-4 rounded-md hover:bg-gray-100"
							>
								Stay
							</button>
							<button
								onClick={handleLeave}
								className="text-white bg-[#CB2F2F] py-2 px-4 rounded-md hover:bg-[#9e2a2a]"
							>
								Leave
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Survey;
