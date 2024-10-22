import { Request, Response } from "express";
// TODO: FINISH 
// @desc    Get all videos or filter videos by query parameters
// @route   GET /api/videos
// @access  Public
import Video from '../models/videoModel'; // Assuming you have a Video model

// @desc    Get all videos or filter videos by query parameters
// @route   GET /api/videos
// @access  Public
export const getVideos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query;

    // Building the filtering logic based on query parameters
    let filters: any = {};

    if (query.title) {
      filters.title = { $regex: query.title, $options: 'i' }; // case-insensitive title search
    }
    if (query.genre) {
      filters.genre = query.genre;
    }
    if (query.published) {
      filters.published = query.published === 'true';
    }

    // Fetching videos based on filters, or all if no filters are provided
    const videos = await Video.find(filters);

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    if(error instanceof Error){
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      })
      
    }else{
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: 'An unexpected error occured',
      })
    }
  }
};


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
