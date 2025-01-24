import { Request, Response } from "express";
import QuestionResponse from "../models/questionResponseModel";

// @desc    Get all question responses or filter by query parameters
// @route   GET /api/questionResponses
// @access  Public
export const getQuestionResponses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const filters = req.query;
		const questionsResponse = await QuestionResponse.find(filters);
		res.status(200).json(questionsResponse);
	} catch (error) {
		res.status(500).json({ message: "GET error" });
	}
};

// @desc    Create a new question response
// @route   POST /api/questionResponses
// @access  Public
export const createQuestionResponse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const newResponse = new QuestionResponse(req.body);
		const savedResponse = await newResponse.save();
		res.status(201).json(savedResponse);
	} catch (error) {
		res.status(500).json({ message: "POST error" });
	}
};

// @desc    Update a question response
// @route   PUT /api/questionResponses/:id
// @access  Public
export const updateQuestionResponse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const update = req.body;
		const updatedResponse = await QuestionResponse.findByIdAndUpdate(
			id,
			update,
			{ new: true }
		);
		if (!updatedResponse) {
			res.status(404).json({ message: "Response not found" });
			return;
		}
		res.status(200).json(updatedResponse);
	} catch (error) {
		res.status(500).json({ message: "PUT error" });
	}
};

// @desc    Delete a question response
// @route   DELETE /api/questionResponses/:id
// @access  Public
export const deleteQuestionResponse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const deleted = await QuestionResponse.findByIdAndDelete(id);
		if (!deleted) {
			res.status(404).json({ message: "Response not found" });
			return;
		}
		res.status(200).json({ message: "Deleted: ", deleted });
	} catch (error) {
		res.status(500).json({ message: "DELETE error" });
	}
};
