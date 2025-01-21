import mongoose, { Schema, Document, Model } from "mongoose";
import Course from "./courseModel";

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: {
    type: mongoose.Types.ObjectId; 
    ref: "Course";
  };
  rating: number;
}

const ratingSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
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

// Middleware to automatically add rating to course's rratings array after saving
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

// Middleware to automatically remove the rating from the course's ratings array
ratingSchema.post("deleteOne", async function (doc) {
  try {
    // Remove the rating reference from the course's ratings array
    await Course.updateMany(
      { ratings: doc._id }, // Find courses that have this rating in their ratings array
      { $pull: { ratings: doc._id } } // Remove the rating from the ratings array
    );
  } catch (error) {
    console.error("Failed to remove rating from course:", error);
  }
});

const Rating: Model<IRating> = mongoose.model<IRating>(
  "Rating",
  ratingSchema
);

export default Rating;
