import request from "supertest";
import app from "../app";
import Rating from "../models/ratingModel";
import mongoose from "mongoose";

// Dummy ObjectId for testing
const mockUserId = new mongoose.Types.ObjectId().toString();

describe("GET /api/ratings", () => {
  let ratingId: string;

  beforeEach(async () => {
    const rating = await Rating.create({
      userId: mockUserId,
      rating: 4,
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
    const res = await request(app).get(`/api/ratings`).query({ userId: mockUserId });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].userId).toBe(mockUserId);
  });

  it("should return 404 if no ratings are found for the user", async () => {
    const res = await request(app).get(`/api/ratings`).query({ userId: new mongoose.Types.ObjectId() });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No ratings found for this user.");
  });
});

describe("POST /api/ratings", () => {
  it("should create a new rating for a user", async () => {
    const res = await request(app)
      .post("/api/ratings")
      .send({ userId: mockUserId, rating: 5 });

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
    const res = await request(app).delete(`/api/ratings/${nonExistentRatingId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Rating not found.");
  });
});

describe("DELETE /api/ratings/:id", () => {
  let ratingId: string;

  beforeEach(async () => {
    const rating = await Rating.create({
      userId: mockUserId,
      rating: 4,
    });
    ratingId = (rating._id as mongoose.Types.ObjectId).toString();
  });

  it("should delete a rating successfully", async () => {
    const res = await request(app).delete(`/api/ratings/${ratingId}`);

    // Check that the response status code is 204 (No Content)
    expect(res.statusCode).toBe(204);
    
    // Try to retrieve the deleted rating to ensure it's gone
    const ratingCheck = await Rating.findById(ratingId);
    expect(ratingCheck).toBeNull();
  });

  it("should return 404 if rating is not found", async () => {
    const nonExistentRatingId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/ratings/${nonExistentRatingId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Rating not found.");
  });
});
