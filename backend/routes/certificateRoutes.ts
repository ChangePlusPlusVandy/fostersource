import express from "express";
import {
	createCertificate,
	getCertificates,
	updateCertificate,
	deleteCertificate,
} from "../controllers/certificateController";

const router = express.Router();

// POST new certificate
router.post("/", createCertificate);

// GET all certificates
router.get("/", getCertificates);

// PUT update certificate by ID
router.put("/:id", updateCertificate);

// DELETE certificate by ID
router.delete("/:id", deleteCertificate);

export default router;
