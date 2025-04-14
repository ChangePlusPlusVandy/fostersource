import express from "express";
import {
    createMeeting, createWebinar,
    getMeetings, getWebinars
} from "../controllers/zoomController";

const router = express.Router();

router.get("/meetings", getMeetings);
router.get("/webinars", getWebinars);

router.post("/meeting", createMeeting)
router.post("/webinar", createWebinar)

export default router;
