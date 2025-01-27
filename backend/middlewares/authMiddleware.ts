import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import admin from "../firebase/firebaseAdmin";
import User, { IUser } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
	user?: IUser;
}

interface JWTPayload {
	id: string;
	firebaseId: string;
	role: string;
	exp?: number;
}

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		const refreshToken = req.headers["refresh-token"] as string;

		if (!token) {
			throw new Error("No token provided");
		}

		try {
			const jwtPayload = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as JWTPayload;
			await validateTokens(req, jwtPayload, refreshToken);
			next();
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError && refreshToken) {
				try {
					const newTokens = await refreshAuthToken(refreshToken);
					res.setHeader("new-access-token", newTokens.accessToken);
					res.setHeader("new-refresh-token", newTokens.refreshToken);

					const jwtPayload = jwt.verify(
						newTokens.accessToken,
						process.env.JWT_SECRET as string
					) as JWTPayload;
					await validateTokens(req, jwtPayload, newTokens.refreshToken);
					next();
				} catch (refreshError) {
					throw new Error("Token refresh failed");
				}
			} else {
				throw error;
			}
		}
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			res.status(401).json({ message: "Token expired" });
		} else if (error instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ message: "Invalid token" });
		} else {
			res
				.status(403)
				.json({ message: (error as Error).message || "Authentication failed" });
		}
	}
};

async function validateTokens(
	req: Request,
	jwtPayload: JWTPayload,
	firebaseToken: string
): Promise<void> {
	const decodedFirebaseToken = await admin.auth().verifyIdToken(firebaseToken);

	if (jwtPayload.firebaseId !== decodedFirebaseToken.uid) {
		throw new Error("Token mismatch");
	}

	const dbUser = await User.findOne({ firebaseId: jwtPayload.firebaseId })
		.populate("progress")
		.populate("payments");

	if (!dbUser) {
		throw new Error("User not found in database");
	}

	(req as AuthenticatedRequest).user = dbUser;
}

async function refreshAuthToken(refreshToken: string) {
	try {
		const decodedToken = await admin.auth().verifyIdToken(refreshToken);
		const user = await User.findOne({ firebaseId: decodedToken.uid });

		if (!user) {
			throw new Error("User not found");
		}

		const accessToken = jwt.sign(
			{ id: user._id, firebaseId: user.firebaseId, role: user.role },
			process.env.JWT_SECRET as string,
			{ expiresIn: "1h" }
		);

		const newRefreshToken = await admin
			.auth()
			.createCustomToken(user.firebaseId);

		return {
			accessToken,
			refreshToken: newRefreshToken,
		};
	} catch (error) {
		throw new Error("Failed to refresh token");
	}
}
