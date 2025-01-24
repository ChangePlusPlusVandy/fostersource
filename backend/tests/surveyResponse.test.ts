import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import SurveyResponse from "../models/surveyResponseModel";
import QuestionResponse from "../models/questionResponseModel";

jest.setTimeout(30000); // Increase timeout

let mongo: MongoMemoryServer;

describe("Survey Response Controller", () => {
	afterEach(async () => {
		await SurveyResponse.deleteMany({});
		await QuestionResponse.deleteMany({});
	});

	it("should return all survey responses", async () => {
		const questionResponse = await QuestionResponse.create({
			question: "Q1",
			answer: "A1",
		});
		await SurveyResponse.create({
			userId: "123",
			dateCompleted: new Date(),
			answers: [questionResponse._id],
		});

		const res = await request(app).get("/api/surveyResponses");
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.count).toBe(1);
		expect(res.body.data[0].userId).toBe("123");
	});

	it("should create a survey response", async () => {
		const questionResponse = await QuestionResponse.create({
			question: "Q2",
			answer: "A2",
		});

		const res = await request(app)
			.post("/api/surveyResponses")
			.send({
				userId: "123",
				dateCompleted: new Date().toISOString(),
				answers: [questionResponse._id],
			});

		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.data.userId).toBe("123");
	});
});
