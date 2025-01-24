import express from "express";
import {
	getRatings,
	createRating,
	updateRating,
	deleteRating,
} from "../controllers/ratingController";

const router = express.Router();

// GET all ratings or filter by query parameters
router.get("/", getRatings);

// POST new rating
router.post("/", createRating);

// PUT update rating by ID
router.put("/:id", updateRating);

// DELETE rating by ID
router.delete("/:id", deleteRating);

export default router;
