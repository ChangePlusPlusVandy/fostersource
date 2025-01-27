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
    const firebaseToken = req.headers["firebase-token"];

    console.log("trying to login");

    if (!firebaseId || !firebaseToken) {
      res.status(400).send({ message: "Missing required authentication data" });
      return;
    }

    const decodedToken = await admin
      .auth()
      .verifyIdToken(firebaseToken as string);
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
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firebaseId,
      email,
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
      role = "foster parent", // Default role
      isColorado = true, // Default value
    } = req.body;

    const firebaseToken = req.headers.authorization?.split(" ")[1];

    if (!firebaseToken) {
      res.status(401).json({ message: "No Firebase token provided" });
      return;
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    if (decodedToken.uid !== firebaseId) {
      res.status(401).json({ message: "Invalid Firebase token" });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseId });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create new user
    const newUser = new User({
      firebaseId,
      email,
      name,
      role,
      isColorado,
      address2,
      progress,
      payments,
      address1: "N/A",
      city: "N/A",
      state: "N/A",
      zip: "N/A",
      certification: "N/A",
      phone: "N/A",
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        id: savedUser._id,
        firebaseId: savedUser.firebaseId,
        role: savedUser.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = await admin
      .auth()
      .createCustomToken(savedUser.firebaseId);

    res.status(201).json({
      user: savedUser,
      accessToken,
      refreshToken,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseId, email } = req.body;
    const firebaseToken = req.headers.authorization?.split(" ")[1];

    if (!firebaseToken) {
      res.status(401).json({ message: "No Firebase token provided" });
      return;
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    if (decodedToken.uid !== firebaseId) {
      res.status(401).json({ message: "Invalid Firebase token" });
      return;
    }

    // Find user in database
    let user = await User.findOne({ firebaseId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id, firebaseId: user.firebaseId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = await admin.auth().createCustomToken(user.firebaseId);

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};
