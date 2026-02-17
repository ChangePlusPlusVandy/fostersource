import { Request, Response } from "express";
import User from "../models/userModel";
import Progress from "../models/progressModel";
import Payment from "../models/paymentModel";
import Course from "../models/courseModel";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { emailQueue } from "../jobs/emailQueue";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const {
			search,
			userType,
			page = 1,
			limit = 10,
			pagination = "true",
		} = req.query;

		// Extract _id parameter with proper typing
		const _id = req.query._id as string | string[] | undefined;

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

		// Handle _id filtering - support both single ID and array of IDs
		if (_id) {
			if (Array.isArray(_id)) {
				// Multiple IDs: _id[]
				const objectIds = _id.map((id) => new mongoose.Types.ObjectId(id));
				query._id = { $in: objectIds };
			} else {
				// Single ID or comma-separated string
				const ids = _id.split(",");
				if (ids.length > 1) {
					const objectIds = ids.map(
						(id) => new mongoose.Types.ObjectId(id.trim())
					);
					query._id = { $in: objectIds };
				} else {
					query._id = new mongoose.Types.ObjectId(ids[0].trim());
				}
			}
		}

		// If pagination=false, return all matching users
		if (pagination === "false") {
			const users = await User.find(query)
				.select(
					"name email role company certification address1 city state zip phone language certification"
				)
				.populate("role");

			res.json({ users, total: users.length, pages: 1 });
			return;
		}

		// Otherwise paginate
		const skip = (Number(page) - 1) * Number(limit);

		const users = await User.find(query)
			.skip(skip)
			.limit(Number(limit))
			.select(
				"name email role company certification address1 city state zip phone language certification"
			)
			.populate("role");

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

			const studentId = new mongoose.Types.ObjectId(userId);
			const alreadyEnrolled = course.students.some(
				(id) => id.toString() === userId.toString()
			);
			if (alreadyEnrolled) {
				return {
					courseId,
					status: "already-enrolled",
				};
			}

			const limit = course.registrationLimit || 0;
			const isFull = limit > 0 && course.students.length >= limit;
			const existingWaitlistEntry = course.waitlist?.find(
				(entry) => entry.user.toString() === userId.toString()
			);

			if (isFull) {
				if (!existingWaitlistEntry) {
					course.waitlist = course.waitlist || [];
					course.waitlist.push({ user: studentId, joinedAt: new Date() });
					course.waitlist.sort(
						(a, b) =>
							new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
					);
					await course.save();
					await emailQueue.add("waitlist-confirmation", {
						userId: userId.toString(),
						courseId: courseId.toString(),
					});
				}
				return {
					courseId,
					status: "waitlisted",
				};
			}

			const progress = new Progress({
				user: studentId,
				course: new mongoose.Types.ObjectId(courseId),
				isComplete: false,
				completedComponents: {
					webinar: false,
					survey: false,
					certificate: false,
				},
				dateCompleted: null,
			});
			await progress.save();

			if (!course.students.some((id) => id.toString() === userId.toString())) {
				course.students.push(studentId);
				await course.save();
			}

			await emailQueue.add("registration-confirmation", {
				userId: userId.toString(),
				courseId: courseId.toString(),
			});

			return {
				courseId,
				status: "enrolled",
				progressId: progress._id,
			};
		});

		const progressResults = await Promise.all(progressPromises);

		res.status(201).json({
			success: true,
			message: "User processed for course registration.",
			results: progressResults,
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

		const user = await User.findOne({ firebaseId: req.user.uid }).populate(
			"role"
		);

		if (!user || !user.role) {
			return res
				.status(404)
				.json({ message: "User not found or role missing" });
		}

		const isAdmin = (user.role as any).name?.toLowerCase() === "staff";

		return res.status(200).json({ isAdmin });
	} catch (error) {
		return res.status(500).json({ message: "Server error", error });
	}
};

export const getUserById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
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
