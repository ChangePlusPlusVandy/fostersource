import express from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController";

const router = express.Router();

// GET all questions or filter by query parameters
router.get("/", getQuestions);

// POST new question
router.post("/", createQuestion);

// PUT update question by ID
router.put("/:id", updateQuestion);

// DELETE question by ID
router.delete("/:id", deleteQuestion);

export default router;
