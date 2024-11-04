import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRating extends Document {
  userId: string;
  rating: number;
}

const ratingSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    rating: { type: Number, required: true }
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const Rating: Model<IRating> = mongoose.model<IRating>(
  "Rating",
  ratingSchema
);

export default Rating;
