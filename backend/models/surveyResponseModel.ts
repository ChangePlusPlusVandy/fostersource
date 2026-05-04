import mongoose, { Schema, Document, Model, mongo } from "mongoose";
import QuestionResponse, { IQuestionResponse } from "./questionResponseModel";

export interface ISurveyResponse extends Document {
	userId: string;
	answers: (mongoose.Types.ObjectId | IQuestionResponse)[];
	surveyId: mongoose.Types.ObjectId;
	courseId: mongoose.Types.ObjectId;
	phase: "pre" | "post";
}

const surveyResponseSchema: Schema = new Schema(
	{
		userId: { type: String, required: true },
		answers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "QuestionResponse",
			},
		],
		surveyId: { type: Schema.Types.ObjectId, ref: "Survey"},
		courseId: { type: Schema.Types.ObjectId, ref: "Course"},
		phase: { type: String, enum: ["pre", "post"], required: true, default: "post" },
	},
	{
		timestamps: true,
	}
);

const SurveyResponse: Model<ISurveyResponse> = mongoose.model<ISurveyResponse>(
	"SurveyResponse",
	surveyResponseSchema
);

export default SurveyResponse;
