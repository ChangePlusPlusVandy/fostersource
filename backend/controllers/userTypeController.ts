// backend/controllers/userTypeController.ts
import { Request, Response } from "express";
import UserType from "../models/userTypeModel";

export const createUserType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || ["foster parent", "staff"].includes(name.toLowerCase())) {
      return res.status(400).json({ message: "This role is reserved or invalid." });
    }

    const existing = await UserType.findOne({ name });
    if (existing) return res.status(409).json({ message: "Role already exists." });

    const newType = await UserType.create({ name });
    res.status(201).json({ success: true, data: newType });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserTypes = async (_req: Request, res: Response) => {
  try {
    const types = await UserType.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: types });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};