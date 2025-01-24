import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./userModel";

export interface IPayment extends Document {
	userId: mongoose.Types.ObjectId;
	date: Date;
	amount: number;
	memo: string;
}

const paymentSchema: Schema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: { type: Date, required: true },
		amount: { type: Number, required: true },
		memo: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

// Middleware to automatically add payment to user's payments array after saving
paymentSchema.post("save", async function (doc) {
	if (doc.userId) {
		try {
			await User.findByIdAndUpdate(doc.userId, {
				$push: { payments: doc._id },
			});
		} catch (error) {
			console.error("Failed to update user's payments array:", error);
		}
	}
});

const Payment: Model<IPayment> = mongoose.model<IPayment>(
	"Payment",
	paymentSchema
);

export default Payment;
