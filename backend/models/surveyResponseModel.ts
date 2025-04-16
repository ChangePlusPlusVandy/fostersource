import mongoose, { Schema, Document, Model, mongo } from "mongoose";
import QuestionResponse, { IQuestionResponse } from "./questionResponseModel";

export interface ISurveyResponse extends Document {
	userId: string;
	answers: (mongoose.Types.ObjectId | IQuestionResponse)[];
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
