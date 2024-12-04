import { Request, Response } from "express";
import User from "../models/userModel";
import { FirebaseDatabaseError } from "firebase-admin/lib/utils/error";

// @desc    Get whether login is valid
// @route   GET /api/login
// @access  Public
export const checkUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {firebaseId} = req.query; 
    if (!firebaseId) {
        res.status(400).send({ message: "No firebase ID"}); 
        return; 
    }

    let user = await User.findOne({ firebaseId: firebaseId }); 
    if (!user) {
        res.status(400).send({ message: "User not found in database" });
        return; 
    }

    res.status(200).send({ user: user, message: "User found" }); 
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error });
  }
};

// @desc    Create a new user
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
        res.status(200).json({ user, message: "User already exists" });
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
    res
        .status(201)
        .json({ user: savedUser, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};
