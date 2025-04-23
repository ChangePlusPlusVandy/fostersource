import express from "express";
import {
	getCourses,
	createCourse,
	updateCourse,
	deleteCourse,
	getCourseById,
	getCourseUsers,
	getCourseProgress,
	updateUserProgress,
} from "../controllers/courseController";

const router = express.Router();

// GET all courses or filter by query parameters
router.get("/", getCourses);

// GET course by ID
router.get("/:id", getCourseById);

// POST new course
router.post("/", createCourse);

// PUT update course by ID
router.put("/:id", updateCourse);

// DELETE course by ID
router.delete("/:id", deleteCourse);

// GET all users enrolled in a course
router.get("/:courseId/users", getCourseUsers);

// GET progress for all users in a course
router.get("/:courseId/progress", getCourseProgress);

// PUT update user's progress in a course
router.put("/:courseId/progress/:userId", updateUserProgress);

export default router;
