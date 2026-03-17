import express from "express";
import {
	getUsers,
	getUserById,
	getOrCreateUser,
	updateUser,
	deleteUser,
	register,
	checkAdmin,
	startImpersonation,
	stopImpersonation,
	getImpersonationStatus,
} from "../controllers/userController";

const router = express.Router();

router.get("/is-admin", checkAdmin);
router.get("/impersonation/status", getImpersonationStatus);
router.post("/:targetUserId/impersonate", startImpersonation);
router.post("/impersonation/stop", stopImpersonation);

// GET all users or by filter
router.get("/", getUsers);

// GET user by ID
router.get("/:id", getUserById);

// POST new user if does not exist, otherwise return existing user for login
router.post("/", getOrCreateUser);

// PUT update user by ID
router.put("/:id", updateUser);

// DELETE user by ID
router.delete("/:id", deleteUser);

// PUT Registers a user for a bunch of classes
router.post("/register", register);

// @ts-ignore
export default router;
