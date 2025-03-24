import express from "express";
import {
    createMeeting,
    createWebinar,
    getAllMeetings,
    getAllWebinars,
    getMeeting,
    getWebinar
} from "../controllers/zoomController";

const router = express.Router();

// POST Creates a meeting through FosterSource zoom
router.post("/new-meeting", createMeeting);

// POST new webinar
router.post("/new-webinar", createWebinar);

// GET gets all the existing meetings
router.get("/all-meetings", getAllMeetings);

// GET gets all the webinars
router.get("/all-webinars", getAllWebinars);

// GET gets a specific meeting by the
router.get("/meeting/:id", getMeeting);

// GET gets all the webinars
router.get("/webinar/:id", getWebinar);

export default router;
