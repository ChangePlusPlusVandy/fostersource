import { Request, response, Response } from "express";
import Video from "../models/videoModel";

// @desc    Get all videos or filter videos by query parameters
// @route   GET /api/videos
// @access  Public
export const getVideos = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const query = req.query;

		let filters: any = {};

		if (query.title) {
			filters.title = { $regex: query.title, $options: "i" };
		}
		if (query.courseId) {
			filters.courseId = query.courseId;
		}
		if (query.published) {
			filters.published = query.published === "true";
		}

		const videos = await Video.find(filters).populate("courseId");

		res.status(200).json({
			success: true,
			count: videos.length,
			data: videos,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			error: error instanceof Error ? error.message : "An unexpected error occurred",
		});
	}
};

// @desc    Create a new video
// @route   POST /api/videos
// @access  Public
export const createVideo = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { title, description, videoUrl, courseId, published } = req.body;

		if (!title || !description || !videoUrl || !courseId) {
			res.status(400).json({
				success: false,
				message: "Please provide title, description, videoUrl, and courseId",
			});
			return;
		}

		const newVideo = new Video({
			title,
			description,
			videoUrl,
			courseId,
			published: published || false,
		});

		const savedVideo = await newVideo.save();

		res.status(201).json({
			success: true,
			data: savedVideo,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			error: error instanceof Error ? error.message : "An unexpected error occurred",
		});
	}
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Public
export const updateVideo = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { title, description, videoUrl, courseId, published } = req.body;

		const updatedVideo = await Video.findByIdAndUpdate(
			id,
			{ title, description, videoUrl, courseId, published },
			{ new: true, runValidators: true }
		);
		if (!updatedVideo) {
			res.status(404).json({
				success: false,
				message: `Video with id ${id} not found`,
			});
			return;
		}
		res.status(200).json({
			success: true,
			data: updatedVideo,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			error: error instanceof Error ? error.message : "An unexpected error has occurred",
		});
	}
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Public
export const deleteVideo = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		const deleteVideo = await Video.findByIdAndDelete(id);
		if (!deleteVideo) {
			res.status(404).json({
				success: false,
				message: `Video with id ${id} doesn't exist`,
			});
			return;
		}
		res.status(200).json({
			success: true,
			data: deleteVideo,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			error: error instanceof Error ? error.message : "An unexpected error has occurred",
		});
	}
};
