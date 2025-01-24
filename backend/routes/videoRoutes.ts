import express from "express";
import {
	getVideos,
	createVideo,
	updateVideo,
	deleteVideo,
} from "../controllers/videoController";

const router = express.Router();

// GET all videos or filter by query parameters
router.get("/", getVideos);

// POST new video
router.post("/", createVideo);

// PUT update video by ID
router.put("/:id", updateVideo);

// DELETE video by ID
router.delete("/:id", deleteVideo);

export default router;
