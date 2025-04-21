// backend/models/userTypeModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserType extends Document {
  name: string;
}

const userTypeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const UserType: Model<IUserType> = mongoose.model<IUserType>("UserType", userTypeSchema);
export default UserType;