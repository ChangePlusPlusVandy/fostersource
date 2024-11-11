import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the document (you can replace "ModelName" with the actual model name)
export interface IVideo extends Document {
  // Define your model fields here, for example:
  // fieldName: string;
  // createdAt?: Date;  // Optional field
  title: string;
  description: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema with placeholders for fields (others will fill this in)
const videoSchema: Schema = new Schema(
  {
    // Define fields here, for example:
    // fieldName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    published: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

// Define pre/post hooks or custom methods if necessary (optional)
// modelNameSchema.pre('save', function (next) {
//   // Custom logic before saving the document
//   next();
// });

// Export the model (replace "ModelName" with the actual model name)
const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);

export default Video;