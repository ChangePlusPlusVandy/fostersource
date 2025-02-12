import request from "supertest";
import app from "../app";
import Rating from "../models/ratingModel";
import Course from "../models/courseModel";
import mongoose from "mongoose";

// Dummy ObjectId for testing
const mockUserId = new mongoose.Types.ObjectId().toString();

describe("GET /api/ratings", () => {
	let ratingId: string;

	beforeEach(async () => {
		const rating = await Rating.create({
			userId: mockUserId,
			rating: 4,
			courseId: new mongoose.Types.ObjectId().toString(),
		});
		ratingId = (rating._id as mongoose.Types.ObjectId).toString();
	});

	it("should retrieve all ratings", async () => {
		const res = await request(app).get("/api/ratings");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0); // Ensure we have ratings
	});

	it("should retrieve ratings for a specific user", async () => {
		const res = await request(app)
			.get(`/api/ratings`)
			.query({ userId: mockUserId });
		expect(res.statusCode).toBe(200);
		expect(res.body[0].userId).toBe(mockUserId);
	});

	it("should return 404 if no ratings are found for the user", async () => {
		const res = await request(app)
			.get(`/api/ratings`)
			.query({ userId: new mongoose.Types.ObjectId().toString() });
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("No ratings found for this user.");
	});
});

describe("POST /api/ratings", () => {
	it("should create a new rating for a user", async () => {
		const res = await request(app).post("/api/ratings").send({
			userId: mockUserId,
			rating: 5,
			courseId: new mongoose.Types.ObjectId().toString(),
		});

		expect(res.statusCode).toBe(201);
		expect(res.body.rating).toBe(5);
		expect(res.body.userId).toBe(mockUserId);
	});

	it("should return 400 if required fields are missing", async () => {
		const res = await request(app)
			.post("/api/ratings")
			.send({ userId: mockUserId }); // Missing "rating" field

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("User ID and rating are required.");
	});

	it("should return 400 if rating is out of bounds", async () => {
		const res = await request(app)
			.post("/api/ratings")
			.send({ rating: 11, userId: mockUserId }); // Invalid rating

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Rating must be between 1 and 10.");
	});
});

describe("PUT /api/ratings/:id", () => {
	let ratingId: string;

	beforeEach(async () => {
		const rating = await Rating.create({
			userId: mockUserId,
			rating: 4,
			courseId: new mongoose.Types.ObjectId().toString(),
		});
		ratingId = (rating._id as mongoose.Types.ObjectId).toString();
	});

	it("should update a rating", async () => {
		const updatedRatingData = { rating: 5 };

		const res = await request(app)
			.put(`/api/ratings/${ratingId}`)
			.send(updatedRatingData);

		expect(res.statusCode).toBe(200);
		expect(res.body.rating).toBe(5);
	});

	it("should return 404 if rating is not found", async () => {
		const nonExistentRatingId = new mongoose.Types.ObjectId();
		const res = await request(app).delete(
			`/api/ratings/${nonExistentRatingId}`
		);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("Rating not found.");
	});
});

describe("DELETE /api/ratings/:id", () => {
	let ratingId: string;

	beforeEach(async () => {
		const course = await Course.create({
			ratings: [],
			className: "Sample Course",
			components: [],
			cost: 0,
			thumbnailPath: "chungus",
			description: "chungus",
			creditNumber: 0,
			isLive: false,
		});

		const rating = await Rating.create({
			userId: mockUserId,
			courseId: course._id,
			rating: 4,
		});

		ratingId = (rating._id as mongoose.Types.ObjectId).toString();
	});

	it("should delete a rating successfully", async () => {
		const rating = await Rating.findById(ratingId);

		const courseBeforeDeletion = await Course.findById(rating?.courseId);
		expect(courseBeforeDeletion).not.toBeNull();
		expect(courseBeforeDeletion?.ratings.map((id) => id.toString())).toContain(
			ratingId
		);

		// Delete the rating
		const res = await request(app).delete(`/api/ratings/${ratingId}`);
		expect(res.statusCode).toBe(204);

		const courseAfterDeletion = await Course.findById(rating?.courseId);
		expect(courseAfterDeletion).not.toBeNull();
		expect(
			courseAfterDeletion?.ratings.map((id) => id.toString())
		).not.toContain(ratingId);

		// Try to retrieve the deleted rating to ensure it's gone
		const ratingCheck = await Rating.findById(ratingId);
		expect(ratingCheck).toBeNull();
	});

	it("should return 404 if rating is not found", async () => {
		const nonExistentRatingId = new mongoose.Types.ObjectId();
		const res = await request(app).delete(
			`/api/ratings/${nonExistentRatingId}`
		);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("Rating not found.");
	});
});
