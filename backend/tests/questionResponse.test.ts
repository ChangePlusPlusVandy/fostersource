import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import QuestionResponse from "../models/questionResponseModel";

const questionResponseData1 = {
	id: new mongoose.Types.ObjectId(),
	Questionid: new mongoose.Types.ObjectId(),
	answer: "lebronJames",
};

const questionResponseData2 = {
	id: new mongoose.Types.ObjectId(),
	Questionid: new mongoose.Types.ObjectId(),
	answer: "Correct Answer 2",
};

describe("GET /api/questionResponses", () => {
	beforeEach(async () => {
		await QuestionResponse.create([
			questionResponseData1,
			questionResponseData2,
		]);
	});

	it("should retrieve all question responses", async () => {
		const res = await request(app).get("/api/questionResponses");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBe(2);
	});

	it("should retrieve question responses by filter", async () => {
		const res = await request(app)
			.get("/api/questionResponses")
			.query({ answer: "lebronJames" });
		expect(res.statusCode).toBe(200);
		res.body.forEach((response: any) => {
			expect(response.answer).toBe("lebronJames");
		});
		expect(res.body.length).toBe(1);
	});
});

describe("POST /api/questionResponses", () => {
	it("should create a new question response", async () => {
		const res = await request(app)
			.post("/api/questionResponses")
			.send(questionResponseData1);
		expect(res.statusCode).toBe(201);
		expect(res.body.answer).toBe("lebronJames");
	});
});

describe("PUT /api/questionResponses/:id", () => {
	let questionResponseId: string;
	beforeEach(async () => {
		const questionResponse = await QuestionResponse.create(
			questionResponseData1
		);
		questionResponseId = (
			questionResponse._id as mongoose.Types.ObjectId
		).toString();
	});

	it("should update a question response", async () => {
		const updates = { answer: "Updated Answer" };
		const res = await request(app)
			.put(`/api/questionResponses/${questionResponseId}`)
			.send(updates);
		expect(res.statusCode).toBe(200);
		expect(res.body.answer).toBe("Updated Answer");
	});

	it("should return 404 if question response is not found", async () => {
		const nonExistentQuestionResponseId = new mongoose.Types.ObjectId();
		const res = await request(app)
			.put(`/api/questionResponses/${nonExistentQuestionResponseId}`)
			.send({ answer: "No Response" });
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("Response not found");
	});
});

describe("DELETE /api/questionResponses/:id", () => {
	let questionResponseId: string;
	beforeEach(async () => {
		const questionResponse = await QuestionResponse.create(
			questionResponseData1
		);
		questionResponseId = (
			questionResponse._id as mongoose.Types.ObjectId
		).toString();
	});

	it("should delete a question response", async () => {
		const res = await request(app).delete(
			`/api/questionResponses/${questionResponseId}`
		);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("Deleted: ");
		const questionResponse =
			await QuestionResponse.findById(questionResponseId);
		expect(questionResponse).toBeNull();
	});

	it("should return 404 if question response is not found", async () => {
		const nonExistentQuestionResponseId = new mongoose.Types.ObjectId();
		const res = await request(app).delete(
			`/api/questionResponses/${nonExistentQuestionResponseId}`
		);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("Response not found");
	});
});
