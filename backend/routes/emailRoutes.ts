import express from "express";
import {
	getEmails,
	createEmail,
	updateEmail,
	deleteEmail,
	createAndSendEmail,
} from "../controllers/emailController";

const router = express.Router();

// GET all emails or filter by query parameters
router.get("/", getEmails);

// POST new email
router.post("/", createEmail);

// Create and send a new email
router.post("/send", createAndSendEmail);

// PUT update email by ID
router.put("/:id", updateEmail);

// DELETE email by ID
router.delete("/:id", deleteEmail);

export default router;
