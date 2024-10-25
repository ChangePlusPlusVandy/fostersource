import express from "express";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
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

export default router;
