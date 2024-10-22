import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRating extends Document {
  id: string;
  userId: string;
  rating: number;
}

const ratingSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true }
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Define pre/post hooks or custom methods if necessary (optional)
// ratingSchema.pre('save', function (next) {
//   // Custom logic before saving the document
//   next();
// });

const Rating: Model<IRating> = mongoose.model<IRating>(
  "Rating",
  ratingSchema
);

export default Rating;
