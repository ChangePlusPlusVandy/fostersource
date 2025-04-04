import express from "express";
import {
	getSelectedCategories,
	updateSelectedCategories,
} from "../controllers/courseControllerCategories";

const router = express.Router();

router.get("/", getSelectedCategories);
router.put("/", updateSelectedCategories);

export default router;
