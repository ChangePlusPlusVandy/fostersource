import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmail extends Document {
  title: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const emailSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const EmailTemplate: Model<IEmail> = mongoose.model<IEmail>("Email", emailSchema);

export default EmailTemplate;