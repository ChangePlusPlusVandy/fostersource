import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the document (you can replace "ModelName" with the actual model name)
export interface IQuestionResponse extends Document {
	userId: string;
	questionId: string;
	answer: string;
}

// Define the schema with placeholders for fields (others will fill this in)
const QuestionResponseSchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		questionId: { type: Schema.Types.ObjectId, ref: "Question" },
		answer: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);
// Define pre/post hooks or custom methods if necessary (optional)
// modelNameSchema.pre('save', function (next) {
//   // Custom logic before saving the document
//   next();
// });

// Export the model (replace "ModelName" with the actual model name)
const QuestionResponse: Model<IQuestionResponse> =
	mongoose.model<IQuestionResponse>("QuestionResponse", QuestionResponseSchema);

export default QuestionResponse;
