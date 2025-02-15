import request from "supertest";
import app from "../app";
import Handout from "../models/handoutModel";
import mongoose from "mongoose";

// Mock the Handout model
jest.mock("../models/handoutModel");
const mockHandout = Handout as jest.Mocked<typeof Handout>;

const handoutData1 = {
    _id: new mongoose.Types.ObjectId(),
    courseId: "COURSE101",
    fileUrl: "https://example.com/handout1.pdf",
    fileType: "pdf"
};

const handoutData2 = {
    _id: new mongoose.Types.ObjectId(),
    courseId: "COURSE102",
    fileUrl: "https://example.com/handout2.docx",
    fileType: "docx"
};

describe("GET /api/handouts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve all handouts", async () => {
        mockHandout.find.mockResolvedValue([handoutData1, handoutData2]);

        const res = await request(app).get("/api/handouts");
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(2);
        expect(mockHandout.find).toHaveBeenCalledWith({});
    });

    it("should retrieve handouts filtered by courseId", async () => {
        mockHandout.find.mockResolvedValue([handoutData1]);

        const res = await request(app)
            .get("/api/handouts")
            .query({ courseId: "COURSE101" });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].courseId).toBe("COURSE101");
        expect(mockHandout.find).toHaveBeenCalledWith({ courseId: "COURSE101" });
    });

    it("should handle server errors", async () => {
        mockHandout.find.mockRejectedValue(new Error("Database error"));

        const res = await request(app).get("/api/handouts");

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Server Error");
    });
});

describe("POST /api/handouts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new handout", async () => {
        const newHandoutData = {
            courseId: "COURSE103",
            fileUrl: "https://example.com/handout3.pdf",
            fileType: "pdf"
        };

        // Mock the save method
        mockHandout.prototype.save.mockResolvedValue({
            _id: new mongoose.Types.ObjectId(),
            ...newHandoutData
        });

        const res = await request(app)
            .post("/api/handouts")
            .send(newHandoutData);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.courseId).toBe(newHandoutData.courseId);
    });

    it("should return 400 if required fields are missing", async () => {
        const incompleteData = {
            courseId: "COURSE103"
            // Missing fileUrl and fileType
        };

        const res = await request(app)
            .post("/api/handouts")
            .send(incompleteData);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Please provide courseId, fileUrl, and fileType");
    });

    it("should handle server errors during creation", async () => {
        const newHandoutData = {
            courseId: "COURSE103",
            fileUrl: "https://example.com/handout3.pdf",
            fileType: "pdf"
        };

        mockHandout.prototype.save.mockRejectedValue(new Error("Database error"));

        const res = await request(app)
            .post("/api/handouts")
            .send(newHandoutData);

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Server Error");
    });
});

describe("PUT /api/handouts/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update an existing handout", async () => {
        const updates = {
            fileUrl: "https://example.com/updated.pdf",
            fileType: "pdf"
        };

        mockHandout.findByIdAndUpdate.mockResolvedValue({
            ...handoutData1,
            ...updates
        });

        const res = await request(app)
            .put(`/api/handouts/${handoutData1._id}`)
            .send(updates);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.fileUrl).toBe(updates.fileUrl);
        expect(mockHandout.findByIdAndUpdate).toHaveBeenCalledWith(
            handoutData1._id.toString(),
            updates,
            { new: true, runValidators: true }
        );
    });

    it("should return 404 if handout is not found", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        mockHandout.findByIdAndUpdate.mockResolvedValue(null);

        const res = await request(app)
            .put(`/api/handouts/${nonExistentId}`)
            .send({ fileUrl: "https://example.com/new.pdf", fileType: "pdf" });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe(`Handout with id ${nonExistentId} not found`);
    });
});

describe("DELETE /api/handouts/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete an existing handout", async () => {
        mockHandout.findByIdAndDelete.mockResolvedValue(handoutData1);

        const res = await request(app)
            .delete(`/api/handouts/${handoutData1._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeTruthy();
        expect(mockHandout.findByIdAndDelete).toHaveBeenCalledWith(
            handoutData1._id.toString()
        );
    });

    it("should return 404 if handout to delete is not found", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        mockHandout.findByIdAndDelete.mockResolvedValue(null);

        const res = await request(app)
            .delete(`/api/handouts/${nonExistentId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe(`Handout with id ${nonExistentId} not found`);
    });

    it("should handle server errors during deletion", async () => {
        mockHandout.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

        const res = await request(app)
            .delete(`/api/handouts/${handoutData1._id}`);

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Server Error");
    });
});