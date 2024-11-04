import { Request, Response } from "express";

// @desc    Get all questions or filter by query parameters
// @route   GET /api/questions
// @access  Public
export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Public
export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Public
export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Public
export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {};
