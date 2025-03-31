// utils/cloudinaryStorage.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import { Request } from "express";
import { Options } from "multer-storage-cloudinary";

console.log("cloundaryStorage");

// Explicit type to override the broken one
interface CustomParams {
	folder: string;
	allowed_formats: string[];
}

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (
		req: Request,
		file: Express.Multer.File
	): Promise<CustomParams> => {
		return {
			folder: "assets",
			allowed_formats: ["jpg", "jpeg", "png", "webp"],
		};
	},
});

export default storage;
