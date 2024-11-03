import request from "supertest";
import app from "../app";
import User from "../models/userModel";
import mongoose from "mongoose";
import Payment from "../models/paymentModel";
import Progress from "../models/progressModel";

const userData1 = {
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

const userData2 = {
  firebaseId: "12345",
  email: "humungous@chungus.com",
  isColorado: true,
  role: "foster parent",
  name: "Humungous Chungus",
  address1: "123 Chungus St",
  city: "Denver",
  state: "CO",
  zip: "80014",
  certification: "Certified",
  phone: "1234567890",
};

describe("GET /api/users", () => {
  beforeEach(async () => {
    await User.create([userData1, userData2]);
  });

  it("should retrieve all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("should retrieve users by filter", async () => {
    const res = await request(app).get("/api/users").query({ role: "staff" });
    expect(res.statusCode).toBe(200);
    res.body.forEach((user: any) => {
      expect(user.role).toBe("staff");
    });
    expect(res.body.length).toBe(1);
  });
});

describe("POST /api/users - getOrCreateUser", () => {
  it("should create a new user if not exists", async () => {
    const res = await request(app).post("/api/users").send(userData1);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("big@chungus.com");
    expect(res.body.message).toBe("User created successfully");
  });

  describe("When user already exists", () => {
    beforeEach(async () => {
      await request(app).post("/api/users").send(userData1);
    });

    it("should retrieve an existing user", async () => {
      const existingUserData = {
        firebaseId: "12345",
        email: "big@chungus.com",
      };

      const res = await request(app).post("/api/users").send(existingUserData);
      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe("big@chungus.com");
      expect(res.body.message).toBe("User already exists");
    });
  });
});

describe("PUT /api/users/:id", () => {
  let userId: string;
  beforeEach(async () => {
    const user = await User.create<any>(userData1);
    userId = (user._id as mongoose.Types.ObjectId).toString();
  });

  it("should update a user", async () => {
    const updates = { email: "super@chungus.com" };

    const res = await request(app).put(`/api/users/${userId}`).send(updates);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("super@chungus.com");
  });

  it("should return 404 if user is not found", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/users/${nonExistentUserId}`)
      .send({ email: "duper@chungus.com" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});

describe("DELETE /api/users/:id", () => {
  let userId: string;
  let paymentId: string;
  let progressId: string;

  beforeEach(async () => {
    const user = await User.create(userData1);
    userId = (user._id as mongoose.Types.ObjectId).toString();

    const payment = await Payment.create({
      userId: userId,
      date: new Date(),
      amount: 1000000,
      memo: "big chungus was here",
    });
    paymentId = (payment._id as mongoose.Types.ObjectId).toString();

    const progress = await Progress.create({
      user: userId,
      course: new mongoose.Types.ObjectId(),
      isComplete: false,
      completedComponents: {},
      dateCompleted: new Date(),
    });
    progressId = (progress._id as mongoose.Types.ObjectId).toString();
  });

  it("should delete the user and associated payments and progress", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(
      "User and associated progress and payment records deleted successfully."
    );

    const user = await User.findById(userId);
    expect(user).toBeNull();

    const payment = await Payment.findById(paymentId);
    expect(payment).toBeNull();

    const progress = await Progress.findById(progressId);
    expect(progress).toBeNull();
  });

  it("should return 404 if user is not found", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/users/${nonExistentUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });
});
