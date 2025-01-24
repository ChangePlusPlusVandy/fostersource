import express from "express";
import {
	getCourses,
	createCourse,
	updateCourse,
	deleteCourse,
} from "../controllers/courseController";

const router = express.Router();

// GET all courses or filter by query parameters
router.get("/", getCourses);

// POST new course
router.post("/", createCourse);

// PUT update course by ID
router.put("/:id", updateCourse);

// DELETE course by ID
router.delete("/:id", deleteCourse);

export default router;
