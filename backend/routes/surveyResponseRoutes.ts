import express from "express";
import {
	getSurveyResponses,
	createSurveyResponse,
	deleteSurveyResponse,
	getSurveyResponseStats,
	exportSurveyResponses,
} from "../controllers/surveyResponseController";
 
const router = express.Router();
 
// Static routes BEFORE parameterized routes
router.get("/stats", getSurveyResponseStats);
router.get("/export", exportSurveyResponses);

// GET all survey responses or filter by query parameters
router.get("/", getSurveyResponses);

// POST new survey response
router.post("/", createSurveyResponse);

// DELETE survey response by ID
router.delete("/:id", deleteSurveyResponse);
 
export default router;
