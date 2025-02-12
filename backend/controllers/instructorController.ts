import { Request, Response } from "express";
import Instructor from "../models/instructorModel";

// @desc    Get all instructors or filter by query parameters
// @route   GET /api/instructors
// @access  Public
export const getInstructors = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const filters = req.query;
		const instructors = await Instructor.find(filters);

		res.status(200).json(instructors);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};

// @desc    Create a new instructor
// @route   POST /api/instructors
// @access  Public
export const createInstructor = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id, question } = req.body; // Changed from req.query to req.body

		// Check if instructor exists
		const existingInstructor = await Instructor.findOne({ id });

		if (existingInstructor) {
			res.status(200).json({
				instructor: existingInstructor,
				message: "Instructor already exists",
			});
			return;
		}

		// Create new instructor
		const instructor = new Instructor({
			id,
			question,
		});
		await instructor.save();

		res.status(201).json({
			instructor,
			message: "Instructor created successfully",
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};

// @desc    Update a instructor
// @route   PUT /api/instructors/:id
// @access  Public
export const updateInstructor = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id: instructorId } = req.params;
		const updates = req.body;

		const updatedInstructor = await Instructor.findByIdAndUpdate(
			instructorId,
			updates,
			{ new: true } // Returns the updated document
		);

		if (!updatedInstructor) {
			res.status(404).json({ message: "Instructor not found" });
			return;
		}

		res.status(200).json(updatedInstructor);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};

// @desc    Delete a instructor
// @route   DELETE /api/instructors/:id
// @access  Public
export const deleteInstructor = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		// Check if instructor exists
		const instructor = await Instructor.findById(id);
		if (!instructor) {
			res.status(404).json({
				success: false,
				message: "Instructor not found.",
			});
			return;
		}

		// Delete the instructor
		await Instructor.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message: "Instructor deleted successfully.",
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};
