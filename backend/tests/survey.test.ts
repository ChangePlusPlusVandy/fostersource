import request from "supertest";
import app from "../app";
import Survey from "../models/surveyModel";
import mongoose from "mongoose";
import Question from "../models/questionModel";

const questionData = {
	question: "What is 2 + 2?",
	isMCQ: true,
	answers: ["2", "3", "4", "5"],
};

let surveyData1: { id: string; question: mongoose.Types.ObjectId[] };
let surveyData2: { id: string; question: mongoose.Types.ObjectId[] };

beforeAll(async () => {
	// Create actual question documents
	const question1 = await Question.create(questionData);
	const question2 = await Question.create({
		...questionData,
		question: "What is 3 + 3?",
	});

	surveyData1 = {
		id: "12345",
		question: [question1._id as mongoose.Types.ObjectId],
	};

	surveyData2 = {
		id: "54321",
		question: [question2._id as mongoose.Types.ObjectId],
	};
});

describe("GET /api/surveys", () => {
	beforeEach(async () => {
		// First create the questions
		const question1 = await Question.create({
			question: "What is 2 + 2?",
			isMCQ: true,
			answers: ["2", "3", "4", "5"],
		});

		const question2 = await Question.create({
			question: "What is 3 + 3?",
			isMCQ: true,
			answers: ["4", "5", "6", "7"],
		});

		// Then create surveys with the actual question IDs
		await Survey.create([
			{
				id: "12345",
				question: [question1._id],
			},
			{
				id: "54321",
				question: [question2._id],
			},
		]);
	});

	it("should retrieve all surveys with their questions", async () => {
		const res = await request(app).get("/api/surveys");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBe(2);
		// Verify questions are populated
		expect(["What is 2 + 2?", "What is 3 + 3?"]).toContain(
			res.body[0].question[0].question
		);
	});

	it("should retrieve surveys by filter", async () => {
		const res = await request(app).get("/api/surveys").query({ id: "12345" });
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(1);
		expect(res.body[0].id).toBe("12345");
		expect(res.body[0].question[0].question).toBe("What is 2 + 2?");
	});
});

describe("POST /api/surveys - getOrCreateSurvey", () => {
	it("should create a new survey with questions if it does not exist", async () => {
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
				question: [new mongoose.Types.ObjectId()],
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
