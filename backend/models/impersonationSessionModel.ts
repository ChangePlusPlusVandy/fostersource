import mongoose, { Document, Model, Schema } from "mongoose";

export interface IImpersonationSession extends Document {
	actorUid: string;
	targetUid: string;
	tokenHash: string;
	reason?: string;
	startedAt: Date;
	expiresAt: Date;
	active: boolean;
	stoppedAt?: Date;
}

const impersonationSessionSchema: Schema = new Schema(
	{
		actorUid: { type: String, required: true, index: true },
		targetUid: { type: String, required: true, index: true },
		tokenHash: { type: String, required: true, unique: true, index: true },
		reason: { type: String, trim: true },
		startedAt: { type: Date, required: true, default: Date.now },
		expiresAt: { type: Date, required: true },
		active: { type: Boolean, required: true, default: true, index: true },
		stoppedAt: { type: Date },
	},
	{
		timestamps: true,
	}
);

impersonationSessionSchema.index(
	{ expiresAt: 1 },
	{ expireAfterSeconds: 0, name: "impersonation_expires_ttl" }
);

const ImpersonationSession: Model<IImpersonationSession> =
	mongoose.model<IImpersonationSession>(
		"ImpersonationSession",
		impersonationSessionSchema
	);

export default ImpersonationSession;
