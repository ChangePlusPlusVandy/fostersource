import express, { Application } from "express";
import cors from "cors";

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
import handoutRoutes from "./routes/handoutRoutes";

// Import middleware
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import { verifyToken } from "./middlewares/authMiddleware";

const app: Application = express();

// CORS configuration - must be before any routes
app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:5001"], // Allowed origins
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Headers frontend can send
		exposedHeaders: ["Content-Type", "Authorization"], // Headers frontend can access
		credentials: true, // Allows cookies or credentials to be sent
	})
);

// Middleware to parse JSON
app.use(express.json());

app.options("*", cors());

// Use routes
app.use("/api/login", loginRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/ratings", verifyToken, ratingRoutes);
app.use("/api/surveys", verifyToken, surveyRoutes);
app.use("/api/surveyResponses", verifyToken, surveyResponseRoutes);
app.use("/api/questions", verifyToken, questionRoutes);
app.use("/api/questionResponses", verifyToken, questionResponseRoutes);
app.use("/api/progress", verifyToken, progressRoutes);
app.use("/api/courses", verifyToken, courseRoutes);
app.use("/api/videos", verifyToken, videoRoutes);
app.use("/api/payments", verifyToken, paymentRoutes);
app.use("/api/handouts", verifyToken, handoutRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;

export default app;
