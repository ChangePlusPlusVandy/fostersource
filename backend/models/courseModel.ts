import mongoose, { Schema, Document, Model } from "mongoose";
import { IRating } from "./ratingModel";

export interface ICourse extends Document {
	handouts: string[];
	ratings: IRating[];
	className: string;
	discussion: string;
	components: Object[];
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	description: string;
	thumbnailPath: string;
	cost: number;
	instructor: string;
	courseType: "webinar" | "course" | "meeting";
}

const CourseSchema: Schema = new Schema(
	{
		handouts: [{ type: String, required: false }],
		ratings: [
			{
				type: Schema.Types.ObjectId,
				ref: "Rating",
			},
		],
		className: { type: String, required: true },
		discussion: { type: String, required: false },
		components: [{ type: Schema.Types.Mixed, required: false }],
		isLive: { type: Boolean, required: true },
		categories: [{ type: String, required: false }],
		creditNumber: { type: Number, required: true },
		description: { type: String, required: true },
		thumbnailPath: { type: String, required: true },
		cost: { type: Number, required: true },
		instructor: { type: String, required: false },
		courseType: {
			type: String,
			enum: ["webinar", "course", "meeting"],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
