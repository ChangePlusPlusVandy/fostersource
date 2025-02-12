import { Request, Response } from "express";
import User from "../models/userModel";
import Progress from "../models/progressModel";
import Payment from "../models/paymentModel";
import Course from "../models/courseModel";
import mongoose from "mongoose";

// @desc    Get all users or by filter
// @route   GET /api/users
// @access  Public
export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const filters = req.query;
		const users = await User.find(filters);
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Failed to get users", error });
	}
};

// @desc    Get or create a user
// @route   POST /api/users
// @access  Public
export const getOrCreateUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			firebaseId,
			email,
			isColorado,
			role,
			name,
			address1,
			address2,
			city,
			state,
			zip,
			certification,
			phone,
			progress,
			payments,
			cart,
		} = req.body;

		let user = await User.findOne({ firebaseId });

		if (user) {
			res.status(200).json({ user, message: "User already exists" });
			return;
		}

		const newUser = new User({
			firebaseId,
			email,
			isColorado,
			role,
			name,
			address1,
			address2,
			city,
			state,
			zip,
			certification,
			phone,
			progress,
			payments,
			cart,
		});

		const savedUser = await newUser.save();
		res
			.status(201)
			.json({ user: savedUser, message: "User created successfully" });
	} catch (error) {
		res.status(400).json({ message: "Failed to get or create user", error });
	}
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updatedUser = await User.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!updatedUser) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: "Failed to update user: ", error });
	}
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		const user = await User.findById(id);

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found.",
			});
			return;
		}

		await Progress.deleteMany({ _id: { $in: user.progress } });
		await Payment.deleteMany({ _id: { $in: user.payments } });

		await User.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message:
				"User and associated progress and payment records deleted successfully.",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error.",
		});
	}
};

// @desc    Registers users
// @route   PUT /api/users/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
	try {
		const { userId, courseIds } = req.body;

		// Validate input
		if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
			res.status(400).json({
				success: false,
				message: "Please provide a valid userId and an array of courseIds.",
			});
			return;
		}

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found.",
			});
			return;
		}

		// Process each course
		const progressPromises = courseIds.map(async (courseId: string) => {
			// Check if course exists
			const course = await Course.findById(courseId);
			if (!course) {
				throw new Error(`Course with ID ${courseId} not found.`);
			}

			// Create a progress document for the user
			const progress = new Progress({
				user: new mongoose.Types.ObjectId(userId),
				course: new mongoose.Types.ObjectId(courseId),
				isComplete: false,
				completedComponents: {},
				dateCompleted: null,
			});
			await progress.save();

			// Add the user to the course's students list if not already added
			if (!course.students.includes(new mongoose.Types.ObjectId(userId))) {
				course.students.push(new mongoose.Types.ObjectId(userId));
				await course.save();
			}

			return progress;
		});

		// Wait for all progress documents to be created
		const progressResults = await Promise.all(progressPromises);

		res.status(201).json({
			success: true,
			message: "User registered to courses successfully.",
			progress: progressResults,
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			// @ts-ignore
			message: error.message || "Internal server error.",
		});
	}
};


