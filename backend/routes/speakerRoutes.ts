import express from "express";
import {
	getSpeakers,
	createSpeaker,
	updateSpeaker,
	deleteSpeaker,
} from "../controllers/speakerController";

const router = express.Router();

router.get("/", getSpeakers);
router.post("/", createSpeaker);
router.put("/:id", updateSpeaker);
router.delete("/:id", deleteSpeaker);

export default router;
