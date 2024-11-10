import request from "supertest";
import app from "../app";
import Survey from "../models/surveyModel";
import mongoose from "mongoose";
import Payment from "../models/paymentModel";
import Progress from "../models/progressModel";

const surveyData1 = {
  id: "12345",
  question: new mongoose.Types.ObjectId(),
};

const surveyData2 = {
  id: "54321",
  question: new mongoose.Types.ObjectId(),
};

describe("GET /api/surveys", () => {
  beforeEach(async () => {
    await Survey.create([surveyData1, surveyData2]);
  });

  it("should retrieve all surveys", async () => {
    const res = await request(app).get("/api/surveys");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("should retrieve surveys by filter", async () => {
    const res = await request(app).get("/api/surveys").query({ id: "12345" });
    expect(res.statusCode).toBe(200);
    res.body.forEach((survey: any) => {
      expect(survey.id).toBe("12345");
    });
    expect(res.body.length).toBe(1);
  });
});

describe("POST /api/surveys - getOrCreateSurvey", () => {
  it("should create a new survey if it does not exist", async () => {
    const res = await request(app).post("/api/surveys").send(surveyData1);
    expect(res.statusCode).toBe(201);
    expect(res.body.survey.id).toBe("12345");
    expect(res.body.message).toBe("Survey created successfully");
  });

  describe("When survey already exists", () => {
    beforeEach(async () => {
      await request(app).post("/api/surveys").send(surveyData1);
    });

    it("should retrieve an existing survey", async () => {
      const existingSurveyData = {
        id: "12345",
        question: new mongoose.Types.ObjectId(),
      };

      const res = await request(app)
        .post("/api/surveys")
        .send(existingSurveyData);
      expect(res.statusCode).toBe(200);
      expect(res.body.survey.id).toBe("12345");
      expect(res.body.message).toBe("Survey already exists");
    });
  });
});

describe("PUT /api/surveys/:id", () => {
  let surveyId: string;
  beforeEach(async () => {
    const survey = await Survey.create<any>(surveyData1);
    surveyId = (survey._id as mongoose.Types.ObjectId).toString();
  });

  it("should update a survey", async () => {
    const updates = { id: "54321" };

    const res = await request(app)
      .put(`/api/surveys/${surveyId}`)
      .send(updates);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("54321");
  });

  it("should return 404 if survey is not found", async () => {
    const nonExistentSurveyId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/surveys/${nonExistentSurveyId}`)
      .send({ id: "12345" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Survey not found");
  });
});

describe("DELETE /api/surveys/:id", () => {
  let surveyId: string;
  let paymentId: string;
  let progressId: string;

  beforeEach(async () => {
    const survey = await Survey.create(surveyData1);
    surveyId = (survey._id as mongoose.Types.ObjectId).toString();
  });

  it("should delete the requested survey", async () => {
    const res = await request(app).delete(`/api/surveys/${surveyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Survey deleted successfully.");

    const survey = await Survey.findById(surveyId);
    expect(survey).toBeNull();
  });

  it("should return 404 if survey is not found", async () => {
    const nonExistentSurveyId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(
      `/api/surveys/${nonExistentSurveyId}`
    );
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Survey not found.");
  });
});
