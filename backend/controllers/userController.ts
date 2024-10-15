import { Request, Response } from "express";
import User from "../models/userModel";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Get a user by filter
// @route   GET /api/users/filter
// @access  Public
export const getUserByFilter = async (
  req: Request,
  res: Response
): Promise<void> => {};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {};
