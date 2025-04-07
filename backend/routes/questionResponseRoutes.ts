import express from "express";
import {
	getQuestionResponses,
	createQuestionResponse,
	deleteQuestionResponse,
} from "../controllers/questionResponseController";

const router = express.Router();

// GET all question responses or filter by query parameters
router.get("/", getQuestionResponses);

// POST new question response
router.post("/", createQuestionResponse);

// DELETE question response by ID
router.delete("/:id", deleteQuestionResponse);

export default router;
