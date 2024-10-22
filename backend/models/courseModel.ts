import mongoose, { Schema, Document, Model } from "mongoose";

export interface Rating {
  ratingId: string; 
  userId: string; 
  rating: number; 
}

export interface Course extends Document {
  id: string; 
  handouts: File[]; 
  ratings: Rating[];
  className: string; 
  discussion: string;
  components: Object[];  
}

const CourseSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    handouts: [
      {type: File, required: false }
    ],
    ratings: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Rating"
      }
    ],
    className: { type: String, required: true },
    discussion: { type: String, required: true },
    components: [
      {type: Schema.Types.Mixed, required: true }
    ]
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const Course: Model<Course> = mongoose.model<Course>(
  "Course",
  CourseSchema
);

export default Course;
