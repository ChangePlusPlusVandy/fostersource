import express from "express";
import {
	getSurvey,
	// createSurvey,
	updateSurvey,
	deleteSurvey,
} from "../controllers/surveyController";

const router = express.Router();

// GET all surveys or filter by query parameters
router.get("/", getSurvey);

// POST new survey
// router.post("/", createSurvey);

// PUT update survey by ID
router.put("/", updateSurvey);

// DELETE survey by ID
router.delete("/:id", deleteSurvey);

export default router;
