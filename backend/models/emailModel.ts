import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmailTemplate extends Document {
  title: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const emailTemplateSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const EmailTemplate: Model<IEmailTemplate> = mongoose.model<IEmailTemplate>("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;