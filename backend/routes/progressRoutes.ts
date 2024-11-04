import express from "express";
import {
  getProgress,
  createProgress,
  updateProgress,
  deleteProgress,
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

export default router;
