import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; // Assuming you have an app.ts file that sets up your Express app
import Question from "../models/questionModel";

describe("Question API", () => {
	it("should create a new question", async () => {
		const questionData = {
			question: "What is 2 + 2?",
			isMCQ: true,
			answers: ["2", "3", "4", "5"],
		};

		const res = await request(app).post("/api/questions").send(questionData);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("_id");
		expect(res.body.question).toBe("What is 2 + 2?");
		expect(res.body.isMCQ).toBe(true);
		expect(res.body.answers).toContain("4");
	});

	it("should retrieve all questions", async () => {
		// Insert sample question into DB
		const question = new Question({
			question: "What is the capital of France?",
			isMCQ: true,
			answers: ["Berlin", "Madrid", "Paris", "Rome"],
		});
		await question.save();

		const res = await request(app).get("/api/questions");

		expect(res.status).toBe(200);
		expect(res.body.length).toBe(1);
		expect(res.body[0].question).toBe("What is the capital of France?");
	});

	it("should update an existing question", async () => {
		const question = new Question({
			question: "What is 3 + 5?",
			isMCQ: true,
			answers: ["5", "8", "10", "12"],
		});
		await question.save();

		const updatedData = {
			question: "What is 5 + 3?",
			answers: ["5", "6", "8", "9"],
		};

		const res = await request(app)
			.put(`/api/questions/${question._id}`)
			.send(updatedData);

		expect(res.status).toBe(200);
		expect(res.body.question).toBe("What is 5 + 3?");
		expect(res.body.answers).toContain("8");
	});

	it("should delete a question", async () => {
		const question = new Question({
			question: "What is the square root of 16?",
			isMCQ: true,
			answers: ["2", "3", "4", "5"],
		});
		await question.save();

		const res = await request(app).delete(`/api/questions/${question._id}`);

		expect(res.status).toBe(200);
		expect(res.body.message).toBe("Question deleted successfully");

		// Verify question is deleted
		const findRes = await request(app).get(`/api/questions/${question._id}`);
		expect(findRes.status).toBe(404);
	});
});
