import mongoose, { Schema, Document, Model } from "mongoose";
import { IProgress } from "./progressModel";
import { IPayment } from "./paymentModel";

export interface IUser extends Document {
	firebaseId: string;
	email: string;
	isColorado: boolean;
	role:
		| "foster parent"
		| "certified kin"
		| "non-certified kin"
		| "staff"
		| "casa"
		| "teacher"
		| "county/cpa worker"
		| "speaker"
		| "former parent"
		| "caregiver";
	// TODO: update after user types can be created in admin
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
			type: String,
			required: true,
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
		language: { type: String, enum: ["English", "Spanish"], default: "English" },
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
