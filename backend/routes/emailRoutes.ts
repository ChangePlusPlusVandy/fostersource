import express from "express";
import {
	getEmails,
	createEmail,
	updateEmail,
	deleteEmail,
	createAndSendEmail,
	sendDirectEmail,
} from "../controllers/emailController";

const router = express.Router();

// GET all emails or filter by query parameters
router.get("/", getEmails);

// POST new email
router.post("/", createEmail);

// Create and send a new email
router.post("/send", createAndSendEmail);

// Send a direct email without storing a course email record
router.post("/send-direct", sendDirectEmail);

// PUT update email by ID
router.put("/:id", updateEmail);

// DELETE email by ID
router.delete("/:id", deleteEmail);

export default router;
