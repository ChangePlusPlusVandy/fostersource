// backend/models/userTypeModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserType extends Document {
	name: string;
	cost: number;
}

const userTypeSchema: Schema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		cost: { type: Number, required: true },
	},
	{ timestamps: true }
);

const UserType: Model<IUserType> = mongoose.model<IUserType>(
	"UserType",
	userTypeSchema
);
export default UserType;
