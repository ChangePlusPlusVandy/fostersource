import React, {useEffect, useState} from "react";
import CatalogCourseComponent from "../Catalog/CatalogCourseComponent";

interface SurveyQuestionProps {
    question: any;
    selectedAnswer: string;
    onAnswerChange: (questionId: string, answer: string) => void;
}

export default function SurveyQuestion({ question, selectedAnswer, onAnswerChange }: SurveyQuestionProps) {
    return (
        <div>
            <p className="text-lg font-semibold mb-4">{question.question}</p>
            {question.isMCQ ? (
                <div className="flex flex-col gap-4">
                    {question.answers.length > 0 ? (
                        question.answers.map((answer: string, index: number) => (
                            <label key={index} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={`survey-${question._id}`}
                                    value={answer}
                                    checked={selectedAnswer === answer}
                                    onChange={() => onAnswerChange(question._id, answer)}
                                    className="w-4 h-4"
                                />
                                <span className="text-gray-700">{answer}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No answers available. Press "Next" to continue.</p>
                    )}
                </div>
            ) : (
                <textarea
                    className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Type your answer here..."
                    value={selectedAnswer}
                    onChange={(e) => onAnswerChange(question._id, e.target.value)}
                />
            )}
        </div>
    );
}
