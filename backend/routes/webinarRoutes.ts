import express from "express";
import {
	getWebinar,
	getOrCreateWebinar,
	updateWebinar,
	deleteWebinar,
} from "../controllers/webinarController";

const router = express.Router();

// GET all ratings or filter by query parameters
router.get("/", getWebinar);

// POST new rating
router.post("/", getOrCreateWebinar);

// PUT update rating by ID
router.put("/:id", updateWebinar);

// DELETE rating by ID
router.delete("/:id", deleteWebinar);

export default router;
