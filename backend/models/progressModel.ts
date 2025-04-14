import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./userModel";

// Define an interface for the document (you can replace "ModelName" with the actual model name)
export interface IProgress extends Document {
	user: {
		type: mongoose.Schema.Types.ObjectId;
		ref: "User";
	};
	course: {
		type: mongoose.Schema.Types.ObjectId;
		ref: "Course";
	};
	isComplete: Boolean;
	completedComponents: any;
	dateCompleted: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Define the schema with placeholders for fields (others will fill this in)
const progressSchema: Schema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		isComplete: {
			type: Boolean,
			default: false,
		},
		completedComponents: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
		dateCompleted: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true, // Enable automatic createdAt and updatedAt fields
	}
);

// Middleware to automatically add payment to user's progress array after saving
progressSchema.post("save", async function (doc) {
	if (doc.user) {
		try {
			await User.findByIdAndUpdate(doc.user, {
				$addToSet: { progress: doc._id },
			});
		} catch (error) {
			console.error("Failed to update user's progress array:", error);
		}
	}
});

// Export the model (replace "ModelName" with the actual model name)
const Progress: Model<IProgress> = mongoose.model<IProgress>(
	"Progress",
	progressSchema
);

export default Progress;
