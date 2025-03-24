import express from "express";
import upload from "../middlewares/uploadMiddleware";
import { uploadImage } from "../controllers/uploadController";

const router = express.Router();

router.post("/image", upload.single("image"), uploadImage);

export default router;
