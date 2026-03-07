import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebaseAdmin";
import crypto from "crypto";
import ImpersonationSession from "../models/impersonationSessionModel";

export interface AuthenticatedRequest extends Request {
	user?: {
		uid: string;
		email?: string;
		actorUid?: string;
		isImpersonating?: boolean;
		impersonationReason?: string;
	};
}

export const verifyFirebaseAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		const impersonationTokenHeader = req.headers["x-impersonation-token"];

		if (!token) {
			res.status(401).json({ message: "Unauthorized: No token provided" });
			return;
		}

		const decodedToken = await admin.auth().verifyIdToken(token);

		let effectiveUid = decodedToken.uid;
		let actorUid: string | undefined;
		let isImpersonating = false;
		let impersonationReason: string | undefined;

		const impersonationToken =
			typeof impersonationTokenHeader === "string"
				? impersonationTokenHeader
				: Array.isArray(impersonationTokenHeader)
					? impersonationTokenHeader[0]
					: undefined;

		if (impersonationToken) {
			const tokenHash = crypto
				.createHash("sha256")
				.update(impersonationToken)
				.digest("hex");

			const session = await ImpersonationSession.findOne({
				tokenHash,
				active: true,
				expiresAt: { $gt: new Date() },
			});

			if (session) {
				if (session.actorUid !== decodedToken.uid) {
					res.status(403).json({
						message:
							"Forbidden: impersonation token does not match authenticated actor",
					});
					return;
				}

				effectiveUid = session.targetUid;
				actorUid = session.actorUid;
				isImpersonating = true;
				impersonationReason = session.reason;
			} else {
				res.status(401).json({
					message: "Unauthorized: Invalid or expired impersonation token",
				});
				return;
			}
		}

		req.user = {
			uid: effectiveUid,
			email: decodedToken.email || "",
			actorUid,
			isImpersonating,
			impersonationReason,
		};

		next();
	} catch (error) {
		console.error("Firebase Authentication Failed: ", error);
		res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
		return;
	}
};
