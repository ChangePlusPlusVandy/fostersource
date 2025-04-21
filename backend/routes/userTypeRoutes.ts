import express from "express";
import {
  createUserType,
  getUserTypes,
} from "../controllers/userTypeController";

const router = express.Router();

router.post("/", createUserType);
router.get("/", getUserTypes);

export default router;