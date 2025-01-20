import { Request, Response } from "express";
import Course from "../models/courseModel";
import Rating from "../models/ratingModel";

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
      creditCount,
      description,
      thumbnailPath
    } = req.body;

    // Validate required fields
    if (!className || !isLive || !creditCount || !description || !thumbnailPath) {
      res.status(400).json({
        success: false,
        message: "Please provide className, isLive, creditCount, description, and thumbnailPath",
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
      creditCount,
      description,
      thumbnailPath,
    });

    const savedCourseResponse = await newCourseResponse.save();

    res.status(201).json({
      success: true,
      data: savedCourseResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal service error.",
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
