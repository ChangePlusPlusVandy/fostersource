import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
    name: string;  
    courseTitle: string;  
    creditHours: number;  
    dateCompleted: Date;
}

const CertificateSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        courseTitle: { type: String, required: true },
        creditHours: { type: Number, required: true },
        dateCompleted: { type: Date, required: true },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const Certificate: Model<ICertificate> = mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate; 