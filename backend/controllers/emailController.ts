import { Request, Response } from "express";
import Progress, { IProgress } from "../models/progressModel";
import Email, { IEmail } from "../models/emailModel";
import { sendEmail } from "../config/sendgrid";
import User from "../models/userModel";
import Course from "../models/courseModel";

// @desc    Get all emails or filter by query parameters
// @route   GET /api/email
// @access  Public
export const getEmails = async (req: Request, res: Response): Promise<void> => {
	try {
		const emails = await Email.find(req.query).populate({
			path: "course",
			select: "className",
		});
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
// @route   POST /api/email/send-now
// @access  Public
export const createAndSendEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { subject, body, courseId } = req.body;
		const newEmail: IEmail = new Email({
			course: courseId,
			subject,
			body,
			sendDate: new Date(),
		});
		await newEmail.save();

		const fullCourse = await Course.findById(courseId).populate("students");
		if (
			!fullCourse ||
			!fullCourse.students ||
			fullCourse.students.length === 0
		) {
			res.status(404).json({ message: "No students found in this course" });
			return;
		}

		const recipients = await User.find({
			_id: { $in: fullCourse.students },
		});

		for (const recipient of recipients) {
			await sendEmail(recipient.email, newEmail.subject, newEmail.body, {
				name: recipient.name,
				course: fullCourse.className,
				email: recipient.email,
				link: `http://localhost:3000/courseDetails?courseId=${courseId}`,
			});
		}

		res.status(200).json({ message: "Emails sent successfully!" });
	} catch (error) {
		res.status(400).json({ message: "Error creating progress entry", error });
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
	try {
		const updatedEmail = await Email.findByIdAndUpdate(id, req.body, {
			new: true, // Return the updated document
			runValidators: true, // Run validation on the update
		});

		if (!updatedEmail) {
			res.status(404).json({ message: "Email not found" });
		}

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

		res.status(204).send(); // Send a 204 No Content response
	} catch (error) {
		res.status(500);
	}
};
