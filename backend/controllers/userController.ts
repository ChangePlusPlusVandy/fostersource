import { Request, Response } from "express";
import User from "../models/userModel";
import Progress from "../models/progressModel";
import Payment from "../models/paymentModel";
import Course from "../models/courseModel";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const { search, userType, page = 1, limit = 10 } = req.query;

		let query: any = {};

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		if (userType && userType !== "All") {
			query.userType = userType;
		}

		const skip = (Number(page) - 1) * Number(limit);

		const users = await User.find(query)
			.skip(skip)
			.limit(Number(limit))
			.select("name email userType company");

		const total = await User.countDocuments(query);

		res.json({
			users,
			total,
			pages: Math.ceil(total / Number(limit)),
		});
	} catch (error) {
		res.status(500).json({ message: "Error fetching users", error });
	}
};

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
			company,
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
			company,
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
		res.status(500).json({ message: "Error updating user", error });
	}
};

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

export const register = async (req: Request, res: Response): Promise<void> => {
	try {
		const { userId, courseIds } = req.body;

		if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
			res.status(400).json({
				success: false,
				message: "Please provide a valid userId and an array of courseIds.",
			});
			return;
		}

		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found.",
			});
			return;
		}

		const progressPromises = courseIds.map(async (courseId: string) => {
			const course = await Course.findById(courseId);
			if (!course) {
				throw new Error(`Course with ID ${courseId} not found.`);
			}

			const progress = new Progress({
				user: new mongoose.Types.ObjectId(userId),
				course: new mongoose.Types.ObjectId(courseId),
				isComplete: false,
				completedComponents: {},
				dateCompleted: null,
			});
			await progress.save();

			if (!course.students.includes(new mongoose.Types.ObjectId(userId))) {
				course.students.push(new mongoose.Types.ObjectId(userId));
				await course.save();
			}

			return progress;
		});

		const progressResults = await Promise.all(progressPromises);

		res.status(201).json({
			success: true,
			message: "User registered to courses successfully.",
			progress: progressResults,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error.",
		});
	}
};

export const checkAdmin = async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No user data found" });
		}

		const user = await User.findOne({ firebaseId: req.user.uid });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const isAdmin = user.role === "staff";

		return res.status(200).json({ isAdmin });
	} catch (error) {
		return res.status(500).json({ message: "Server error", error });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Error fetching user", error });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email, userType, company } = req.body;
		const user = new User({
			name,
			email,
			userType,
			company,
		});
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(500).json({ message: "Error creating user", error });
	}
};
