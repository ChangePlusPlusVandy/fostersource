import { Request, Response } from "express";
import Progress, { IProgress } from "../models/progressModel";
import Email, { IEmail } from "../models/emailModel";
import User from "../models/userModel";
import Course from "../models/courseModel";
import { sendEmail } from "../config/resend";
import { emailQueue } from "../jobs/emailQueue";
import mongoose from "mongoose";

// @desc    Get all emails or filter by query parameters
// @route   GET /api/email
// @access  Public
export const getEmails = async (req: Request, res: Response): Promise<void> => {
	try {
		const emails = await Email.find(req.query)
			.populate({
				path: "course",
				select: "className",
			})
			.sort({ sendDate: -1 });
		res.status(200).json(emails);
	} catch (error) {
		res.status(500).json({ message: "Error fetching progress data", error });
	}
};

// @desc    Create a new email
// @route   POST /api/email
// @access  Public
export const createEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const newEmail: IEmail = new Email(req.body);
		await newEmail.save();
		res.status(201).json(newEmail);
	} catch (error) {
		res.status(400).json({ message: "Error creating progress entry", error });
	}
};

// @desc    Create and send a new email
// @route   POST /api/email/send
// @access  Public
export const createAndSendEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { subject, body, courseId, sendDate } = req.body;

		const newEmail: IEmail = new Email({
			course: courseId,
			subject,
			body,
			sendDate: sendDate ? new Date(sendDate) : new Date(),
			sent: false,
		});
		await newEmail.save();

		const emailId = (newEmail._id as mongoose.Types.ObjectId).toString();

		const delay = sendDate
			? Math.max(new Date(sendDate).getTime() - Date.now(), 0)
			: 0;

		await emailQueue.add(
			"send-course-email", // match worker's processor name too
			{ emailId },
			{
				delay,
				jobId: emailId, // this ensures you can later retrieve/remove it
			}
		);

		console.log("added to queue");

		res.status(200).json(newEmail);
	} catch (error) {
		console.error(error);
		res
			.status(400)
			.json({ message: "Error creating and queuing email", error });
	}
};

// @desc    Update an email
// @route   PUT /api/email/:id
// @access  Public
export const updateEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params; // Get the ID from the request parameters
	const { subject, body, courseId, sendDate } = req.body;
	try {
		const updatedEmail = await Email.findByIdAndUpdate(
			id,
			{
				subject,
				body,
				course: courseId,
				sendDate,
				wasSent: false,
			},
			{ new: true }
		);

		if (!updatedEmail) {
			res.status(404).json({ message: "Email not found" });
		}

		// Remove old job
		const existingJob = await emailQueue.getJob(id);
		if (existingJob) {
			await existingJob.remove();
		}

		// Re-schedule job
		const delay = new Date(sendDate).getTime() - Date.now();

		await emailQueue.add(
			"send-course-email",
			{ emailId: id },
			{
				jobId: id,
				delay: Math.max(delay, 0),
			}
		);

		res.status(200).json(updatedEmail);
	} catch (error) {
		res.status(500);
	}
};

// @desc    Delete an email
// @route   DELETE /api/email/:id
// @access  Public
export const deleteEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params; // Get the ID from the request parameters
	try {
		const deletedEmail = await Email.findByIdAndDelete(id);
		if (!deletedEmail) {
			res.status(404).json({ message: "Email not found" });
		}

		const existingJob = await emailQueue.getJob(id);
		if (existingJob) {
			await existingJob.remove();
		}

		res.status(204).send(); // Send a 204 No Content response
	} catch (error) {
		res.status(500);
	}
};
