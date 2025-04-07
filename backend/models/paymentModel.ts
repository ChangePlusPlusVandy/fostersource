import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./userModel";
import { ICourse } from "./courseModel";

export interface IPayment extends Document {
	userId: mongoose.Types.ObjectId;
	date: Date;
	amount: number;
	memo: string;
	courses: mongoose.Types.ObjectId[];
	transactionId: string;
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
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
				required: true,
			},
		],
		transactionId: { type: String, required: true },
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
