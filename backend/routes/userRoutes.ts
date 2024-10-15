import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  getUserByFilter,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// POST new user
router.post("/", createUser);

// PUT update user by ID
router.put("/:id", updateUser);

// GET user by filter (name or email)
router.get("/filter", getUserByFilter);

// DELETE user by ID
router.delete("/:id", deleteUser);

export default router;
