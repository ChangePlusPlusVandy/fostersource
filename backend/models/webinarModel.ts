import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebinar extends Document {
	serviceType: string;
	meetingID: string;
	startTime: Date;
	duration: number;
	authParticipants: boolean;
	autoRecord: boolean;
	enablePractice: boolean;
}

const webinarSchema: Schema = new Schema({
	serviceType: { type: String, required: true },
	meetingID: { type: String, required: true },
	startTime: { type: Date, required: true },
	duration: { type: Number, required: true },
	authParticipants: { type: Boolean, default: false },
	autoRecord: { type: Boolean, default: false },
	enablePractice: { type: Boolean, default: false },
});

const Webinar: Model<IWebinar> = mongoose.model<IWebinar>(
	"Webinar",
	webinarSchema
);

export default Webinar;
