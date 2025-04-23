import { Request, Response } from "express";
import CourseCategory from "../models/courseCategoryModel";

// @desc    Get global selected categories
// @route   GET /api/courseCategories
// @access  Public
export const getCourseCategories = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const categories = await CourseCategory.find();

		if (!categories) {
			res.status(200).json({
				success: true,
				data: [],
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: categories,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Create a new category
// @route   POST /api/courseCategories
// @access  Public
export const createCourseCategory = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { category } = req.body;

		if (!category) {
			res.status(400).json({
				success: false,
				message: "Please provide a nonempty category name",
			});
			return;
		}

		const newCategory = new CourseCategory({
			category,
		});

		const savedCategory = await newCategory.save();

		res.status(201).json({
			success: true,
			data: savedCategory,
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

// @desc    Delete a category
// @route   DELETE /api/courseCategories/:id
// @access  Public
export const deleteCourseCategory = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;

	try {
		const deletedCategory = await CourseCategory.findOneAndDelete({ _id: id });

		if (!deletedCategory) {
			res.status(404).json({ message: "Category not found." });
			return;
		}

		res.status(204).send(); // No content
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "An unknown error occurred." });
		}
	}
};

// // @desc    Update global selected categories
// // @route   PUT /api/settings/selectedCategories
// // @access  Admin (ideally)
// // This will either update the existing settings doc or create one if it doesn't exist
// export const updateSelectedCategories = async (
// 	req: Request,
// 	res: Response
// ): Promise<void> => {
// 	try {
// 		const { selectedCategories } = req.body;

// 		if (!Array.isArray(selectedCategories)) {
// 			res.status(400).json({
// 				success: false,
// 				message: "selectedCategories must be an array of strings.",
// 			});
// 			return;
// 		}

// 		const settings = await GlobalSettings.findOneAndUpdate(
// 			{},
// 			{ selectedCategories },
// 			{ new: true, upsert: true }
// 		);

// 		res.status(200).json({
// 			success: true,
// 			data: settings.selectedCategories,
// 			message: "Selected categories updated.",
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal service error.",
// 		});
// 	}
// };
