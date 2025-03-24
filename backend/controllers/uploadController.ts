import { Request, Response } from "express";

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload/image
// @access  Public
export const uploadImage = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		console.log("Uploaded file:", req.file);

		if (!req.file) {
			res.status(400).json({ message: "No file uploaded" });
			return;
		}

		// @ts-ignore: Cloudinary adds 'path' property to the file object
		const imageUrl = req.file.path;

		res.status(200).json({
			imageUrl,
			message: "Image uploaded successfully",
		});
	} catch (error) {
		res.status(500).json({
			message:
				error instanceof Error ? error.message : "An unknown error occurred",
		});
	}
};
