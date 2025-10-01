import React, { useState, useEffect } from "react";
import apiClient from "../../../services/apiClient";
import { QuestionType } from "../../../shared/types/question";
import { X } from "lucide-react";
import PercentBar from "./PercentBar";

interface DetailedSurveyResponseProps {
	surveyQuestionIDs: string[];
	toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SurveyQuestion {
	question: string;
	isMCQ: boolean;
	numResponses: number;
	responseOptions: string[];
	responses: string[];
	responseBreakdown: number[];
}

interface SurveyResponse {
	userName: string;
	userEmail: string;
	date: Date;
	answers: string[];
}

export default function DetailedSurveyResponse({
	surveyQuestionIDs,
	toggleModal,
}: DetailedSurveyResponseProps) {
	const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
	const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

	const fetchSurveyQuestions = async () => {
		try {
			console.log("Fetching survey questions for IDs:", surveyQuestionIDs);
			const receivedSurveyQuestions: SurveyQuestion[] = [];
			const receivedResponses: SurveyResponse[] = [];

			// Fetch all questions and their responses
			for (const surveyQuestionID of surveyQuestionIDs) {
				console.log("Fetching question:", surveyQuestionID);

				// Handle case where surveyQuestionID might be an object or a string
				const questionId =
					typeof surveyQuestionID === "string"
						? surveyQuestionID
						: (surveyQuestionID as any)._id;
				console.log("Using question ID:", questionId);

				// Use query parameter to get specific question since there's no GET /:id route
				const response = await apiClient.get(`/questions?_id=${questionId}`);
				const questionsArray = response.data;

				if (!questionsArray || questionsArray.length === 0) {
					console.warn(`Question with ID ${questionId} not found`);
					continue; // Skip this question if not found
				}

				const rawQuestionData: QuestionType = questionsArray[0]; // Get first (and should be only) result
				console.log("Question data:", rawQuestionData);

				const questionData: SurveyQuestion = {
					question: rawQuestionData.question,
					isMCQ: rawQuestionData.isMCQ,
					responseOptions: rawQuestionData.isMCQ
						? rawQuestionData.answers || []
						: [],
					numResponses: 0,
					responses: [],
					responseBreakdown: [],
				};

				console.log("Fetching question responses for questionId:", questionId);
				const questionIdResponse = await apiClient.get(
					`/questionResponses?questionId=${questionId}`
				);
				const responses = questionIdResponse.data;
				console.log("Question responses:", responses);

				// Update question data
				questionData.numResponses = responses.length;
				questionData.responses = responses.map(
					(response: any) => response.answer
				);

				// Calculate response breakdown for MCQ questions
				if (questionData.isMCQ) {
					questionData.responseBreakdown = questionData.responseOptions.map(
						(option) =>
							questionData.responses.filter((response) => response === option)
								.length
					);
				}

				receivedSurveyQuestions.push(questionData);

				// Process responses
				responses.forEach((response: any) => {
					const existingResponse = receivedResponses.find(
						(r) => r.userEmail === response.userEmail
					);
					if (existingResponse) {
						existingResponse.answers.push(response.answer);
					} else {
						receivedResponses.push({
							userName: response.userName || "Anonymous",
							userEmail: response.userEmail,
							date: new Date(response.createdAt),
							answers: [response.answer],
						});
					}
				});
			}

			setSurveyQuestions(receivedSurveyQuestions);
			setSurveyResponses(receivedResponses);
		} catch (error) {
			console.error("Error fetching survey data:", error);
		}
	};

	const handleDownloadCSV = () => {
		if (!surveyQuestions.length || !surveyResponses.length) {
			console.warn("No survey data available to download");
			return;
		}

		// Create headers
		const headers = [
			"Submitted",
			"Name",
			"Registered User Email",
			...surveyQuestions.map((q, idx) => `${idx + 1}. ${q.question}`),
		];

		// Create rows
		const rows = surveyResponses.map((response) => [
			response.date.toDateString(),
			response.userName,
			response.userEmail,
			...response.answers,
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
		link.setAttribute("download", "survey_responses.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	useEffect(() => {
		fetchSurveyQuestions();
	}, []);

	return (
		<div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
			<div className="bg-white flex flex-col w-11/12 h-5/6 shadow-md border rounded-md p-3">
				<div className="flex w-full justify-between my-2">
					<h1 className="text-2xl font-bold">Survey Responses</h1>
					<X
						className="border rounded-md border-gray-400 mx-2 cursor-pointer"
						onClick={() => toggleModal(false)}
					></X>
				</div>

				<div className="flex justify-between">
					<div className="w-4/12 ml-2">
						<div className="flex justify-end">
							<button
								className="text-white text-sm px-6 py-2.5 rounded-lg font-medium hover:opacity-90 w-2/5"
								style={{ backgroundColor: "#8757a3" }}
								// onClick={} //TODO: implement download as PDF
							>
								Download as PDF
							</button>
						</div>
						<h2 className="text-xl font-bold">Questions</h2>
						<div className="flex flex-col">
							{surveyQuestions.map((question, index) => (
								<div key={index} className="flex space-x-2 my-2">
									<div>{index + 1}</div>
									<div className="flex flex-col w-full">
										<div className="font-bold">{question.question}</div>
										<div className="text-xs text-gray-400">
											{question.isMCQ ? "Multiple Choice" : "Free Response"}
										</div>
										{question.isMCQ ? (
											<div className="flex flex-col mt-2">
												{question.responseOptions.map((option, opIdx) => (
													<div className="text-sm" key={opIdx}>
														<div>{option}</div>
														<PercentBar
															percentage={question.responseBreakdown[opIdx]}
															total={question.numResponses}
														></PercentBar>
													</div>
												))}
											</div>
										) : (
											<div className="mt-2">
												<div className="text-sm">Responses</div>
												<PercentBar
													percentage={100}
													total={question.numResponses}
												></PercentBar>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col w-7/12 mr-2 overflow-x-auto overflow-y-auto">
						<div className="flex justify-end space-x-3">
							<button
								className="text-white text-sm px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
								style={{ backgroundColor: "#8757a3" }}
								onClick={handleDownloadCSV}
							>
								Download as CSV
							</button>
							<button
								className="text-white text-sm px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
								style={{ backgroundColor: "#8757a3" }}
								// onClick={} //TODO: implement download as PDF
							>
								Download as PDF
							</button>
						</div>
						<h2 className="text-xl font-bold">Individual Responses</h2>
						<table className="border border-gray-300 rounded-lg overflow-hidden mt-3">
							<thead>
								<tr className="text-left text-sm align-bottom bg-gray-200">
									<th className="border border-gray-300 p-2 pb-1">Submitted</th>
									<th className="border border-gray-300 p-2 pb-1">Name</th>
									<th className="border border-gray-300 p-2 pb-1">
										Registered User Email
									</th>
									{surveyQuestions.map((question, idx) => (
										<th key={idx} className="border border-gray-300 p-2 pb-1">
											{idx + 1}. {question.question}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="text-sm">
								{surveyResponses.map((response, rowIdx) => (
									<tr
										key={rowIdx}
										className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-200"}
									>
										<td className="border border-gray-300 p-2 pb-1">
											{response.date.toDateString()}
										</td>
										<td className="border border-gray-300 p-2 pb-1">
											{response.userName}
										</td>
										<td className="border border-gray-300 p-2 pb-1">
											{response.userEmail}
										</td>
										{response.answers.map((answer) => (
											<td className="border border-gray-300 p-2 pb-1">
												{answer}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
