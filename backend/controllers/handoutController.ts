import { Request, Response } from "express";
import Handout from "../models/handoutModel";
import Course from "../models/courseModel";

// @desc    Get all handouts or filter handouts by courseId
// @route   GET /api/handouts
// @access  Public
export const getHandouts = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.query;

		let filters: any = {};
		if (courseId) {
			filters.courseId = courseId;
		}

		const handouts = await Handout.find(filters);

		res.status(200).json({
			success: true,
			count: handouts.length,
			data: handouts,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Create a new handout
// @route   POST /api/handouts
// @access  Public
export const createHandout = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId, fileUrl, fileType } = req.body;

		if (!courseId || !fileUrl || !fileType) {
			res.status(400).json({
				success: false,
				message: "Please provide courseId, fileUrl, and fileType",
			});
			return;
		}

		const newHandout = new Handout({
			courseId,
			fileUrl,
			fileType,
		});

		const savedHandout = await newHandout.save();

		res.status(201).json({
			success: true,
			data: savedHandout,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Update a handout
// @route   PUT /api/handouts/:id
// @access  Public
export const updateHandout = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { fileUrl, fileType } = req.body;

		const updatedHandout = await Handout.findByIdAndUpdate(
			id,
			{ fileUrl, fileType },
			{ new: true, runValidators: true }
		);

		if (!updatedHandout) {
			res.status(404).json({
				success: false,
				message: `Handout with id ${id} not found`,
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: updatedHandout,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Delete a handout
// @route   DELETE /api/handouts/:id
// @access  Public
export const deleteHandout = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { courseId } = req.body;

		const deletedHandout = await Handout.findByIdAndDelete(id);
		if (!deletedHandout) {
			res.status(404).json({
				success: false,
				message: `Handout with id ${id} not found`,
			});
			return;
		}

		// Remove reference from Course.handouts
		if (courseId) {
			await Course.findByIdAndUpdate(courseId, {
				$pull: { handouts: id },
			});
		}

		res.status(200).json({
			success: true,
			data: deletedHandout,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};
