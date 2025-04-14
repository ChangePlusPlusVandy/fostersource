import { Request, Response } from "express";
import Course from "../models/courseModel";
import Rating from "../models/ratingModel";
import User, { IUser } from "../models/userModel";
import Progress, { IProgress } from "../models/progressModel";

// @desc    Get all courses or filter courses by query parameters
// @route   GET /api/courses
// @access  Public
export const getCourses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const filters = req.query;

		// Populate ratings and components fields as needed
		const courseResponses = await Course.find(filters)
			.populate(["ratings", "components"])
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
			const course = await Course.findById(id)
				.populate(["ratings", "components"])
				.exec();

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
	} catch (error) {
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
			components,
			isLive,
			categories,
			creditNumber,
			courseDescription,
			thumbnailPath,
			cost,
			instructorDescription,
			instructorRole,
			lengthCourse,
			time,
			instructorName,
			isInPerson,
			students,
			courseType,
			regStart,
			regEnd,
			productType,
		} = req.body;

		// Validate required fields
		if (
			!className ||
			isLive === undefined ||
			creditNumber === undefined ||
			!courseDescription ||
			!thumbnailPath ||
			cost === undefined ||
			!lengthCourse ||
			!time ||
			!instructorName ||
			isInPerson === undefined ||
			!courseType ||
			!regEnd
		) {
			res.status(400).json({
				success: false,
				message:
					"Please provide className, isLive, creditNumber, thumbnailPath, cost, lengthCourse, time, instructorName, isInPerson, courseType, and regStart",
			});
			return;
		}

		// Check for existing course
		let existingCourse = await Course.findOne({ className });
		if (existingCourse) {
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
			components,
			isLive,
			categories,
			creditNumber,
			courseDescription,
			thumbnailPath,
			cost,
			instructorDescription,
			instructorRole,
			lengthCourse,
			time,
			instructorName,
			isInPerson,
			students,
			courseType,
			regStart,
			regEnd,
			productType,
		});

		const savedCourseResponse = await newCourseResponse.save();

		res.status(201).json({
			success: true,
			data: savedCourseResponse,
			message: "chungus",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal service error." + error,
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

		// Find and update the course
		const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!updatedCourse) {
			res.status(404).json({
				success: false,
				message: "Course entry not found",
			});
			return;
		}

		const savedCourse = await updatedCourse?.save();

		res.status(200).json({
			success: true,
			data: savedCourse,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal service error.",
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

		const courseResponse = await Course.findById(id);

		if (!courseResponse) {
			res.status(404).json({
				success: false,
				message: "Course entry not found.",
			});
			return;
		}

		// Delete associated ratings
		await Rating.deleteMany({ _id: { $in: courseResponse.ratings } });

		// TODO: Handle deletion of associated components if needed

		// Delete the course
		await Course.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message: "Course and associated data deleted successfully.",
		});
	} catch (error) {
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
