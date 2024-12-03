import mongoose, { Schema, Document, Model } from "mongoose";
import Course from "./courseModel";

export interface IRating extends Document {
  userId: string;
  courseId: {
    type: mongoose.Types.ObjectId; 
    ref: "Course";
  };
  rating: number;
}

const ratingSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { 
      type: mongoose.Types.ObjectId, 
      ref: "Course",
      required: true,
    },
    rating: { type: Number, required: true }
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Middleware to automatically add payment to user's payments array after saving
ratingSchema.post("save", async function (doc) {
  if (doc.courseId) {
    try {
      await Course.findByIdAndUpdate(doc.courseId, {
        $push: { ratings: doc._id },
      });
    } catch (error) {
      console.error("Failed to update course's ratings array:", error);
    }
  }
});


const Rating: Model<IRating> = mongoose.model<IRating>(
  "Rating",
  ratingSchema
);

export default Rating;
