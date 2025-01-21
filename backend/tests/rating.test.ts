import request from "supertest";
import app from "../app";
import Rating from "../models/ratingModel";
import Course from "../models/courseModel";
import mongoose from "mongoose";

// Dummy ObjectId for testing
const mockCourseId = new mongoose.Types.ObjectId().toString();
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
    const res = await request(app).get(`/api/ratings`).query({ userId: new mongoose.Types.ObjectId().toString() });
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
    // Create a course with an empty ratings array
    const course = await Course.create({
      id: mockCourseId,
      _id: mockCourseId,
      className: "Sample Course",
      ratings: [],
    });
    console.log("Created course:", course); // This should print the course details

    const rating = await Rating.create({
      userId: mockUserId,
      rating: 4,
    });
    ratingId = (rating._id as mongoose.Types.ObjectId).toString();

    // Add the created rating to the course's ratings array
    await Course.findByIdAndUpdate(mockCourseId, { // NEW CODE
      $push: { ratings: rating._id }, // NEW CODE
    });
  });

  it("should delete a rating successfully", async () => {
    // First, check that the rating is indeed in the Course's ratings before deletion
    const courseBeforeDeletion = await Course.findById(mockCourseId); // NEW CODE
    console.log("Course before deletion:", courseBeforeDeletion); // Debugging
    expect(courseBeforeDeletion?.ratings).toContain(ratingId); // NEW CODE

    // Delete the rating
    const res = await request(app).delete(`/api/ratings/${ratingId}`);

    // Check that the response status code is 204 (No Content)
    expect(res.statusCode).toBe(204);

    // Check that the rating is removed from the Course's ratings array
    const courseAfterDeletion = await Course.findById(mockCourseId); // NEW CODE
    expect(courseAfterDeletion?.ratings).not.toContain(ratingId); // NEW CODE

    // Ensure the rating is deleted from the Rating model as well
    const ratingCheck = await Rating.findById(ratingId); // NEW CODE
    expect(ratingCheck).toBeNull(); // NEW CODE
  });

  it("should return 404 if rating is not found", async () => {
    const nonExistentRatingId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/ratings/${nonExistentRatingId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Rating not found.");
  });
});
