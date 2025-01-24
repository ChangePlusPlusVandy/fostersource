import { Request, Response } from "express";
import Progress, { IProgress } from "../models/progressModel";

// @desc    Get all progress or filter by query parameters
// @route   GET /api/progress
// @access  Public
export const getProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const progress = await Progress.find(req.query); // Filter by query parameters if provided
		res.status(200).json(progress);
	} catch (error) {
		res.status(500).json({ message: "Error fetching progress data", error });
	}
};

// @desc    Create a new progress entry
// @route   POST /api/progress
// @access  Public
export const createProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const newProgress: IProgress = new Progress(req.body); // Create a new progress entry
		await newProgress.save();
		res.status(201).json(newProgress); // Return the created progress entry
	} catch (error) {
		res.status(400).json({ message: "Error creating progress entry", error });
	}
};

// @desc    Update a progress entry
// @route   PUT /api/progress/:id
// @access  Public
export const updateProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params; // Get the ID from the request parameters
	try {
		const updatedProgress = await Progress.findByIdAndUpdate(id, req.body, {
			new: true, // Return the updated document
			runValidators: true, // Run validation on the update
		});

		if (!updatedProgress) {
			res.status(404).json({ message: "Progress entry not found" });
		}

		res.status(200).json(updatedProgress); // Return the updated progress entry
	} catch (error) {
		res.status(500);
	}
};

// @desc    Delete a progress entry
// @route   DELETE /api/progress/:id
// @access  Public
export const deleteProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params; // Get the ID from the request parameters
	try {
		const deletedProgress = await Progress.findByIdAndDelete(id);

		//TODO: Once the other endpoints are created, this might have to recursively delete the subitems

		if (!deletedProgress) {
			res.status(404).json({ message: "Progress entry not found" });
		}

		res.status(204).send(); // Send a 204 No Content response
	} catch (error) {
		res.status(500);
	}
};
