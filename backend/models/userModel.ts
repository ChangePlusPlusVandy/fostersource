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
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  certification: string;
  phone: string;
  progress: IProgress;
  payments: IPayment;
}

const userSchema: Schema = new Schema(
  {
    firebaseId: { type: String, required: true },
    email: { type: String, required: true },
    isColorado: { type: Boolean, required: true },
    role: {
      type: String,
      enum: [
        "foster parent",
        "certified kin",
        "non-certified kin",
        "staff",
        "casa",
        "teacher",
        "county/cpa worker",
        "speaker",
        "former parent",
        "caregiver",
      ],
      required: true,
    },
    name: { type: Boolean, required: true },
    address1: { type: Boolean, required: true },
    address2: { type: Boolean, required: true },
    city: { type: Boolean, required: true },
    state: { type: Boolean, required: true },
    zip: { type: Boolean, required: true },
    certification: { type: Boolean, required: true },
    phone: { type: Boolean, required: true },
    progress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Progress",
      },
    ],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
