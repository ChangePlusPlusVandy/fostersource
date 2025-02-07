import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInstructor extends Document {
	name: string;
	title: string;
	email: string;
	company: string;
	bio: string;
	disclosures?: string;
	image: Object;
}

const InstructorSchema: Schema = new Schema(
	{
		name: [{ type: String, required: true }],
        title: [{ type: String, required: true }],
        email: [{ type: String, required: true }],
        company: [{ type: String, required: true }],
        bio: [{ type: String, required: true }],
        disclosures: [{ type: String, required: false }],
        image: [{ type: Object, required: true }],
	},
	{
		timestamps: true,
	}
);

const Instructor: Model<IInstructor> = mongoose.model<IInstructor>("Instructor", InstructorSchema);

export default Instructor;
