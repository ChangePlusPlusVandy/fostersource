import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import ImpersonationSession from "./models/impersonationSessionModel";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();
		await ImpersonationSession.syncIndexes();

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
