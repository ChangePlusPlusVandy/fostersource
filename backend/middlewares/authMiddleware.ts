import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebaseAdmin";
import User, { IUser } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    
    if (!token) {
      throw new Error("No token provided"); 
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    const dbUser = await User.findOne({ firebaseId: decodedToken.uid })
      .populate("progress")
      .populate("payments");

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    (req as AuthenticatedRequest).user = dbUser;
    next();
  } catch (error) {
    // res.status(403).json({ message: "Unauthorized" });
    next(error);
  }
};
