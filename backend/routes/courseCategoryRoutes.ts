import express from "express";
import {
	getCourseCategories,
	createCourseCategory,
	deleteCourseCategory,
} from "../controllers/courseCategoryController";

const router = express.Router();

router.get("/", getCourseCategories);
router.post("/", createCourseCategory);
router.delete("/:id", deleteCourseCategory);

export default router;
