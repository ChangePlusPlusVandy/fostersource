import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the document (you can replace "ModelName" with the actual model name)
export interface IProgress extends Document {
  user: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
  };
  class: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "Course";
  };
  isComplete: Boolean;
  completedComponents: any;
  dateCompleted: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema with placeholders for fields (others will fill this in)
const progressSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    completedComponents: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    dateCompleted: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Export the model (replace "ModelName" with the actual model name)
const Progress: Model<IProgress> = mongoose.model<IProgress>(
  "Progress",
  progressSchema
);

export default Progress;
