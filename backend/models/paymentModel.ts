import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  userId: string;
  date: Date;
  amount: number;
  memo: string;
}

const paymentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    memo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> = mongoose.model<IPayment>(
  "Payment",
  paymentSchema
);

export default Payment;
