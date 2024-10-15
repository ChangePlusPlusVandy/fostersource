import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the document
export interface ISurvey extends Document {
  // Define fields here:
  id: string;
  question: Question[];
}

// Define the schema with placeholders for fields (others will fill this in)
const surveySchema: Schema = new Schema(
  {
    // Define fields here:
    id: { type: String, required: true },
    question: { type: Question[], required: true },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Export the model 
const Survey: Model<ISurvey> = mongoose.model<ISurvey>(
  "Survey",
  surveySchema
);

export default Survey;
