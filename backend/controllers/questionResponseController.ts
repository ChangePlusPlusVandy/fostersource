import { Request, Response } from "express";

// @desc    Get all question responses or filter by query parameters
// @route   GET /api/questionResponses
// @access  Public
export const getQuestionResponses = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Create a new question response
// @route   POST /api/questionResponses
// @access  Public
export const createQuestionResponse = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a question response
// @route   PUT /api/questionResponses/:id
// @access  Public
export const updateQuestionResponse = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a question response
// @route   DELETE /api/questionResponses/:id
// @access  Public
export const deleteQuestionResponse = async (
  req: Request,
  res: Response
): Promise<void> => {};
