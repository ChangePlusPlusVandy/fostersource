import express from "express";
import {
  getEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
} from "../controllers/emailController";

const router = express.Router();

// GET all emails or filter by query parameters
router.get("/", getEmails);

// GET single email by ID
router.get("/:id", getEmailById);

// POST new email
router.post("/", createEmail);

// PUT update email by ID
router.put("/:id", updateEmail);

// DELETE email by ID
router.delete("/:id", deleteEmail);

export default router;