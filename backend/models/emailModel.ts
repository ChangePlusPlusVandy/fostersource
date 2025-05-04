import mongoose, { Schema, Document, Model } from "mongoose";
import { ICourse } from "./courseModel";

// Define the interface for the document
export interface IEmail extends Document {
	course: mongoose.Types.ObjectId | ICourse;
	subject: string;
	body: string;
	sendDate: Date;
	sent: boolean;
	// templateVars: Record<string, any>;
}

// Define the schema
const emailSchema: Schema = new Schema(
	{
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		body: {
			type: String, // This stores HTML or template string like "<p>Hello {{name}}</p>"
			required: true,
		},
		sendDate: {
			type: Date,
			required: true,
		},
		sent: {
			type: Boolean,
			required: true,
			default: false,
		},
		// templateVars: {
		// 	type: Schema.Types.Mixed, // Allows flexibility for key-value pairs
		// 	default: {},
		// },
	},
	{
		timestamps: true,
	}
);

// Export the model
const Email: Model<IEmail> = mongoose.model<IEmail>("Email", emailSchema);

export default Email;
