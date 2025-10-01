import { Expand, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import SearchDropdown from "../ComponentPage/DropDownSearch";
import apiClient from "../../../services/apiClient";
import { Course } from "../../../shared/types/course";
import { Pagination } from "../ProductPage/ProductPage";
import DetailedSurveyResponse from "./DetailedSurveyResponse";

interface SurveyElem {
	courseTitle: string;
	numResponses: number;
	questionIds: string[];
}

export default function SurveySummary() {
	const [searchOptions, setSearchOptions] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [modalOpen, setModalOpen] = useState(false);

	const [surveys, setSurveys] = useState<SurveyElem[]>([]);
	const displayedSurveys = surveys.filter(
		(survey) =>
			searchQuery.length === 0 ||
			searchQuery.includes(survey.courseTitle.toLowerCase())
	);
	const [modalSurveyIds, setModalSurveyIds] = useState<string[]>([]);

	const fetchSearchOptions = async () => {
		try {
			const response = await apiClient.get("/courses");

			const courseTitles: string[] = response.data.data.map((course: Course) =>
				course.className.toLowerCase()
			);

			setSearchOptions(courseTitles);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchSurveys = async () => {
		try {
			console.log("Fetching surveys...");
			const response = await apiClient.get("/surveys");
			const survey = response.data;
			console.log("Survey data:", survey);

			const receivedSurveys: SurveyElem[] = [];

			// Get all survey responses since they're not tied to a specific survey
			console.log("Fetching all survey responses...");
			const surveyResponsesResponse = await apiClient.get("/surveyResponses");
			console.log("Survey responses data:", surveyResponsesResponse.data);

			const surveyResponses =
				surveyResponsesResponse.data.data || surveyResponsesResponse.data;

			const surveyData: SurveyElem = {
				courseTitle: "General Survey", // Default title since no course relationship exists
				numResponses: Array.isArray(surveyResponses)
					? surveyResponses.length
					: 0,
				questionIds: Array.isArray(survey.questions) 
					? survey.questions.map((q: any) => q._id || q) 
					: [],
			};
			receivedSurveys.push(surveyData);

			console.log("Final survey data:", receivedSurveys);
			setSurveys(receivedSurveys);
		} catch (error) {
			console.error("Error fetching surveys:", error);
		}
	};

	const tableHeaders = ["Product Title", "Response #", "Responses"];
	const totalPages: number = Math.ceil(displayedSurveys.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleModalOpen = (surveyIdx: number) => {
		const selectedSurvey = displayedSurveys[surveyIdx];
		console.log("Opening modal for survey:", selectedSurvey);
		console.log("Question IDs:", selectedSurvey.questionIds);
		setModalSurveyIds(selectedSurvey.questionIds);
		setModalOpen(true);
	};

	useEffect(() => {
		fetchSearchOptions();
		fetchSurveys();
	}, []);

	return (
		<div className="w-full min-h-screen bg-gray-100">
			{modalOpen && (
				<DetailedSurveyResponse
					surveyQuestionIDs={modalSurveyIds}
					toggleModal={setModalOpen}
				></DetailedSurveyResponse>
			)}

			<div className="max-w-screen-2xl mx-auto px-8 py-6 space-y-4">
				<div className="bg-white border rounded-lg p-6">
					<div className="flex justify-between">
						<div className="mb-6">
							<h1 className="text-2xl font-bold">Survey Results</h1>
						</div>
						<Expand className="w-6 border rounded-lg p-1 cursor-pointer"></Expand>
					</div>

					<SearchDropdown
						options={searchOptions}
						selected={searchQuery}
						setSelected={setSearchQuery}
						placeholder="Search"
					></SearchDropdown>

					<table className="w-full border border-gray-300 rounded-md border-separate border-spacing-0 text-sm mt-5">
						<thead className="bg-gray-100 rounded-md">
							<tr>
								{tableHeaders.map((header, idx) => (
									<th
										key={idx}
										className="border border-gray-200 first:rounded-tl-md last:rounded-tr-md text-left pl-3"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{displayedSurveys.map((survey, rowIdx) => (
								<tr
									key={rowIdx}
									className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
								>
									<td className="border border-gray-200 text-left w-9/12 pl-3">
										{survey.courseTitle}
									</td>
									<td className="border border-gray-200 w-2/12 text-center">
										{survey.numResponses}
									</td>
									<td className="border border-gray-200 w-1/12 text-center">
										<Search
											className="w-6 border rounded-lg p-1 cursor-pointer"
											onClick={() => handleModalOpen(rowIdx)}
										></Search>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="flex justify-end mt-6">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages || 1}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
