import mongoose, { Schema, Document, Model } from "mongoose";
import { IQuestion } from "./questionModel";

// Define an interface for the document
export interface ISurvey extends Document {
	// Define fields here:
	questions: IQuestion[];
}

// Define the schema with placeholders for fields (others will fill this in)
const surveySchema: Schema = new Schema(
	{
		// Define fields here:
		questions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Question",
				required: true,
			},
		],
	},
	{
		timestamps: true, // Enable automatic createdAt and updatedAt fields
	}
);

// Export the model
const Survey: Model<ISurvey> = mongoose.model<ISurvey>("Survey", surveySchema);

export default Survey;
