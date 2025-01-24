import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the document (you can replace "ModelName" with the actual model name)
export interface IQuestion extends Document {
	question: string;
	isMCQ: boolean;
	answers?: string[];
}

// Define the schema with placeholders for fields (others will fill this in)
const QuestionSchema: Schema = new Schema(
	{
		question: { type: String, required: true },
		isMCQ: { type: Boolean, required: true },
		answers: [{ type: String }],
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

const Question: Model<IQuestion> = mongoose.model<IQuestion>(
	"Question",
	QuestionSchema
);

export default Question;
