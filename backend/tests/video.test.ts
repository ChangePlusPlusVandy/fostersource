// tests/videoController.test.ts

import request from "supertest";
import app from "../app";
import Video from "../models/videoModel";
import mongoose from "mongoose";

describe("Video Controller - Get Videos", () => {
	it("should return all videos", async () => {
		await Video.create([
			{ title: "Test Video 1", description: "Desc 1", published: true },
		]);
		const res = await request(app).get("/api/videos");
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.count).toBe(1);
		expect(res.body.data[0].title).toBe("Test Video 1");
	});

	it("should filter videos by title", async () => {
		await Video.create([
			{ title: "Test Video 2", description: "Desc 2", published: false },
		]);

		const res = await request(app)
			.get("/api/videos")
			.query({ title: "Test Video 2" });
		expect(res.status).toBe(200);
		expect(res.body.count).toBe(1);
		expect(res.body.data[0].title).toBe("Test Video 2");
	});
});

//tests create video
describe("Video Controller - Create Video", () => {
	it("should create a new video", async () => {
		const res = await request(app).post("/api/videos").send({
			title: "New Video",
			description: "New Description",
			published: true,
		});

		expect(res.status).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.data.title).toBe("New Video");
	});

	it("should fail if title is missing", async () => {
		const res = await request(app)
			.post("/api/videos")
			.send({ description: "Missing Title", published: true });

		expect(res.status).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe("Please provide title and description");
	});
});
//test update video
describe("Video Controller - Update Video", () => {
	it("should update an existing video", async () => {
		const video = await Video.create({
			title: "Old Title",
			description: "Old Desc",
			published: false,
		});

		const res = await request(app).put(`/api/videos/${video._id}`).send({
			title: "Updated Title",
			description: "Updated Desc",
			published: true,
		});

		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.title).toBe("Updated Title");
	});

	it("should return 404 if video does not exist", async () => {
		const res = await request(app)
			.put(`/api/videos/60c72b1f4f1a2563dc5fa66b`)
			.send({ title: "Non-existent" });

		expect(res.status).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toContain("not found");
	});
});

//tests delete video
describe("Video Controller - Delete Video", () => {
	it("should delete an existing video", async () => {
		const video = await Video.create({
			title: "To be deleted",
			description: "Temp Desc",
			published: false,
		});

		const res = await request(app).delete(`/api/videos/${video._id}`);
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
	});

	it("should return 404 if video does not exist", async () => {
		const res = await request(app).delete(
			`/api/videos/60c72b1f4f1a2563dc5fa66b`
		);
		expect(res.status).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toContain("doesn't exist");
	});
});
