import express from "express";
import cors from "cors";
import path from "path";

// Import route files
import userRoutes from "./routes/userRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import surveyRoutes from "./routes/surveyRoutes";
import surveyResponseRoutes from "./routes/surveyResponseRoutes";
import questionRoutes from "./routes/questionRoutes";
import questionResponseRoutes from "./routes/questionResponseRoutes";
import progressRoutes from "./routes/progressRoutes";
import courseRoutes from "./routes/courseRoutes";
import videoRoutes from "./routes/videoRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import loginRoutes from "./routes/loginRoutes";
import certificateRoutes from "./routes/certificateRoutes";
import handoutRoutes from "./routes/handoutRoutes";
import courseCategoriesRoutes from "./routes/courseCategoryRoutes";
import emailRoutes from "./routes/emailRoutes";
import speakerRoutes from "./routes/speakerRoutes";
import pdfRoutes from "./routes/pdfRoutes";
import emailTemplateRoutes from "./routes/emailTemplateRoutes";
import zoomRoutes from "./routes/zoomRoutes";
import userTypeRoutes from "./routes/userTypeRoutes";

// Import middleware
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import { verifyFirebaseAuth } from "./middlewares/authMiddleware";
import upload from "./middlewares/upload";
import { uploadImage } from "./controllers/uploadController";
import uploadRoutes from "./routes/uploadRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// CORS configuration - must be before any routes
const allowedOrigins = [
	"https://fostersource.onrender.com",
	"http://localhost:3000",
];

app.use(
	cors({
		origin: (origin: any, callback: any) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);

// Middleware to parse JSON
app.use(express.json());

app.options("*", cors());

// Use routes
app.use("/api/login", loginRoutes);
app.use("/api/users", verifyFirebaseAuth, userRoutes);
app.use("/api/ratings", verifyFirebaseAuth, ratingRoutes);
app.use("/api/surveys", verifyFirebaseAuth, surveyRoutes);
app.use("/api/surveyResponses", verifyFirebaseAuth, surveyResponseRoutes);
app.use("/api/questions", verifyFirebaseAuth, questionRoutes);
app.use("/api/questionResponses", verifyFirebaseAuth, questionResponseRoutes);
app.use("/api/progress", verifyFirebaseAuth, progressRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", verifyFirebaseAuth, videoRoutes);
app.use("/api/payments", verifyFirebaseAuth, paymentRoutes);
app.use("/api/certificates", verifyFirebaseAuth, certificateRoutes);
app.use("/api/courseCategories", verifyFirebaseAuth, courseCategoriesRoutes);
app.use("/api/handout", verifyFirebaseAuth, handoutRoutes);
app.use("/api/emails", verifyFirebaseAuth, emailRoutes);
app.use("/api/emailTemplates", verifyFirebaseAuth, emailTemplateRoutes);
app.use("/api/speakers", verifyFirebaseAuth, speakerRoutes);
app.use("/api/upload", verifyFirebaseAuth, uploadRoutes);
app.use("/api/user-types", userTypeRoutes);
app.use("/api/zoom", verifyFirebaseAuth, zoomRoutes);
app.use("/api/certificatePDFs", verifyFirebaseAuth, pdfRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

export default app;
