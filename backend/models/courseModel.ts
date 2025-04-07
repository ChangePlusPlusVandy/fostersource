import mongoose, { Schema, Document, Model } from "mongoose";
import { IRating } from "./ratingModel";
import { IHandout } from "./handoutModel";

// export interface IHandout {
// 	title: string;
// 	file: string;
// }

export interface ICourse extends Document {
	handouts: IHandout[];
	ratings: IRating[];
	className: string;
	discussion: string;
	components: Object[];
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	courseType: "webinar" | "course" | "meeting";
	lengthCourse: number;
	time: Date;
	isInPerson: boolean;
	students: mongoose.Types.ObjectId[]; //for the users
	managers: mongoose.Types.ObjectId[];
	regStart: Date;
	regEnd: Date;
	productType: string[];
}

// const HandoutSchema = new Schema(
//     {
//         title: { type: String, required: true },
//         file: { type: String, required: true }
//     },
//     { _id: false }
// );

const CourseSchema: Schema = new Schema(
	{
		handouts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Handout",
			},
		],
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
		courseDescription: { type: String, required: true },
		thumbnailPath: { type: String, required: false },
		cost: { type: Number, required: true },
		instructorDescription: { type: String, required: false },
		instructorRole: { type: String, required: false },
		lengthCourse: { type: Number, required: true },
		time: { type: Date, required: true },
		instructorName: { type: String, required: true },
		isInPerson: { type: Boolean, required: true },
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		courseType: {
			type: String,
			enum: ["webinar", "course", "meeting"],
			required: true,
		},
		managers: [
			{
			  type: Schema.Types.ObjectId,
			  ref: "User",
			},
		],
		regStart: { type: Date, required: true },
		regEnd: { type: Date, required: false },
		productType: [{ type: String, required: false }],
	},
	{
		timestamps: true,
	}
);

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
