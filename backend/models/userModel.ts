import mongoose, { Schema, Document, Model } from "mongoose";
import { IProgress } from "./progressModel";
import { IPayment } from "./paymentModel";
import { IUserType } from "./userTypeModel";

export interface IUser extends Document {
	firebaseId: string;
	email: string;
	isColorado: boolean;
	role: mongoose.Types.ObjectId | IUserType;
	name: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zip: string;
	certification: string;
	company: string;
	phone: string;
	language: "English" | "Spanish";
	progress: mongoose.Types.ObjectId | IProgress;
	payments: (mongoose.Types.ObjectId | IPayment)[];
	cart: string;
}

const userSchema: Schema = new Schema(
	{
		firebaseId: { type: String, required: true },
		email: { type: String, required: true },
		isColorado: { type: Boolean, required: true },
		role: {
			type: Schema.Types.ObjectId,
			ref: "UserType",
		},
		name: { type: String, required: true },
		address1: { type: String, required: true },
		address2: { type: String },
		city: { type: String, required: true },
		state: { type: String, required: true },
		zip: { type: String, required: true },
		certification: { type: String, required: true },
		company: { type: String, required: true },
		phone: { type: String, required: true },
		language: {
			type: String,
			enum: ["English", "Spanish"],
			default: "English",
		},
		progress: [
			{
				type: Schema.Types.ObjectId,
				ref: "Progress",
			},
		],
		payments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Payment",
			},
		],
		cart: { type: String, required: false, default: "[]" },
	},
	{
		timestamps: true,
	}
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
