import express from "express";
import {
	getHandouts,
	createHandout,
	updateHandout,
	deleteHandout,
} from "../controllers/handoutController";

const router = express.Router();

// GET all handouts or filter by query parameters
router.get("/", getHandouts);

// POST new handout
router.post("/", createHandout);

// PUT update handout by ID
router.put("/:id", updateHandout);

// DELETE handout by ID
router.delete("/:id", deleteHandout);

export default router;