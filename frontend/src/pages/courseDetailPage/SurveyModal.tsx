import apiClient from "../../services/apiClient";
import React, {useEffect, useState} from "react";
import SurveyQuestion from "./SurveyQuestion";

interface SurveyModalProps {
    isOpen: boolean,
    onClose: any,
    surveyId: string
}

export default function SurveyModal({ isOpen, onClose, surveyId }:SurveyModalProps){
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);
    const [responses, setResponses] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const populateQuestions = async () => {
            let tempQuestions: any[] = []
            try {
                const questionIds = (await apiClient.get("surveys")).data[0].questions
                for(let id of questionIds){
                    let question = (await apiClient.get(`questions?_id=${id}`)).data[0]
                    let exists = false
                    for(let existing of tempQuestions){
                        if(existing._id === id){
                            exists = true;
                            break;
                        }
                    }
                    if(!exists){
                        tempQuestions = [...tempQuestions, question]
                    }
                }
                setSurveyQuestions(tempQuestions)
            } catch (error) {
                console.error("Failed to check admin status", error);
            }
        };

        populateQuestions();
    }, []);

    if (!isOpen) return null;

    async function addQuestion() {
        try {
            const response = await apiClient.post("survey", {
                question: "Do you have any other feedback for the course?",
                isMCQ: false,
            });
            console.log(response.status)
        } catch (error) {
            console.error("Failed to check admin status", error);
        }
    }

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
            let responseIds = []
            for(let id of Object.keys(responses)){
                const response = await apiClient.post("questionResponses", {
                    userId: JSON.parse(localStorage.user)._id,
                    questionId: id,
                    answer: (responses[`${id}`]).toString(),
                })
                responseIds.push(response.data._id)
            }
            const response = await apiClient.post("surveyResponses", {
                userId: JSON.parse(localStorage.user)._id,
                answers: responseIds,
            })

            let surveyResponseId = response.data._id
            // Beloved EM please add the updating the course to append the survey response once the other changes from Kevin is added for this.

            onClose();
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 p-8 relative flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl">
                    ✖
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Survey</h2>
                <div className="flex-1 overflow-auto">
                    {surveyQuestions.length > 0 ? (
                        <SurveyQuestion
                            question={surveyQuestions[questionNumber]}
                            selectedAnswer={responses[surveyQuestions[questionNumber]._id] || ""}
                            onAnswerChange={handleAnswerChange}
                        />                    ) : (
                        <p className="text-gray-600 text-center">Loading questions...</p>
                    )}
                </div>
                <button
                    onClick={handleNextQuestion}
                    className="mt-6 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all"
                >
                    {questionNumber < surveyQuestions.length - 1 ? "Next" : "Finish"}
                </button>
            </div>
        </div>
    );
};

