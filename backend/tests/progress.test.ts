import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Progress from "../models/progressModel";
import User from "../models/userModel";
import Course from "../models/courseModel";

// Sample data
const userData = {
	firebaseId: "12345",
	email: "big@chungus.com",
	isColorado: true,
	role: "staff",
	name: "Big Chungus",
	address1: "123 Chungus St",
	city: "Denver",
	state: "CO",
	zip: "80014",
	certification: "Certified",
	phone: "1234567890",
};

const courseData = {
	id: "Sample",
	className: "Sample Course",
	components: [],
};

describe("Progress API Tests", () => {
	let userId: string;
	let courseId: string;
	let progressId: string;

	// Set up user and course data before each test
	beforeEach(async () => {
		const user = await User.create(userData);
		userId = (user._id as mongoose.Types.ObjectId).toString();

		const course = await Course.create(courseData);
		courseId = (course._id as mongoose.Types.ObjectId).toString();

		const progress = await Progress.create({
			user: userId,
			course: courseId,
			isComplete: false,
			completedComponents: {},
			dateCompleted: null,
		});
		progressId = (progress._id as mongoose.Types.ObjectId).toString();
	});

	// Clean up the test data
	afterEach(async () => {
		await Progress.deleteMany({});
		await User.deleteMany({});
		await Course.deleteMany({});
	});

	// Test GET route to retrieve progress entries
	describe("GET /api/progress", () => {
		it("should retrieve all progress entries", async () => {
			const res = await request(app).get("/api/progress");
			expect(res.statusCode).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBeGreaterThan(0);
		});

		it("should retrieve progress entries filtered by user ID", async () => {
			const res = await request(app)
				.get("/api/progress")
				.query({ user: userId });
			expect(res.statusCode).toBe(200);
			res.body.forEach((progress: any) => {
				expect(progress.user).toBe(userId);
			});
		});
	});

	// Test POST route to create a new progress entry
	describe("POST /api/progress", () => {
		it("should create a new progress entry", async () => {
			const newProgress = {
				user: userId,
				course: courseId,
				isComplete: false,
				completedComponents: { component1: true },
			};
			const res = await request(app).post("/api/progress").send(newProgress);
			expect(res.statusCode).toBe(201);
			expect(res.body.user).toBe(userId);
			expect(res.body.course).toBe(courseId);
		});
	});

	// Test PUT route to update a progress entry
	describe("PUT /api/progress/:id", () => {
		it("should update an existing progress entry", async () => {
			const updates = { isComplete: true };
			const res = await request(app)
				.put(`/api/progress/${progressId}`)
				.send(updates);
			expect(res.statusCode).toBe(200);
			expect(res.body.isComplete).toBe(true);
		});

		it("should return 404 if progress entry is not found", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app)
				.put(`/api/progress/${nonExistentId}`)
				.send({ isComplete: true });
			expect(res.statusCode).toBe(404);
			expect(res.body.message).toBe("Progress entry not found");
		});
	});

	// Test DELETE route to remove a progress entry
	describe("DELETE /api/progress/:id", () => {
		it("should delete a progress entry", async () => {
			const res = await request(app).delete(`/api/progress/${progressId}`);
			expect(res.statusCode).toBe(204);

			const deletedProgress = await Progress.findById(progressId);
			expect(deletedProgress).toBeNull();
		});

		it("should return 404 if progress entry is not found", async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app).delete(`/api/progress/${nonExistentId}`);
			expect(res.statusCode).toBe(404);
			expect(res.body.message).toBe("Progress entry not found");
		});
	});
});
