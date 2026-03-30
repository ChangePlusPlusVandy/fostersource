import mongoose, { Schema, Document, Model } from "mongoose";
import { IQuestion } from "./questionModel";

// Define an interface for the document
export interface ISurvey extends Document {
	// Define fields here:
	id: string;
	name: string;
	questions: mongoose.Types.ObjectId[];
	courseIds: mongoose.Types.ObjectId[];
	version: number;
	parentSurveyId: mongoose.Types.ObjectId | null;
	isActive: boolean;
}

// Define the schema with placeholders for fields (others will fill this in)
const surveySchema: Schema = new Schema(
	{
		// Define fields here:
		name: {type: String, required: true},
		courseIds: [{type: Schema.Types.ObjectId, ref: "Course"}],
		version: {type: Number, default: 1},
		parentSurveyId: {type: Schema.Types.ObjectId, ref: "Survey", default: null},
		isActive: {type: Boolean, default: true}, 
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
