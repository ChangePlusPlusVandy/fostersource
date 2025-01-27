import express from "express";
import {
	checkUser,
	createUser,
	loginUser,
} from "../controllers/loginController";

const router = express.Router();

// GET whether login is valid
router.get("/", checkUser);

// POST login
router.post("/", loginUser);

// POST new user
router.post("/register", createUser);

export default router;
