import express from "express";
import {
	getUsers,
	getOrCreateUser,
	updateUser,
	deleteUser,
	register,
} from "../controllers/userController";

const router = express.Router();

// GET all users or by filter
router.get("/", getUsers);

// POST new user if does not exist, otherwise return existing user for login
router.post("/", getOrCreateUser);

// PUT update user by ID
router.put("/:id", updateUser);

// DELETE user by ID
router.delete("/:id", deleteUser);

// PUT Registers a user for a bunch of classes
router.post("/register", register);

export default router;
