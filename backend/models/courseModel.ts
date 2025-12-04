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
	students: (mongoose.Types.ObjectId | IUser)[]; //for the users
	managers: (mongoose.Types.ObjectId | IUser)[];
	speakers: (mongoose.Types.ObjectId | ISpeaker)[];
	regStart: Date;
	regEnd: Date;
	//Virtual Training - Live Meeting, In-Person Training, Virtual Training - On Demand, Virtual Training - Live Webinar
	productType:
		| "Virtual Training - Live Meeting"
		| "In-Person Training"
		| "Virtual Training - On Demand"
		| "Virtual Training - Live Webinar";
	productInfo: string;
	shortUrl: string;
	draft: boolean;
	registrationLimit: number;
	waitlist: { user: mongoose.Types.ObjectId | IUser; joinedAt: Date }[];
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
		className: { type: String, required: false },
		discussion: { type: String, required: false },
		categories: [{ type: String, required: false }],
		creditNumber: { type: Number, required: false },
		courseDescription: { type: String, required: false },
		thumbnailPath: { type: String, required: false },
		bannerPath: { type: String, required: false },
		cost: { type: Number, required: false },
		instructorDescription: { type: String, required: false },
		instructorRole: { type: String, required: false },
		time: { type: Date, required: false },
		instructorName: { type: String, required: false },
		isInPerson: { type: Boolean, required: false },
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
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
		productType: {
			type: String,
			required: false,
			enum: [
				"Virtual Training - Live Meeting",
				"In-Person Training",
				"Virtual Training - On Demand",
				"Virtual Training - Live Webinar",
				"",
			],
		},
		productInfo: { type: String, required: false },
		shortUrl: { type: String, required: false },
		draft: { type: Boolean, required: true, default: true },
		registrationLimit: { type: Number, required: false, default: 0 },
		waitlist: [
			{
				user: { type: Schema.Types.ObjectId, ref: "User", required: true },
				joinedAt: { type: Date, required: true, default: Date.now },
				_id: false,
			},
		],
	},
	{
		timestamps: true,
	}
);

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
