import mongoose, { Schema, Document, Model } from "mongoose";
import { IRating } from "./ratingModel";
import { IHandout } from "./handoutModel";
import { IUser } from "./userModel";
import { ISpeaker } from "./speakerModel";

export interface ICourse extends Document {
	handouts: (mongoose.Types.ObjectId | IHandout)[];
	ratings: (mongoose.Types.ObjectId | IRating)[];
	className: string;
	discussion: string;
	components: (mongoose.Types.ObjectId | Object)[];
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	bannerPath: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	courseType: "webinar" | "course" | "meeting";
	lengthCourse: number;
	time: Date;
	isInPerson: boolean;
	type: "webinar" | "inPerson" | "onDemand";
	students: (mongoose.Types.ObjectId | IUser)[]; //for the users
	managers: (mongoose.Types.ObjectId | IUser)[];
	speakers: (mongoose.Types.ObjectId | ISpeaker)[];
	regStart: Date;
	regEnd: Date;
	productType: string[];
	shortUrl: string;
	draft: boolean;
}

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
		isLive: { type: Boolean, required: false },
		categories: [{ type: String, required: false }],
		creditNumber: { type: Number, required: false },
		courseDescription: { type: String, required: false },
		thumbnailPath: { type: String, required: false },
		bannerPath: { type: String, required: false },
		cost: { type: Number, required: false },
		instructorDescription: { type: String, required: false },
		instructorRole: { type: String, required: false },
		lengthCourse: { type: Number, required: false },
		time: { type: Date, required: false },
		instructorName: { type: String, required: false },
		isInPerson: { type: Boolean, required: false },
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
		type: {
			type: String,
			enum: ["webinar", "inPerson", "onDemand"],
			required: true,
		},
		managers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		speakers: [
			{
				type: Schema.Types.ObjectId,
				ref: "Speaker",
			},
		],
		regStart: { type: Date, required: false },
		regEnd: { type: Date, required: false },
		productType: [{ type: String, required: false }],
		shortUrl: { type: String, required: false },
		draft: { type: Boolean, required: true, default: true },
	},
	{
		timestamps: true,
	}
);

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
