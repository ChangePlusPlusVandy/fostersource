import { Request, Response } from "express";

// @desc    Get all videos or filter videos by query parameters
// @route   GET /api/videos
// @access  Public
export const getVideos = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Create a new video
// @route   POST /api/videos
// @access  Public
export const createVideo = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Public
export const updateVideo = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Public
export const deleteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {};
