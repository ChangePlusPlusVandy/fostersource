import mongoose, { Schema, Document, Model, mongo } from "mongoose";
import QuestionResponse, { IQuestionResponse } from "./questionResponseModel";
import { CallbackError } from "mongoose";

export interface ISurveyResponse extends Document {
  userId: string;
  dateCompleted: Date;
  answers: IQuestionResponse[];
}

const surveyResponseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    dateCompleted: { type: Date, required: true },
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

surveyResponseSchema.pre("findOneAndDelete", async function (next) {
  const surveyResponse = await this.model.findOne(this.getQuery());

  if (surveyResponse) {
    try {
      await QuestionResponse.deleteMany({
        _id: { $in: surveyResponse.answers.map((answer: any) => answer._id) },
      });
      next();
    } catch (err) {
      next(err as CallbackError);
    }
  } else {
    next();
  }
});

const SurveyResponse: Model<ISurveyResponse> = mongoose.model<ISurveyResponse>(
  "SurveyResponse",
  surveyResponseSchema
);

export default SurveyResponse;
