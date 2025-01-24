import express from "express";
import {
  checkUser,
  createUser,
  loginUser
} from "../controllers/loginController";

const router = express.Router();

// Add debug logging
router.use((req, res, next) => {
  console.log(`Login Route accessed: ${req.method} ${req.path}`);
  next();
});

// GET whether login is valid
router.get("/", checkUser);

// POST login
router.post("/", loginUser);

// POST new user
router.post("/register", createUser);

export default router;
