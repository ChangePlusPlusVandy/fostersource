import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebaseAdmin";

export interface AuthenticatedRequest extends Request {
	user?: {
		uid: string;
		email?: string;
	};
}

export const verifyFirebaseAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			res.status(401).json({ message: "Unauthorized: No token provided" });
			return;
		}

		const decodedToken = await admin.auth().verifyIdToken(token);

		req.user = {
			uid: decodedToken.uid,
			email: decodedToken.email || "",
		};

		next();
	} catch (error) {
		console.error("Firebase Authentication Failed: ", error);
		res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
		return;
	}
};
