import express from "express";
import {
    getSpeakers,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker
} from "../controllers/speakerController";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Create this directory in your project
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
router.get("/", getSpeakers);
router.post("/", upload.single('image'), createSpeaker);
router.put("/:id", upload.single('image'), updateSpeaker);
router.delete("/:id", deleteSpeaker);


export default router;