import { Request, Response } from "express";
import Course from "../models/courseModel";

// @desc    Get all courses or filter courses by query parameters
// @route   GET /api/courses
// @access  Public
export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, instructor, category } = req.query; // Example filters

    // Create a query object based on the provided query parameters
    const query: { [key: string]: string | undefined } = {};

    if (name) query.name = String(name);
    if (instructor) query.instructor = String(instructor);
    if (category) query.category = String(category);

    // Fetch courses based on query (if no filters, return all courses)
    const courses = await Course.find(query);

    res.status(200).json(courses);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public
export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Public
export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {};
