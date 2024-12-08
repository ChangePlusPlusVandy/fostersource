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

// Import middleware
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import { verifyToken } from "./middlewares/authMiddleware";

const app: Application = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use routes
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

app.use("/api/login", loginRoutes); 

// Error middleware
app.use(notFound);
app.use(errorHandler);

export default app;
