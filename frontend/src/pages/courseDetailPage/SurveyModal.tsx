import apiClient from "../../services/apiClient";
import React, {useEffect, useState} from "react";
import SurveyQuestion from "./SurveyQuestion";
import Modal from "../../components/Modal";

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
                const questionIds = (await apiClient.get("surveys")).data.questions
                console.log(questionIds)
                setSurveyQuestions(questionIds)
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        populateQuestions();
    }, []);

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

    const handleNextQuestion = () => {
        if (questionNumber < surveyQuestions.length - 1) {
            setQuestionNumber(questionNumber + 1);
        } else {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Survey"
            className="w-11/12 max-w-4xl h-5/6"
            footer={
                <button
                    onClick={handleNextQuestion}
                    className="mt-6 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all"
                >
                    {questionNumber < surveyQuestions.length - 1 ? "Next" : "Finish"}
                </button>
            }
        >
            <div className="flex-1 overflow-auto">
                {surveyQuestions.length > 0 ? (
                    <SurveyQuestion
                        question={surveyQuestions[questionNumber]}
                        selectedAnswer={responses[surveyQuestions[questionNumber]._id] || ""}
                        onAnswerChange={handleAnswerChange}
                    />
                ) : (
                    <p className="text-gray-600 text-center">Loading questions...</p>
                )}
            </div>
        </Modal>
    );
}

