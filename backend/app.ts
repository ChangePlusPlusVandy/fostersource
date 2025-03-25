import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import cloudinary from "./config/cloudinary";

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
import speakerRoutes from "./routes/speakerRoutes";

// Import middleware
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import { verifyFirebaseAuth } from "./middlewares/authMiddleware";
import upload from "./middlewares/upload";
import { uploadImage } from "./controllers/uploadController";
import uploadRoutes from "./routes/uploadRoutes";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// CORS configuration - must be before any routes
app.use(
	cors({
		origin: (origin, callback) => {
			const regex = /^http:\/\/localhost:\d+$/;
			if (!origin || regex.test(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"refresh-token",
			"new-access-token",
			"new-refresh-token",
		], // Headers frontend can send
		exposedHeaders: [
			"Content-Type",
			"Authorization",
			"refresh-token",
			"new-access-token",
			"new-refresh-token",
		], // Headers frontend can access
		credentials: true, // Allows cookies or credentials to be sent
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
app.use("/api/courses", verifyFirebaseAuth, courseRoutes);
app.use("/api/videos", verifyFirebaseAuth, videoRoutes);
app.use("/api/payments", verifyFirebaseAuth, paymentRoutes);
app.use("/api/certificates", verifyFirebaseAuth, certificateRoutes);
app.use("/api/handout", verifyFirebaseAuth, handoutRoutes);
app.use("/api/speakers", verifyFirebaseAuth, speakerRoutes);
app.use("/api/upload", verifyFirebaseAuth, uploadRoutes);

// Error middleware
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
	if (err instanceof multer.MulterError) {
		console.error("❌ Multer error:", err.message);
		res.status(400).json({ message: err.message });
		return;
	}
	console.error("❌ Unknown error:", err);
	res.status(500).json({ message: "Internal server error" });
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;

export default app;
