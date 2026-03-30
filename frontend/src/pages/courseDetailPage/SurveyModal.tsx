import apiClient from "../../services/apiClient";
import React, { useEffect, useState } from "react";
import SurveyQuestion from "./SurveyQuestion";

interface SurveyModalProps {
	isOpen: boolean;
	onClose: any;
	courseId: string | null;
	surveyId: string | null;
	setSurveyCompleted: any;
}

export default function SurveyModal({
	isOpen,
	onClose,
	courseId,
	surveyId,
	setSurveyCompleted,
}: SurveyModalProps) {
	const [questionNumber, setQuestionNumber] = useState<number>(0);
	const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);
	const [responses, setResponses] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		if (!surveyId) return;

		const populateQuestions = async () => {
			try {
				const response = await apiClient.get(`surveys/${surveyId}`);
				const survey = response.data.survey || response.data;
				setSurveyQuestions(survey.questions || []);
			} catch (error) {
				console.error("Error fetching survey:", error);
			}
		};

		populateQuestions();
	}, [surveyId]);

	if (!isOpen) return null;

	const handleAnswerChange = (questionId: string, answer: string) => {
		setResponses((prev) => ({
			...prev,
			[questionId]: answer,
		}));
	};

	async function handleNextQuestion() {
		if (questionNumber < surveyQuestions.length - 1) {
			setQuestionNumber(questionNumber + 1);
		} else {
			try {
				const userId = JSON.parse(localStorage.user)._id;

				// Create question responses
				let responseIds = [];
				for (let id of Object.keys(responses)) {
					const response = await apiClient.post("questionResponses", {
						userId,
						questionId: id,
						answer: responses[`${id}`].toString(),
					});
					responseIds.push(response.data._id);
				}

				// Create survey response with surveyId and courseId
				await apiClient.post("surveyResponses", {
					userId,
					answers: responseIds,
					surveyId,
					courseId,
				});

				// Update progress
				await apiClient.put(
					`/courses/${courseId}/progress/single/${userId}`,
					{
						surveyComplete: true,
						webinarComplete: true,
					}
				);
				setSurveyCompleted(true);
			} catch (error) {
				console.error(error);
			}

			onClose();
		}
	}

	function handlePreviousQuestion() {
		if (questionNumber > 0) {
			setQuestionNumber(questionNumber - 1);
		}
	}

	const currentQuestionId = surveyQuestions[questionNumber]?._id ?? null;
	const isCurrentAnswered = !!(
		currentQuestionId && (responses[currentQuestionId] ?? "").trim() !== ""
	);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 p-8 relative flex flex-col">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
					aria-label="Close"
				>
					&times;
				</button>
				<h2 className="text-2xl font-bold mb-6 text-center">Survey</h2>
				<div className="flex-1 overflow-auto">
					{surveyQuestions.length > 0 ? (
						<SurveyQuestion
							question={surveyQuestions[questionNumber]}
							selectedAnswer={
								responses[surveyQuestions[questionNumber]._id] || ""
							}
							onAnswerChange={handleAnswerChange}
						/>
					) : (
						<p className="text-gray-600 text-center">Loading questions...</p>
					)}
				</div>

				<button
					onClick={handlePreviousQuestion}
					className="mt-6 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all disabled:bg-orange-200"
					disabled={questionNumber === 0}
				>
					Previous
				</button>

				<button
					onClick={handleNextQuestion}
					className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg transition-all ${
						isCurrentAnswered
							? "bg-orange-400 hover:bg-orange-500"
							: "bg-orange-200 cursor-not-allowed"
					}`}
				>
					{questionNumber < surveyQuestions.length - 1 ? "Next" : "Finish"}
				</button>
			</div>
		</div>
	);
}
