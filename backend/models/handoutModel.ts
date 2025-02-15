import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHandout extends Document {
    courseId: string;
    fileUrl: string;
    fileType: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  const handoutSchema: Schema = new Schema(
    {
        courseId: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
    },
    {
        timestamps: true,
    }
  );

const Handout: Model<IHandout> = mongoose.model<IHandout>("Handout", handoutSchema);

export default Handout;