import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/userModel";
import admin from "../firebase/firebaseAdmin";

// @desc    Get whether login is valid and return token
// @route   GET /api/login
// @access  Public
export const checkUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseId } = req.query;
    const firebaseToken = req.headers['firebase-token'];

    if (!firebaseId || !firebaseToken) {
      res.status(400).send({ message: "Missing required authentication data" });
      return;
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken as string);
    if (decodedToken.uid !== firebaseId) {
      throw new Error("Firebase token mismatch");
    }

    const user = await User.findOne({ firebaseId });

    if (!user) {
      res.status(404).send({ message: "User not found in database" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, firebaseId: user.firebaseId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Get a new Firebase ID token to use as refresh token
    const refreshToken = await admin.auth().createCustomToken(user.firebaseId);

    res.status(200).send({
      user,
      accessToken,
      refreshToken,
      message: "User found",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error });
  }
};

// @desc    Create a new user and return token
// @route   POST /api/login
// @access  Public
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firebaseId,
      email,
      isColorado,
      role,
      name,
      address1,
      address2,
      city,
      state,
      zip,
      certification,
      phone,
      progress,
      payments,
    } = req.body;

    let user = await User.findOne({ firebaseId });

    if (user) {
      const token = jwt.sign(
        { id: user._id, firebaseId: user.firebaseId, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user, token, message: "User already exists" });
      return;
    }

    const newUser = new User({
      firebaseId,
      email,
      isColorado,
      role,
      name,
      address1,
      address2,
      city,
      state,
      zip,
      certification,
      phone,
      progress,
      payments,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, firebaseId: savedUser.firebaseId, role: savedUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      user: savedUser,
      token,
      message: "User created",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};
