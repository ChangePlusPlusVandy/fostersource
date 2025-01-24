import { Request, Response } from "express";
import Question from "../models/questionModel";

// @desc    Get all questions or filter by query parameters
// @route   GET /api/questions
// @access  Public
export const getQuestions = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const questions = await Question.find(req.query);
		res.status(200).json(questions);
	} catch (error) {
		res.status(500).json({ message: "Error retrieving questions", error });
	}
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Public
export const createQuestion = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { question, isMCQ, answers } = req.body;
	try {
		const newQuestion = new Question({ question, isMCQ, answers });
		const savedQuestion = await newQuestion.save();
		res.status(201).json(savedQuestion);
	} catch (error) {
		res.status(400).json({ message: "Error creating question", error });
	}
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Public
export const updateQuestion = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const updateData = req.body;
	try {
		const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
			new: true,
		});
		if (!updatedQuestion) {
			res.status(404).json({ message: "Question not found" });
			return;
		}
		res.status(200).json(updatedQuestion);
	} catch (error) {
		res.status(400).json({ message: "Error updating question", error });
	}
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Public
export const deleteQuestion = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	try {
		const deletedQuestion = await Question.findByIdAndDelete(id);
		if (!deletedQuestion) {
			res.status(404).json({ message: "Question not found" });
			return;
		}
		res.status(200).json({ message: "Question deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: "Error deleting question", error });
	}
};
