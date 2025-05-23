import { Request, Response } from "express";
import Course from "../models/courseModel";
import Rating from "../models/ratingModel";
import User, { IUser } from "../models/userModel";
import Progress, { IProgress } from "../models/progressModel";

// Define an interface for error objects
interface ErrorWithDetails {
	message?: string;
	stack?: string;
	code?: number | string;
	errmsg?: string;
	name?: string;
	errors?: Record<string, any>;
	constructor?: { name: string };
}

// @desc    Get all courses or filter courses by query parameters
// @route   GET /api/courses
// @access  Public
export const getCourses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const filters = req.query;
		const courseResponses = await Course.find(filters)
			.populate(["speakers"])
			.exec();
		res.status(200).json({
			success: true,
			count: courseResponses.length,
			data: courseResponses,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Get a specific course by a valid id
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params; // Get the course ID from the URL params

		if (id) {
			// Find course by ID and populate related fields
			const course = await Course.findById(id).populate(["speakers"]).exec();

			if (!course) {
				res.status(404).json({
					success: false,
					message: "Course not found.",
				});
				return;
			}

			res.status(200).json({
				success: true,
				data: course,
			});
		} else {
			res.status(401).json({
				success: false,
				message: "Invalid ID",
			});
		}
	} catch (err: unknown) {
		const error = err as ErrorWithDetails;
		console.error("[getCourseById] Error:", error);
		console.error(
			"[getCourseById] Stack:",
			error.stack || "No stack trace available"
		);
		console.error("[getCourseById] Course ID:", req.params.id);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
export const createCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			handouts,
			ratings,
			className,
			discussion,
			categories,
			creditNumber,
			courseDescription,
			thumbnailPath,
			bannerPath,
			cost,
			instructorDescription,
			instructorRole,
			instructorName,
			students,
			managers,
			speakers,
			regStart,
			regEnd,
			productType,
			productInfo,
			shortUrl,
			draft,
		} = req.body;

		// Validate required fields
		if (!draft)
			if (
				!className ||
				creditNumber === undefined ||
				!courseDescription ||
				!thumbnailPath ||
				cost === undefined ||
				!instructorName ||
				!regEnd
			) {
				// console.log("[createCourse] Validation failed. Missing required fields");
				res.status(400).json({
					success: false,
					message:
						"Please provide className, isLive, creditNumber, thumbnailPath, cost, lengthCourse, instructorName, and regStart",
				});
				return;
			}

		// Check for existing course
		let existingCourse = await Course.findOne({ className });
		if (existingCourse) {
			// console.log("[createCourse] Course already exists:", existingCourse._id);
			res.status(200).json({
				data: existingCourse,
				message: "Course already exists",
			});
			return;
		}

		// Create a new course instance
		const newCourseResponse = new Course({
			handouts,
			ratings,
			className,
			discussion,
			categories,
			creditNumber,
			courseDescription,
			thumbnailPath,
			bannerPath,
			cost,
			instructorDescription,
			instructorRole,
			instructorName,
			students,
			managers,
			speakers,
			regStart,
			regEnd,
			productType,
			productInfo,
			shortUrl,
			draft,
		});

		const savedCourseResponse = await newCourseResponse.save();
		// console.log("[createCourse] Course created successfully:", savedCourseResponse._id);

		res.status(201).json({
			success: true,
			data: savedCourseResponse,
			message: "Course created successfully",
		});
	} catch (err: unknown) {
		const error = err as ErrorWithDetails;
		console.error("[createCourse] Error:", error);
		console.error(
			"[createCourse] Error message:",
			error.message || "No message available"
		);
		console.error(
			"[createCourse] Stack:",
			error.stack || "No stack trace available"
		);
		console.error("[createCourse] Request body:", req.body);
		res.status(500).json({
			success: false,
			message: "Internal service error: " + (error.message || "Unknown error"),
		});
	}
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public
export const updateCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const updates = req.body;

		// console.log("[updateCourse] Updating course ID:", id);
		// console.log("[updateCourse] Raw incoming updates:", JSON.stringify(updates));

		// If we're updating managers, ensure it's an array without duplicates
		if (updates.managers) {
			// console.log("[updateCourse] Original managers array:", updates.managers);

			// Validate each manager ID is a valid ObjectId format
			const validManagerIds = updates.managers.filter((managerId: string) => {
				// This regex checks for a valid ObjectId format (24 hex characters)
				const isValid = /^[0-9a-fA-F]{24}$/.test(managerId);
				if (!isValid) {
					console.warn(
						`[updateCourse] Invalid manager ID format: ${managerId}`
					);
				}
				return isValid;
			});

			if (validManagerIds.length !== updates.managers.length) {
				console.warn(
					"[updateCourse] Some manager IDs were invalid and filtered out"
				);
			}

			// Remove any duplicates
			try {
				const uniqueManagers = [...new Set(validManagerIds)];
				updates.managers = uniqueManagers;
				// console.log("[updateCourse] Processed managers array:", uniqueManagers);
			} catch (err) {
				console.error("[updateCourse] Error processing managers array:", err);
				console.error(
					"[updateCourse] Original managers data type:",
					typeof updates.managers
				);
				// Try to safely handle the managers array if it's not iterable
				if (typeof updates.managers === "string") {
					updates.managers = [updates.managers];
				} else if (!Array.isArray(updates.managers)) {
					updates.managers = [];
				}
			}
		}

		// Get the course before update for comparison
		const beforeCourse = await Course.findById(id);
		// console.log("[updateCourse] Course before update:", beforeCourse ? {
		//   _id: beforeCourse._id,
		//   managers: beforeCourse.managers
		// } : 'Not found');

		// Use findByIdAndUpdate
		// console.log("[updateCourse] Final update payload:", JSON.stringify(updates));
		const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
			new: true, // Return the modified document
			runValidators: false,
		});

		if (!updatedCourse) {
			// console.log("[updateCourse] Course not found for ID:", id);
			res
				.status(404)
				.json({ success: false, message: "Course entry not found" });
			return;
		}

		// console.log("[updateCourse] Course after update:", {
		//   _id: updatedCourse._id,
		//   managers: updatedCourse.managers
		// });

		res.status(200).json({ success: true, data: updatedCourse });
	} catch (err: unknown) {
		const error = err as ErrorWithDetails;
		console.error(
			"[updateCourse] Error type:",
			error.constructor?.name || "Unknown"
		);
		console.error(
			"[updateCourse] Error message:",
			error.message || "No message available"
		);
		console.error(
			"[updateCourse] Stack:",
			error.stack || "No stack trace available"
		);
		console.error("[updateCourse] Course ID:", req.params.id);
		console.error(
			"[updateCourse] Update payload:",
			JSON.stringify(req.body, null, 2)
		);

		// Get MongoDB specific error info if available
		if (error.name === "MongoServerError" || error.name === "MongoError") {
			console.error("[updateCourse] MongoDB error code:", error.code);
			console.error("[updateCourse] MongoDB error message:", error.errmsg);
		}

		// If it's a validation error, log more details
		if (error.name === "ValidationError") {
			console.error("[updateCourse] Validation errors:", error.errors);
		}

		res.status(500).json({
			success: false,
			message: "Internal service error: " + (error.message || "Unknown error"),
		});
	}
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Public
export const deleteCourse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		// console.log("[deleteCourse] Attempting to delete course ID:", id);

		const courseResponse = await Course.findById(id);

		if (!courseResponse) {
			// console.log("[deleteCourse] Course not found for ID:", id);
			// res.status(404).json({
			//   success: false,
			//   message: "Course entry not found.",
			// });
			return;
		}

		// console.log("[deleteCourse] Found course to delete:", courseResponse._id);

		// Delete associated ratings
		if (courseResponse.ratings && courseResponse.ratings.length > 0) {
			// console.log("[deleteCourse] Deleting associated ratings:", courseResponse.ratings);
			await Rating.deleteMany({ _id: { $in: courseResponse.ratings } });
		}

		// Delete the course
		await Course.deleteOne({ _id: id });
		// console.log("[deleteCourse] Course successfully deleted:", id);

		res.status(200).json({
			success: true,
			message: "Course and associated data deleted successfully.",
		});
	} catch (err: unknown) {
		const error = err as ErrorWithDetails;
		console.error("[deleteCourse] Error:", error);
		console.error(
			"[deleteCourse] Stack:",
			error.stack || "No stack trace available"
		);
		console.error("[deleteCourse] Course ID:", req.params.id);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Get all users enrolled in a course
// @route   GET /api/courses/:courseId/users
// @access  Public
export const getCourseUsers = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.params;
		console.log("Getting users for course:", courseId);
		console.log("Request params:", req.params);
		console.log("Request query:", req.query);

		// Validate input
		if (!courseId) {
			console.log("No courseId provided");
			res.status(400).json({
				success: false,
				message: "Course ID is required.",
			});
			return;
		}

		// Check if the course exists and populate the students field
		console.log("Looking up course in database...");
		const course = await Course.findById(courseId).populate("students");
		console.log("Found course:", course ? "Yes" : "No");
		if (!course) {
			console.log("Course not found in database");
			res.status(404).json({
				success: false,
				message: "Course not found.",
			});
			return;
		}

		console.log("Course found:", {
			id: course._id,
			name: course.className,
			studentCount: course.students?.length || 0,
		});
		console.log("Course students:", course.students);

		// Return the populated students array
		res.status(200).json({
			success: true,
			users: course.students || [],
		});
	} catch (error: any) {
		console.error("Error in getCourseUsers:", error);
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error.",
		});
	}
};

// @desc    Get progress for all users in a course
// @route   GET /api/courses/:courseId/progress
// @access  Public
export const getCourseProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.params;

		// Validate input
		if (!courseId) {
			res.status(400).json({
				success: false,
				message: "Course ID is required.",
			});
			return;
		}

		// Check if the course exists
		const course = await Course.findById(courseId);
		if (!course) {
			res.status(404).json({
				success: false,
				message: "Course not found.",
			});
			return;
		}

		// Get all enrolled users for the course
		const enrolledUsers = await User.find({ _id: { $in: course.students } });

		// Get existing progress records
		const existingProgress = await Progress.find({ course: courseId })
			.populate("user")
			.populate("course");

		// Find users who don't have progress records
		const usersWithProgress = new Set(
			existingProgress.map((p) => {
				const user = p.user as any;
				return user._id.toString();
			})
		);
		const usersWithoutProgress = enrolledUsers.filter(
			(user: any) => !usersWithProgress.has(user._id.toString())
		);

		// Create new progress records for users without one
		const newProgressRecords = await Promise.all(
			usersWithoutProgress.map(async (user) => {
				const newProgress = new Progress({
					user: user._id,
					course: courseId,
					isComplete: false,
					completedComponents: {
						webinar: false,
						survey: false,
						certificate: false,
					},
					dateCompleted: null,
				});
				return newProgress.save();
			})
		);

		// Combine existing and new progress records
		const allProgress = [...existingProgress, ...newProgressRecords];

		// Populate the new records
		const populatedProgress = await Progress.find({
			_id: { $in: allProgress.map((p) => p._id) },
		})
			.populate("user")
			.populate("course");

		res.status(200).json({
			success: true,
			progress: populatedProgress,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error.",
		});
	}
};

// @desc    Get progress for a single user in a course
// @route   GET /api/courses/:courseId/progress/:userId
// @access  Public
export const getUserCourseProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId, userId } = req.params;

		// Validate input
		if (!courseId || !userId) {
			res.status(400).json({
				success: false,
				message: "Course ID and User ID are required.",
			});
			return;
		}

		// Check if the course exists
		const course = await Course.findById(courseId);
		if (!course) {
			res.status(404).json({
				success: false,
				message: "Course not found.",
			});
			return;
		}

		// Check if the user is enrolled in the course
		const isEnrolled = course.students.some(
			(id) => id.toString() === userId.toString()
		);
		if (!isEnrolled) {
			res.status(403).json({
				success: false,
				message: "User is not enrolled in this course.",
			});
			return;
		}

		// Check for existing progress
		let progress = await Progress.findOne({ course: courseId, user: userId })
			.populate("user")
			.populate("course");

		// If no progress exists, create one
		if (!progress) {
			progress = await new Progress({
				user: userId,
				course: courseId,
				isComplete: false,
				completedComponents: {
					webinar: false,
					survey: false,
					certificate: false,
				},
				dateCompleted: null,
			}).save();

			// repopulate after save
			progress = await Progress.findById(progress._id)
				.populate("user")
				.populate("course");
		}

		res.status(200).json({
			success: true,
			progress,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error.",
		});
	}
};

// @desc    Update user's progress in a course
// @route   PUT /api/courses/:courseId/progress/:userId
// @access  Public
export const updateUserProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId, userId } = req.params;
		const { webinarComplete, surveyComplete, certificateComplete } = req.body;

		console.log("=== Progress Update Request ===");
		console.log("Params:", { courseId, userId });
		console.log("Body:", {
			webinarComplete,
			surveyComplete,
			certificateComplete,
		});

		// Find existing progress record
		const progress = await Progress.findOne({
			course: courseId,
			user: userId,
		});

		if (!progress) {
			console.error("Progress record not found");
			res.status(404).json({
				success: false,
				message: "Progress record not found.",
			});
			return;
		}

		console.log("Found progress:", progress._id);

		// Update completed components
		const completedComponents = {
			webinar: Boolean(webinarComplete),
			survey: Boolean(surveyComplete),
			certificate: Boolean(certificateComplete),
		};

		console.log("Setting completed components:", completedComponents);
		progress.completedComponents = completedComponents;

		// Check if all components are complete
		const allComplete = Object.values(completedComponents).every(Boolean);
		progress.isComplete = allComplete;
		if (allComplete && !progress.dateCompleted) {
			progress.dateCompleted = new Date();
		}

		console.log("Saving progress with data:", {
			_id: progress._id,
			completedComponents: progress.completedComponents,
			isComplete: progress.isComplete,
			dateCompleted: progress.dateCompleted,
		});

		await progress.save();
		console.log("Progress saved successfully");

		// Verify the save by fetching the updated record
		const updatedProgress = await Progress.findById(progress._id);
		console.log("Verified updated progress:", updatedProgress);

		res.status(200).json({
			success: true,
			progress: updatedProgress,
		});
	} catch (error: any) {
		console.error("Error in updateUserProgress:", error);
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error.",
		});
	}
};

// @desc    Batch update user progress in a course
// @route   PUT /api/courses/:courseId/progress/batch
// @access  Public
export const batchUpdateUserProgress = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { courseId } = req.params;
		const updates = req.body.updates; // Array of updates

		if (!Array.isArray(updates) || updates.length === 0) {
			res.status(400).json({
				success: false,
				message: "No updates provided.",
			});
			return;
		}

		const results: any[] = [];

		for (const update of updates) {
			const { userId, webinarComplete, surveyComplete, certificateComplete } =
				update;

			console.log("Processing update for user:", userId);

			const progress = await Progress.findOne({
				course: courseId,
				user: userId,
			});

			if (!progress) {
				console.warn(`Progress not found for user ${userId}`);
				results.push({
					userId,
					success: false,
					message: "Progress record not found.",
				});
				continue;
			}

			const completedComponents = {
				webinar: Boolean(webinarComplete),
				survey: Boolean(surveyComplete),
				certificate: Boolean(certificateComplete),
			};

			progress.completedComponents = completedComponents;

			const allComplete = Object.values(completedComponents).every(Boolean);
			progress.isComplete = allComplete;
			if (allComplete && !progress.dateCompleted) {
				progress.dateCompleted = new Date();
			}

			await progress.save();

			results.push({
				userId,
				success: true,
			});
		}

		res.status(200).json({
			success: true,
			message: "Batch update complete.",
			results,
		});
	} catch (error: any) {
		console.error("Error in batchUpdateUserProgress:", error);
		res.status(500).json({
			success: false,
			message: error.message || "Internal server error.",
		});
	}
};
