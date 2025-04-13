import { Request, Response } from "express";
import GlobalSettings from "../models/courseModelsCategories"; // adjust the path as needed

// @desc    Get global selected categories
// @route   GET /api/settings/selectedCategories
// @access  Public
export const getSelectedCategories = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const settings = await GlobalSettings.findOne();

		if (!settings) {
			res.status(200).json({
				success: true,
				data: [],
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: settings.selectedCategories,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Update global selected categories
// @route   PUT /api/settings/selectedCategories
// @access  Admin (ideally)
// This will either update the existing settings doc or create one if it doesn't exist
export const updateSelectedCategories = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { selectedCategories } = req.body;

		if (!Array.isArray(selectedCategories)) {
			res.status(400).json({
				success: false,
				message: "selectedCategories must be an array of strings.",
			});
			return;
		}

		const settings = await GlobalSettings.findOneAndUpdate(
			{},
			{ selectedCategories },
			{ new: true, upsert: true }
		);

		res.status(200).json({
			success: true,
			data: settings.selectedCategories,
			message: "Selected categories updated.",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};
