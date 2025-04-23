import { Request, Response } from "express";
import EmailTemplate from "../models/emailTemplateModel";

// @desc    Get all emails
// @route   GET /api/emailTemplates
// @access  Public
export const getEmails = async (req: Request, res: Response): Promise<void> => {
	try {
		const { title } = req.query;

		let filters: any = {};
		if (title) {
			filters.title = { $regex: title, $options: "i" };
		}

		const emails = await EmailTemplate.find(filters);

		res.status(200).json({
			success: true,
			count: emails.length,
			data: emails,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Get single email
// @route   GET /api/emailTemplates/:id
// @access  Public
export const getEmailById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		const email = await EmailTemplate.findById(id);

		if (!email) {
			res.status(404).json({
				success: false,
				message: `Email with id ${id} not found`,
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: email,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Create a new email
// @route   POST /api/emailTemplates
// @access  Public
export const createEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { subject, body } = req.body;

		if (!subject || !body) {
			res.status(400).json({
				success: false,
				message: "Please provide title and body",
			});
			return;
		}

		const newEmail = new EmailTemplate({
			subject,
			body,
		});

		const savedEmail = await newEmail.save();

		res.status(201).json({
			success: true,
			data: savedEmail,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Update an email
// @route   PUT /api/emails/:id
// @access  Public
export const updateEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { subject, body } = req.body;

		const updatedEmail = await EmailTemplate.findByIdAndUpdate(
			id,
			{ subject, body },
			{ new: true, runValidators: true }
		);

		if (!updatedEmail) {
			res.status(404).json({
				success: false,
				message: `Email with id ${id} not found`,
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: updatedEmail,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};

// @desc    Delete an email
// @route   DELETE /api/emails/:id
// @access  Public
export const deleteEmail = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		const deletedEmail = await EmailTemplate.findByIdAndDelete(id);
		if (!deletedEmail) {
			res.status(404).json({
				success: false,
				message: `Email with id ${id} not found`,
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: deletedEmail,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				message: "Server Error",
				error: error.message,
			});
		} else {
			res.status(500).json({
				success: false,
				message: "An unexpected error occurred",
			});
		}
	}
};
