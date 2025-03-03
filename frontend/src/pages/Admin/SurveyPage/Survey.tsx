import React, { useState, useEffect } from 'react';
import { List, Trash2, X } from 'lucide-react';

const Survey = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [questions, setQuestions] = useState([
        {
            question: '',
            answerType: 'Text Input',
            options: [''],
        },
    ]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setHasUnsavedChanges(true);
    };

    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSummary(e.target.value);
        setHasUnsavedChanges(true);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: '',
                answerType: 'Text Input',
                options: [''],
            },
        ]);
        setHasUnsavedChanges(true);
    };

    const deleteQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
    };

    const handleAnswerTypeChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answerType = value;
        // Reset options (for Multiple Choice or Multi-select)
        if (value !== 'Text Input') {
            updatedQuestions[index].options = [''];
        }
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
    };

    const addOption = (qIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push('');
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
    };

    const deleteOption = (qIndex: number, oIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.splice(oIndex, 1);
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

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    const handleStay = () => {
        setIsModalOpen(false);
    };

    const handleLeave = () => {
        // Implement exit logic here (e.g., redirecting the user or closing the form)
        setIsModalOpen(false);
        // Console log that the user is leaving
        // console.log("User left the page.");
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-8">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div className="flex items-center space-x-2">
                    <List className="w-6 h-6" />
                    <h1 className="text-2xl font-semibold text-gray-800">Survey</h1>
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block font-semibold text-lg">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter survey title"
                        className="w-full mt-2 p-3 border rounded-md"
                    />
                </div>

                {/* Summary */}
                <div>
                    <label htmlFor="summary" className="block font-semibold text-lg">Summary</label>
                    <textarea
                        id="summary"
                        value={summary}
                        onChange={handleSummaryChange}
                        placeholder="Enter survey summary"
                        rows={4}
                        className="w-full mt-2 p-3 border rounded-md"
                    />
                </div>

                {/* Questions */}
                <div>
                    {questions.map((question, index) => (
                        <div key={index} className="space-y-4 mt-16">
                            {/* Question */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <label htmlFor={`question-${index}`} className="block font-semibold">
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

                            {/* Answer Type */}
                            <div>
                                <label htmlFor={`answer-type-${index}`} className="block font-semibold">Answer Type</label>
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

                            {/* Options (for Multiple Choice or Multi-select) */}
                            {(question.answerType === 'Multiple Choice' || question.answerType === 'Multi-select') && (
                                <div className="mt-4 space-y-3 pl-16">
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
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
                        {/* Save and Exit Button */}
                        <button
                            onClick={() => {
                                // Add save logic here
                            }}
                            className="w-[200px] bg-[#8757A3] text-white py-2 px-4 rounded-md hover:bg-[#6d4a92] focus:ring-2 focus:ring-[#8757A3]"
                        >
                            Save and Exit
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
                        <p className="mt-2">It looks like you have edits that aren’t saved yet. Are you sure you want to leave?</p>
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
