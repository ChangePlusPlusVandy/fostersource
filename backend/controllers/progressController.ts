import { Request, Response } from "express";

// @desc    Get all progress or filter by query parameters
// @route   GET /api/progress
// @access  Public
export const getProgress = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Create a new progress entry
// @route   POST /api/progress
// @access  Public
export const createProgress = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a progress entry
// @route   PUT /api/progress/:id
// @access  Public
export const updateProgress = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a progress entry
// @route   DELETE /api/progress/:id
// @access  Public
export const deleteProgress = async (
  req: Request,
  res: Response
): Promise<void> => {};
