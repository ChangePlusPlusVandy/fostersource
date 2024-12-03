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

// Import middleware
import { notFound, errorHandler } from "./middlewares/errorMiddleware";

const app: Application = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/surveyResponses", surveyResponseRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/questionResponses", questionResponseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/payments", paymentRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

export default app;
