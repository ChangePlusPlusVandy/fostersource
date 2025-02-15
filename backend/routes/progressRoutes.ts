import express from "express";
import {
	getProgress,
	createProgress,
	updateProgress,
	deleteProgress,
	getUserProgresses,
} from "../controllers/progressController";

const router = express.Router();

// GET all progress or filter by query parameters
router.get("/", getProgress);

// POST new progress
router.post("/", createProgress);

// PUT update progress by ID
router.put("/:id", updateProgress);

// DELETE progress by ID
router.delete("/:id", deleteProgress);

// GET progress based on the user
router.get("/progress/:userId", getUserProgresses);


export default router;
