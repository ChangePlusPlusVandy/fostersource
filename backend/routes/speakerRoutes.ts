import express from "express";
import { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker, uploadSpeakerImage } from "../controllers/speakerController";

const router = express.Router();

router.get("/", getSpeakers);
router.post("/", uploadSpeakerImage, createSpeaker);
router.put("/:id", uploadSpeakerImage, updateSpeaker);
router.delete("/:id", deleteSpeaker);

export default router;