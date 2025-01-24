import express from "express";
import {
	getSurveyResponses,
	createSurveyResponse,
	// updateSurveyResponse,
	deleteSurveyResponse,
} from "../controllers/surveyResponseController";

const router = express.Router();

// GET all survey responses or filter by query parameters
router.get("/", getSurveyResponses);

// POST new survey response
router.post("/", createSurveyResponse);

// PUT update survey response by ID
// router.put("/:id", updateSurveyResponse);

// DELETE survey response by ID
router.delete("/:id", deleteSurveyResponse);

export default router;
