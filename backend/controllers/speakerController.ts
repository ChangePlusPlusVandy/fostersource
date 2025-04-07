import { Request, Response } from "express";
import Speaker from "../models/speakerModel";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../backend/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadSpeakerImage = upload.single("image");

// @desc    Get all speakers or filter by query parameters
// @route   GET /api/speakers
// @access  Public
export const getSpeakers = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = req.query;
    const speakers = await Speaker.find(filters);
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
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

    // Store image URL if an image is uploaded
    const imageUrl = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : null;

    const speaker = new Speaker({
      name,
      title,
      email,
      company,
      bio,
      disclosures: disclosures ? disclosures.split(",") : [],
      image: imageUrl,
    });

    await speaker.save();
    res.status(201).json({ speaker, message: "Speaker created successfully" });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
  }
};

// @desc    Update a speaker
// @route   PUT /api/speakers/:id
// @access  Public
export const updateSpeaker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: speakerId } = req.params;
    const updates = req.body;

    // If a new image is uploaded, store its URL
    if (req.file) {
		updates.image = `http://localhost:5001/uploads/${req.file.filename}`;
	}
	  

    const updatedSpeaker = await Speaker.findByIdAndUpdate(speakerId, updates, { new: true });

    if (!updatedSpeaker) {
      res.status(404).json({ message: "Speaker not found" });
      return;
    }

    res.status(200).json(updatedSpeaker);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
  }
};

// @desc    Delete a speaker
// @route   DELETE /api/speakers/:id
// @access  Public
export const deleteSpeaker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if speaker exists
    const speaker = await Speaker.findById(id);
    if (!speaker) {
      res.status(404).json({ success: false, message: "Speaker not found." });
      return;
    }

    // Delete the speaker
    await Speaker.deleteOne({ _id: id });

    res.status(200).json({ success: true, message: "Speaker deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
  }
};
