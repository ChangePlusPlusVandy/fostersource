import mongoose, { Document, Schema } from "mongoose";

// Interface for Progress (assuming it's already created elsewhere)
export interface IProgress {
  courseId: string;
  completed: boolean;
  progressPercentage: number;
  // Add more fields as necessary
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  progress: IProgress[]; // Array of Progress objects
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    // Progress field which stores an array of Progress objects
    progress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Progress", // Reference to the Progress model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
