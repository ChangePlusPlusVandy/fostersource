import { Request, Response, NextFunction, RequestHandler } from "express";
import UserType from "../models/userTypeModel";

// Fix: Don't return the Response object from the controller function
export const createUserType: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || ["foster parent", "staff"].includes(name.toLowerCase())) {
      res.status(400).json({ message: "This role is reserved or invalid." });
      return;
    }

    const existing = await UserType.findOne({ name });
    if (existing) {
      res.status(409).json({ message: "Role already exists." });
      return;
    }

    const newType = await UserType.create({ name });
    res.status(201).json({ success: true, data: newType });
  } catch (err) {
    next(err); // Pass errors to Express error handler
  }
};

export const getUserTypes: RequestHandler = async (_req, res, next) => {
  try {
    const types = await UserType.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: types });
  } catch (err) {
    next(err); // Pass errors to Express error handler
  }
};

export const deleteUserType: RequestHandler = async (req, res, next) => {
  try {
    const deleted = await UserType.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "User type not found" });
      return;
    }
    res.status(200).json({ success: true, message: "User type deleted" });
  } catch (err) {
    next(err);
  }
};

export const updateUserType: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const updated = await UserType.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: "User type not found" });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};