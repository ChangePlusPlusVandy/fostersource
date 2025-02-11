import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Course from "../models/courseModel";
import Rating from "../models/ratingModel";
import Survey from "../models/surveyModel";
import Video from "../models/videoModel";
import Question from "../models/questionModel";
import User from "../models/userModel";

const incompleteCourseData = {};

const courseData1 = {
	handouts: [],
	ratings: [],
	className: "Course A",
	discussion: "",
	components: [],
	isLive: true,
	categories: ["Category 1", "Category 2"],
	creditNumber: 3,
	description: "This is a description for Course A",
	thumbnailPath: "/path/to/thumbnail1.jpg",
	cost: 12345,
};

const courseData2 = {
	handouts: [],
	ratings: [],
	className: "Course B",
	discussion: "",
	components: [],
	isLive: false,
	categories: ["Category 3"],
	creditNumber: 4,
	description: "This is a description for Course B",
	thumbnailPath: "/path/to/thumbnail2.jpg",
	cost: 0,
};

const userData = {
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

describe("GET /api/courses", () => {
	beforeEach(async () => {
		await Course.create([courseData1, courseData2]);
	});

	it("should retrieve all courses", async () => {
		const res = await request(app).get("/api/courses");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body.data)).toBe(true);
		expect(res.body.count).toBe(2);
	});

	it("should retrieve courses by name", async () => {
		const res = await request(app)
			.get("/api/courses")
			.query({ className: "Course A" });
		expect(res.statusCode).toBe(200);
		res.body.data.forEach((course: any) => {
			expect(course.className).toBe("Course A");
		});
		expect(res.body.count).toBe(1);
	});

	it("should retrieve courses by isLive status", async () => {
		const res = await request(app).get("/api/courses").query({ isLive: true });
		expect(res.statusCode).toBe(200);
		res.body.data.forEach((course: any) => {
			expect(course.isLive).toBe(true);
		});
		expect(res.body.count).toBe(1);
	});
});

describe("POST /api/courses", () => {
	it("should fail to create a new course if missing data", async () => {
		const res = await request(app)
			.post("/api/courses")
			.send(incompleteCourseData);
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe(
			"Please provide className, isLive, creditNumber, description, and thumbnailPath"
		);
	});

	it("should create a new course if all required fields are provided", async () => {
		const res = await request(app).post("/api/courses").send(courseData1);
		expect(res.statusCode).toBe(201);
		expect(res.body.data.className).toBe("Course A");
		expect(res.body.data.isLive).toBe(true);
		expect(res.body.data.categories).toEqual(["Category 1", "Category 2"]);
		expect(res.body.data.creditNumber).toBe(3);
		expect(res.body.data.description).toBe(
			"This is a description for Course A"
		);
		expect(res.body.data.thumbnailPath).toBe("/path/to/thumbnail1.jpg");
		expect(res.body.data.cost).toBe(12345);
	});

	describe("when course already exists", () => {
		beforeEach(async () => {
			await request(app).post("/api/courses").send(courseData1);
		});

		it("should retrieve an existing course", async () => {
			const existingCourseData = {
				className: "Course A",
				isLive: true,
				creditNumber: 3,
				description: "This is a description for Course A",
				thumbnailPath: "/path/to/thumbnail1.jpg",
				cost: 12345,
			};

			const res = await request(app)
				.post("/api/courses")
				.send(existingCourseData);
			expect(res.statusCode).toBe(200);
			expect(res.body.data.className).toBe("Course A");
			expect(res.body.message).toBe("Course already exists");
		});
	});
});

describe("PUT /api/courses/:id", () => {
	let courseId: string;
	beforeEach(async () => {
		const course = await Course.create<any>(courseData1);
		courseId = (course._id as mongoose.Types.ObjectId).toString();
	});

	it("should update a course", async () => {
		const updates = { className: "Course C", isLive: false, creditNumber: 5 };

		const res = await request(app)
			.put(`/api/courses/${courseId}`)
			.send(updates);
		expect(res.statusCode).toBe(200);
		expect(res.body.data.className).toBe("Course C");
		expect(res.body.data.isLive).toBe(false);
		expect(res.body.data.creditNumber).toBe(5);
	});

	it("should return 404 if course is not found", async () => {
		const invalidCourseId = new mongoose.Types.ObjectId();
		const res = await request(app)
			.put(`/api/courses/${invalidCourseId}`)
			.send({ className: "Course X" });
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("Course entry not found");
	});
});

describe("DELETE /api/courses/:id", () => {
	let courseId: string;
	let ratingId: string;
	let userId: string;

	beforeEach(async () => {
		const course = await Course.create(courseData1);
		courseId = (course._id as mongoose.Types.ObjectId).toString();

		const user = await User.create(userData);
		userId = (user._id as mongoose.Types.ObjectId).toString();

		const rating = await Rating.create({
			userId: userId,
			courseId: courseId,
			rating: "5",
		});
		ratingId = (rating._id as mongoose.Types.ObjectId).toString();
	});

	it("should delete course and associated ratings and components", async () => {
		const res = await request(app).delete(`/api/courses/${courseId}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe(
			"Course and associated data deleted successfully."
		);

		const course = await Course.findById(courseId);
		expect(course).toBeNull();

		const rating = await Rating.findById(ratingId);
		expect(rating).toBeNull();
	});

	it("should return 404 if course not found", async () => {
		const nonExistentUserId = new mongoose.Types.ObjectId();
		const res = await request(app).delete(`/api/courses/${nonExistentUserId}`);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("Course entry not found.");
	});
});
