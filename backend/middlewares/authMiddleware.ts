// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import admin from "../firebase/firebaseAdmin";
// import User, { IUser } from "../models/userModel";

// export interface AuthenticatedRequest extends Request {
// 	user?: IUser;
// }

// interface JWTPayload {
// 	id: string;
// 	firebaseId: string;
// 	role: string;
// 	exp?: number;
// }

// export const verifyToken = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ): Promise<void> => {
// 	try {
// 		const token = req.headers.authorization?.split(" ")[1];
// 		const refreshToken = req.headers["refresh-token"] as string;

// 		console.log("Received Access Token:", token);
// 		console.log("Received Refresh Token:", refreshToken);

// 		if (!token) {
// 			throw new Error("No token provided");
// 		}

// 		try {
// 			const jwtPayload = jwt.verify(
// 				token,
// 				process.env.JWT_SECRET as string
// 			) as JWTPayload;
// 			await validateTokens(req, jwtPayload, refreshToken);
// 			next();
// 		} catch (error) {
// 			if (error instanceof jwt.TokenExpiredError && refreshToken) {
// 				try {
// 					const newTokens = await refreshAuthToken(refreshToken);
// 					res.setHeader("new-access-token", newTokens.accessToken);
// 					res.setHeader("new-refresh-token", newTokens.refreshToken);

// 					const jwtPayload = jwt.verify(
// 						newTokens.accessToken,
// 						process.env.JWT_SECRET as string
// 					) as JWTPayload;
// 					await validateTokens(req, jwtPayload, newTokens.refreshToken);
// 					next();
// 				} catch (refreshError) {
// 					throw new Error("Token refresh failed");
// 				}
// 			} else {
// 				throw error;
// 			}
// 		}
// 	} catch (error) {
// 		if (error instanceof jwt.TokenExpiredError) {
// 			res.status(401).json({ message: "Token expired" });
// 		} else if (error instanceof jwt.JsonWebTokenError) {
// 			res.status(401).json({ message: "Invalid token" });
// 		} else {
// 			res
// 				.status(403)
// 				.json({ message: (error as Error).message || "Authentication failed" });
// 		}
// 	}
// };

// async function validateTokens(
// 	req: Request,
// 	jwtPayload: JWTPayload,
// 	firebaseToken: string
// ) {
// 	try {
// 		console.log("🔎 Verifying Firebase ID Token...");
// 		const decodedFirebaseToken = await admin
// 			.auth()
// 			.verifyIdToken(firebaseToken);
// 		console.log("✅ Firebase Token Verified:", decodedFirebaseToken);

// 		if (jwtPayload.firebaseId !== decodedFirebaseToken.uid) {
// 			console.error("❌ Token mismatch");
// 			throw new Error("Token mismatch");
// 		}

// 		const dbUser = await User.findOne({ firebaseId: jwtPayload.firebaseId })
// 			.populate("progress")
// 			.populate("payments");

// 		if (!dbUser) {
// 			console.error("❌ User not found in database");
// 			throw new Error("User not found in database");
// 		}

// 		console.log("✅ User Authenticated:", dbUser.email);
// 		(req as AuthenticatedRequest).user = dbUser;
// 	} catch (error) {
// 		console.error("❌ Firebase Token Verification Failed:", error);
// 		throw new Error("Invalid Firebase Token");
// 	}
// }

// async function refreshAuthToken(refreshToken: string) {
// 	try {
// 		// Verify the old Firebase ID Token
// 		const decodedToken = await admin.auth().verifyIdToken(refreshToken, true); // Force refresh

// 		const user = await User.findOne({ firebaseId: decodedToken.uid });
// 		if (!user) {
// 			throw new Error("User not found");
// 		}

// 		// Generate a new JWT for your app (not Firebase)
// 		const accessToken = jwt.sign(
// 			{ id: user._id, firebaseId: user.firebaseId, role: user.role },
// 			process.env.JWT_SECRET as string,
// 			{ expiresIn: "1h" }
// 		);

// 		// Return the **same Firebase refresh token** (frontend handles actual refreshing)
// 		return {
// 			accessToken,
// 			refreshToken, // Keep the same refresh token, let frontend refresh it when needed
// 		};
// 	} catch (error) {
// 		console.error("Token refresh failed:", error);
// 		throw new Error("Failed to refresh token");
// 	}
// }

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
