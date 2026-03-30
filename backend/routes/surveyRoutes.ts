import express from "express";
import {
	getSurveys,
	getSurveyById,
	createSurvey,
	updateSurvey,
	deleteSurvey,
	assignSurvey,
	unassignSurvey,
	duplicateSurvey,
} from "../controllers/surveyController";

const router = express.Router();

// GET all surveys or filter by query parameters
router.get("/", getSurveys);

// GET survey by ID
router.get("/:id", getSurveyById);

// POST new survey
router.post("/", createSurvey);


// PUT update survey by ID
router.put("/:id", updateSurvey);

// DELETE survey by ID
router.delete("/:id", deleteSurvey);

// POST assign survey to course
router.post("/:id/assign", assignSurvey);

// POST unassign survey from course
router.post("/:id/unassign", unassignSurvey);

// POST duplicate survey
router.post("/:id/duplicate", duplicateSurvey);

export default router;
