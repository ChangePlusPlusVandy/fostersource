import { Request, Response } from "express";
import Payment from "../models/paymentModel";
import User from "../models/userModel";

// @desc    Get all payments or filter by query parameters
// @route   GET /api/payments
// @access  Public
export const getPayments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId, startDate, endDate, minAmount, maxAmount } = req.query;

		let filter: any = {};

		if (userId) {
			filter.userId = userId;
		}

		if (startDate || endDate) {
			filter.date = {};
			if (startDate) {
				filter.date.$gte = new Date(startDate as string);
			}
			if (endDate) {
				filter.date.$lte = new Date(endDate as string);
			}
		}

		if (minAmount || maxAmount) {
			filter.amount = {};
			if (minAmount) {
				filter.amount.$gte = parseFloat(minAmount as string);
			}
			if (maxAmount) {
				filter.amount.$lte = parseFloat(maxAmount as string);
			}
		}

		const payments = await Payment.find(filter).exec();

		res.status(200).json(payments);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Public
export const createPayment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId, date, amount, memo, courses, transactionId } = req.body;

		if (!userId || !date || !amount || !memo || courses.length === 0 || !transactionId) {
			res.status(400).json({
				success: false,
				message: "Please provide userId, date, amount, memo, courses, and transaction ID.",
			});
			return;
		}

		const newPayment = new Payment({
			userId,
			date,
			amount,
			memo,
			courses,
			transactionId
		});

		const savedPayment = await newPayment.save();

		res.status(201).json(savedPayment);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
// @access  Public
export const updatePayment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { userId, date, amount, memo, courses, transactionId } = req.body;

		const payment = await Payment.findById(id);

		if (!payment) {
			res.status(404).json({
				success: false,
				message: "Payment not found.",
			});
			return;
		}

		if (userId) payment.userId = userId;
		if (date) payment.date = new Date(date);
		if (amount) payment.amount = amount;
		if (memo) payment.memo = memo;
		if (courses) payment.courses = courses; 
		if (transactionId) payment.transactionId = transactionId; 

		const updatedPayment = await payment.save();

		res.status(200).json(updatedPayment);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Public
export const deletePayment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		const payment = await Payment.findById(id);

		if (!payment) {
			res.status(404).json({
				success: false,
				message: "Payment not found.",
			});
			return;
		}

		await User.findByIdAndUpdate(
			payment.userId,
			{ $pull: { payments: id } },
			{ new: true }
		);

		await Payment.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message: "Payment deleted successfully.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};
