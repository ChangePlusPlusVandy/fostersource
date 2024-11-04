import request from "supertest";
import app from "../app";
import User from "../models/userModel";
import mongoose from "mongoose";
import Payment from "../models/paymentModel";
import Progress from "../models/progressModel";
import QuestionResponse from "..//models/questionResponseModel";

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

const questionResponseData1 = {
  id: "LebronJames",
  Questionid: "OffspringOfNumber23",
  answer: "Bronny James",
};

const questionResponseData2 = {
  id: "User123",
  Questionid: "question101",
  answer: "Test Answer 1",
};

  describe("GET /api/questionResponses", () => {
    beforeEach(async () => {
      await QuestionResponse.create([questionResponseData1, questionResponseData2]);
    });

    it("should get all question responses", async () => {
      const res = await request(app).get("/api/questionResponses");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it("should filter and get question responses back", async () => {
      const res = await request(app).get("/api/questionResponses").query({ answer: "Test Answer 1" });
      expect(res.statusCode).toBe(200);
      res.body.forEach((response: any) => {
        expect(response.answer).toBe("Test Answer 1");
      });
      expect(res.body.length).toBe(1);
    });
  });

  describe("POST /api/questionResponses", () => {
    it("should create a new question response", async () => {
      const res = await request(app).post("/api/questionResponses").send(questionResponseData1);
      expect(res.statusCode).toBe(201);
      expect(res.body.answer).toBe(questionResponseData1.answer);
      expect(res.body.id).toBe(questionResponseData1.id);
    });
  });

  describe("PUT /api/questionResponses/:id", () => {
    let questionResponseId: string;

    beforeEach(async () => {
      const questionResponse = await QuestionResponse.create(questionResponseData1);
      questionResponseId = questionResponse.id.toString();
    });

    it("should update a question response", async () => {
      const updates = { answer: "Updated Answer" };

      const res = await request(app).put(`/api/questionResponses/${questionResponseId}`).send(updates);
      expect(res.statusCode).toBe(200);
      expect(res.body.answer).toBe("Updated Answer");
    });

    it("should return 404 if question response is not found", async () => {
      const nonExistentResponseId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .put(`/api/questionResponses/${nonExistentResponseId}`)
        .send({ answer: "Another Answer" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Response not found");
    });
  });

  describe("DELETE /api/questionResponses/:id", () => {
    let questionResponseId: string;

    beforeEach(async () => {
      const questionResponse = await QuestionResponse.create(questionResponseData1);
      questionResponseId = questionResponse.id.toString();
    });

    it("should delete the question response", async () => {
      const res = await request(app).delete(`/api/questionResponses/${questionResponseId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Deleted");

      const deletedResponse = await QuestionResponse.findById(questionResponseId);
      expect(deletedResponse).toBeNull();
    });

    it("should return 404 if question response is not found", async () => {
      const nonExistentResponseId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/questionResponses/${nonExistentResponseId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Response not found");
    });
  });

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
