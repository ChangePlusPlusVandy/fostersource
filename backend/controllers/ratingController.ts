import { Request, Response } from "express";

// @desc    Get all ratings or filter by query parameters
// @route   GET /api/ratings
// @access  Public
export const getRatings = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Create a new rating
// @route   POST /api/ratings
// @access  Public
export const createRating = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Public
export const updateRating = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Public
export const deleteRating = async (
  req: Request,
  res: Response
): Promise<void> => {};
