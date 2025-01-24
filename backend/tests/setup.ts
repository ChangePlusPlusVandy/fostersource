import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

// Before all tests, start the in-memory MongoDB
beforeAll(async () => {
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
});

// After each test, clear the database
afterEach(async () => {
	const db = mongoose.connection.db;

	if (!db) {
		throw new Error("Database connection is not established.");
	}

	const collections = await db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

// After all tests, stop MongoDB and disconnect
afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongo.stop();
});

// Mock the verifyToken middleware globally
jest.mock("../middlewares/authMiddleware.ts", () => ({
	verifyToken: (req: any, res: any, next: any) => {
		req.user = { userId: "mockedUserId" }; // Mock user object
		next();
	},
}));
