import express from "express"; 
import { generateCertificate } from "../controllers/pdfGenerator";

const router = express.Router(); 

router.post("/", generateCertificate); 

export default router; 