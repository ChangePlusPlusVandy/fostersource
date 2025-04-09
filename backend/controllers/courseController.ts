import { Request, Response } from "express";
import Course from "../models/courseModel";
import Rating from "../models/ratingModel";

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
				.populate(["ratings", "components", "managers"])
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
			shortUrl,
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
			// console.log("[createCourse] Validation failed. Missing required fields");
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
			shortUrl,
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
