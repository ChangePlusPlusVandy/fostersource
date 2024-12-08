import express from "express";
import {
  checkUser,
  createUser,
} from "../controllers/loginController";

const router = express.Router();

// GET whether login is valid
router.get("/", checkUser);

// POST new user
router.post("/", createUser);


export default router;
