import mongoose, { Schema, Document, Model } from "mongoose";
import { ICourse } from "./courseModel";

export interface ICourseCategory extends Document {
	category: string;
}

const CourseCategorySchema: Schema = new Schema(
	{
		category: {
			type: String,
		},
	},
	{ timestamps: true }
);

const CourseCategory: Model<ICourseCategory> = mongoose.model<ICourseCategory>(
	"CourseCategory",
	CourseCategorySchema
);

export default CourseCategory;
