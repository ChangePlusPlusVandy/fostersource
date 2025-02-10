import { Request, Response } from "express";
import Webinar from "../models/webinarModel";

// @desc    Get all webinars or by filter
// @route   GET /api/webinars
// @access  Public
export const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const filters = req.query; 

		const webinars = await Webinar.find(filters); 
		res.status(200).json({
			success: true,
			count: webinars.length,
			data: webinars,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Get or create a webinar
// @route   POST /api/webinars
// @access  Public
export const getOrCreateWebinar = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			serviceType, 
            meetingID, 
            startTime, 
            duration, 
            authParticipants, 
            autoRecord, 
            enablePractice,
		} = req.body;

		let webinar = await Webinar.findOne({ meetingID });

		if (webinar) {
			res.status(200).json({ webinar, message: "Webinar already exists" });
			return;
		}

		const newWebinar = new Webinar({
			serviceType, 
            meetingID, 
            startTime, 
            duration, 
            authParticipants, 
            autoRecord, 
            enablePractice,
		});

		const savedWebinar = await newWebinar.save();
		res
			.status(201)
			.json({ user: savedWebinar, message: "Webinar created successfully" });
	} catch (error) {
		res.status(400).json({ message: "Failed to get or create webinar", error });
	}
};

// @desc    Update a webinar
// @route   PUT /api/webinars/:id
// @access  Public
export const updateUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updatedWebinar = await Webinar.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!updatedWebinar) {
			res.status(404).json({ message: "Webinar not found" });
			return;
		}

		res.status(200).json(updatedWebinar);
	} catch (error) {
		res.status(400).json({ message: "Failed to update webinar", error });
	}
};

// @desc    Delete a webinar
// @route   DELETE /api/webinars/:id
// @access  Public
export const deleteUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		const webinar = await Webinar.findById(id);

		if (!webinar) {
			res.status(404).json({
				success: false,
				message: "User not found.",
			});
			return;
		}

		await Webinar.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message:
				"Webinar deleted successfully.",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error.",
		});
	}
};
