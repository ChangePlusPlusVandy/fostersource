import { Expand, Search } from "lucide-react";
import React, { useState, useEffect} from "react"; 
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
  const displayedSurveys = surveys.filter(survey => (searchQuery.length === 0 || searchQuery.includes(survey.courseTitle.toLowerCase()))); 
  const [modalSurveyIds, setModalSurveyIds] = useState<string[]>([]); 

  const fetchSearchOptions = async () => {
    try {
      const response = await apiClient.get("/courses"); 

      const courseTitles: string[] = response.data.data.map((course: Course) => course.className.toLowerCase());
      
      setSearchOptions(courseTitles);
    } catch (error) {
      console.error(error); 
    }
  }

  const fetchSurveys = async () => {
    try {
      const response = await apiClient.get("/surveys"); 
      const survey = response.data; 

      const receivedSurveys: SurveyElem[] = []; 
      
      const courseResponse = await apiClient.get(`/courses/${survey.courseId}`); 
      const courseTitle = courseResponse.data.className; 

      const surveyId = survey.surveyId; 
      const surveyResponses = await apiClient.get(`/surveyResponses/${surveyId}`); 
      
      const surveyData: SurveyElem = {
        courseTitle: courseTitle,
        numResponses: surveyResponses.data.length, 
        questionIds: survey.questionIds,
      }
      receivedSurveys.push(surveyData); 
      
      setSurveys(receivedSurveys); 
    } catch (error) {
      console.error(error); 
    }
  }

  const tableHeaders = ["Product Title", "Response #", "Responses"]; 
  const totalPages: number = Math.ceil(displayedSurveys.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleModalOpen = (surveyIdx: number) => {
    const selectedSurvey = displayedSurveys[surveyIdx]; 
    setModalSurveyIds(selectedSurvey.questionIds); 
    setModalOpen(true); 
  }

  useEffect(() => {
    fetchSearchOptions(); 
    fetchSurveys(); 
  }, []); 

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {modalOpen && (
        <DetailedSurveyResponse surveyQuestionIDs={modalSurveyIds} toggleModal={setModalOpen}></DetailedSurveyResponse>
      )}
      
      <div className="max-w-screen-2xl mx-auto px-8 py-6 space-y-4">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Registration Report</h1>
            </div>
            <Expand className="w-6 border rounded-lg p-1 cursor-pointer"></Expand>
          </div>

          <SearchDropdown options={searchOptions} selected={searchQuery} setSelected={setSearchQuery} ></SearchDropdown>
          
          <table className="w-full border border-gray-300 rounded-md border-separate border-spacing-0 text-sm mt-5">
            <thead className="bg-gray-100 rounded-md">
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className="border border-gray-200 first:rounded-tl-md last:rounded-tr-md text-left pl-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
                {displayedSurveys.map((survey, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="border border-gray-200 text-left w-9/12 pl-3">{survey.courseTitle}</td>
                        <td className="border border-gray-200 text-left w-2/12 text-center">{survey.numResponses}</td>
                        <td className="border border-gray-200 text-left w-1/12 justify-items-center">
                          <Search className="w-6 border rounded-lg p-1 cursor-pointer" onClick={() => handleModalOpen(rowIdx)}></Search>
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
  )
}