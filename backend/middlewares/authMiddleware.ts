import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebaseAdmin";
import User, { IUser } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const dbUser = await User.findOne({ firebaseId: decodedToken.uid })
      .populate("progress")
      .populate("payments");

    if (!dbUser) {
      return res.status(403).json({ message: "User not found in database" });
    }

    req.user = dbUser;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Unauthorized" });
  }
};
