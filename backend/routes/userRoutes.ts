import express from "express";
import {
	getUsers,
	getOrCreateUser,
	updateUser,
	deleteUser,
	register,
	checkAdmin,
} from "../controllers/userController";
import { createUserType, getUserTypes } from "../controllers/userTypeController";
import { verifyFirebaseAuth } from "../middlewares/authMiddleware";

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

// @ts-ignore
router.get("/is-admin", verifyFirebaseAuth, checkAdmin); // Protect the route

// @ts-ignore
export default router;
