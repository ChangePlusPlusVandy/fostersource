import { Request, Response } from "express";
import Speaker from "../models/speakerModel";
import multer from "multer";


// @desc    Get all speakers or filter by query parameters
// @route   GET /api/speakers
// @access  Public
export const getSpeakers = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const filters = req.query;
		const speakers = await Speaker.find(filters);

		res.status(200).json(speakers);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};

// @desc    Create a new speaker
// @route   POST /api/speakers
// @access  Public
export const createSpeaker = async (req: Request, res: Response): Promise<void> => {
	try {
	  console.log("Request body:", req.body);
	  console.log("Request file:", req.file);
  
	  const { name, title, email, company, bio, disclosures } = req.body;
	  
	  // Create new speaker
	  const speaker = new Speaker({
		name,
		title,
		email,
		company,
		bio,
		disclosures: disclosures || '',
		image: req.file ? req.file.path : null,
	  });
	  
	  await speaker.save();
  
	  res.status(201).json({
		speaker,
		message: "Speaker created successfully",
	  });
	} catch (error) {
	  if (error instanceof Error) {
		res.status(500).json({ message: error.message });
	  } else {
		res.status(500).json({ message: "An unknown error occurred" });
	  }
	}
  };

// @desc    Update a speaker
// @route   PUT /api/speakers/:id
// @access  Public
export const updateSpeaker = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id: speakerId } = req.params;
		const updates = req.body;

		const updatedSpeaker = await Speaker.findByIdAndUpdate(
			speakerId,
			updates,
			{ new: true } // Returns the updated document
		);

		if (!updatedSpeaker) {
			res.status(404).json({ message: "Speaker not found" });
			return;
		}

		res.status(200).json(updatedSpeaker);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};

// @desc    Delete a speaker
// @route   DELETE /api/speakers/:id
// @access  Public
export const deleteSpeaker = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;

		// Check if speaker exists
		const speaker = await Speaker.findById(id);
		if (!speaker) {
			res.status(404).json({
				success: false,
				message: "Speaker not found.",
			});
			return;
		}

		// Delete the speaker
		await Speaker.deleteOne({ _id: id });

		res.status(200).json({
			success: true,
			message: "Speaker deleted successfully.",
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred" });
		}
	}
};
