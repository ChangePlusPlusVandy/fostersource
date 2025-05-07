// backend/routes/userTypeRoutes.ts
import express from "express";
import {
  createUserType,
  getUserTypes,
  deleteUserType, 
  updateUserType,
} from "../controllers/userTypeController";

const router = express.Router();

router.post("/", createUserType);
router.get("/", getUserTypes);
router.put("/:id", updateUserType);
router.delete("/:id", deleteUserType);

export default router;
