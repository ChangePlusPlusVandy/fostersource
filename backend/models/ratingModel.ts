import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the document (you can replace "ModelName" with the actual model name)
export interface IModelName extends Document {
  // Define your model fields here, for example:
  // fieldName: string;
  // createdAt?: Date;  // Optional field
}

// Define the schema with placeholders for fields (others will fill this in)
const modelNameSchema: Schema = new Schema(
  {
    // Define fields here, for example:
    // fieldName: { type: String, required: true },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

// Define pre/post hooks or custom methods if necessary (optional)
// modelNameSchema.pre('save', function (next) {
//   // Custom logic before saving the document
//   next();
// });

// Export the model (replace "ModelName" with the actual model name)
const ModelName: Model<IModelName> = mongoose.model<IModelName>(
  "ModelName",
  modelNameSchema
);

export default ModelName;
