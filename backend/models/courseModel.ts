import mongoose, { Schema, Document, Model } from "mongoose";
import { IRating } from "./ratingModel";

export interface ICourse extends Document {
  handouts: string[];
  ratings: IRating[];
  className: string;
  discussion: string;
  components: Object[];
}

const CourseSchema: Schema = new Schema(
  {
    handouts: [{ type: String, required: false }],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    className: { type: String, required: true },
    discussion: { type: String, required: false },
    components: [{ type: Schema.Types.Mixed, required: false }],
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
