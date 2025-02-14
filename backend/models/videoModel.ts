import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVideo extends Document {
	title: string;
	description: string;
	videoUrl: string;
	courseId: mongoose.Types.ObjectId;
	published: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const videoSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		videoUrl: { type: String, required: true },
		courseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		published: { type: Boolean, required: true },
	},
	{
		timestamps: true,
	}
);

const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);

export default Video;
