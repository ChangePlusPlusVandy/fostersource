import express from "express";
import {
	getPayments,
	createPayment,
	updatePayment,
	deletePayment,
	createPaypalOrder,
	capturePaypalOrder,
} from "../controllers/paymentController";

const router = express.Router();

// GET all payments or filter by query parameters
router.get("/", getPayments);

// POST new payment
router.post("/", createPayment);

// PUT update payment by ID
router.put("/:id", updatePayment);

// DELETE payment by ID
router.delete("/:id", deletePayment);

router.post("/create-paypal-order", createPaypalOrder);
router.post("/capture-paypal-order", capturePaypalOrder);

export default router;
