import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Handout from "../models/handoutModel";

const handoutData1 = {
    courseId: new mongoose.Types.ObjectId().toString(),
    fileUrl: "https://example.com/handout1.pdf",
    fileType: "pdf"
};

const handoutData2 = {
    courseId: new mongoose.Types.ObjectId().toString(),
    fileUrl: "https://example.com/handout2.doc",
    fileType: "doc"
};

const incompleteHandoutData = {
    fileUrl: "https://example.com/handout.pdf"
};

describe("GET /api/handouts", () => {
    beforeEach(async () => {
        await Handout.create([handoutData1, handoutData2]);
    });

    it("should retrieve all handouts", async () => {
        const res = await request(app).get("/api/handouts");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBe(2);
    });

    it("should retrieve handouts by courseId", async () => {
        const res = await request(app)
            .get("/api/handouts")
            .query({ courseId: handoutData1.courseId });
        expect(res.statusCode).toBe(200);
        res.body.data.forEach((handout: any) => {
            expect(handout.courseId).toBe(handoutData1.courseId);
        });
        expect(res.body.count).toBe(1);
    });
});

describe("POST /api/handouts", () => {
    it("should fail to create a new handout if missing required fields", async () => {
        const res = await request(app)
            .post("/api/handouts")
            .send(incompleteHandoutData);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
            "Please provide courseId, fileUrl, and fileType"
        );
    });

    it("should create a new handout if all required fields are provided", async () => {
        const res = await request(app)
            .post("/api/handouts")
            .send(handoutData1);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.courseId).toBe(handoutData1.courseId);
        expect(res.body.data.fileUrl).toBe(handoutData1.fileUrl);
        expect(res.body.data.fileType).toBe(handoutData1.fileType);
    });
});

describe("PUT /api/handouts/:id", () => {
    let handoutId: string;

    beforeEach(async () => {
        const handout = await Handout.create(handoutData1);
        handoutId = (handout._id as mongoose.Types.ObjectId).toString();
    });

    it("should update a handout", async () => {
        const updates = {
            fileUrl: "https://example.com/updated-handout.pdf",
            fileType: "pdf"
        };

        const res = await request(app)
            .put(`/api/handouts/${handoutId}`)
            .send(updates);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.fileUrl).toBe(updates.fileUrl);
        expect(res.body.data.fileType).toBe(updates.fileType);
    });

    it("should return 404 if handout is not found", async () => {
        const invalidHandoutId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/handouts/${invalidHandoutId}`)
            .send({ fileUrl: "https://example.com/new.pdf" });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Handout with id ${invalidHandoutId} not found`);
    });
});

describe("DELETE /api/handouts/:id", () => {
    let handoutId: string;

    beforeEach(async () => {
        const handout = await Handout.create(handoutData1);
        handoutId = (handout._id as mongoose.Types.ObjectId).toString();
    });

    it("should delete a handout", async () => {
        const res = await request(app).delete(`/api/handouts/${handoutId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const handout = await Handout.findById(handoutId);
        expect(handout).toBeNull();
    });

    it("should return 404 if handout not found", async () => {
        const nonExistentHandoutId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/handouts/${nonExistentHandoutId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Handout with id ${nonExistentHandoutId} not found`);
    });
});