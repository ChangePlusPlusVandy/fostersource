import request from "supertest";
import app from "../app";
import Handout from "../models/handoutModel";
import mongoose from "mongoose";

// Mock Handout model
jest.mock("../models/handoutModel");

const mockHandout = Handout as jest.Mocked<typeof Handout>;

const handoutData1 = {
    _id: new mongoose.Types.ObjectId(),
    courseId: "CSE101",
    fileUrl: "https://example.com/handout1.pdf",
    fileType: "pdf",
};

const handoutData2 = {
    _id: new mongoose.Types.ObjectId(),
    courseId: "CSE102",
    fileUrl: "https://example.com/handout2.pdf",
    fileType: "docx",
};

describe("GET /api/handouts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve all handouts", async () => {
        mockHandout.find.mockResolvedValue([handoutData1, handoutData2]);

        const res = await request(app).get("/api/handouts");
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(2);
        expect(mockHandout.find).toHaveBeenCalledWith({});
    });

    it("should retrieve handouts filtered by courseId", async () => {
        mockHandout.find.mockResolvedValue([handoutData1]);

        const res = await request(app).get("/api/handouts").query({ courseId: "CSE101" });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].courseId).toBe("CSE101");
        expect(mockHandout.find).toHaveBeenCalledWith({ courseId: "CSE101" });
    });
});

describe("POST /api/handouts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new handout", async () => {
        const newHandout = {
            courseId: "CSE103",
            fileUrl: "https://example.com/handout3.pdf",
            fileType: "pdf",
        };

        mockHandout.prototype.save.mockResolvedValue({ ...newHandout, _id: new mongoose.Types.ObjectId() });

        const res = await request(app).post("/api/handouts").send(newHandout);
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.courseId).toBe("CSE103");
    });

    it("should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/handouts").send({
            courseId: "CSE104",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Please provide courseId, fileUrl, and fileType");
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

        const res = await request(app).put(`/api/handouts/${handoutData1._id}`).send(updates);
        
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
        mockHandout.findByIdAndUpdate.mockResolvedValue(null);

        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/handouts/${nonExistentId}`)
            .send({ fileUrl: "new.pdf", fileType: "pdf" });
            
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
        mockHandout.findByIdAndDelete.mockResolvedValue(handoutData2);

        const res = await request(app).delete(`/api/handouts/${handoutData2._id}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeTruthy();
        expect(mockHandout.findByIdAndDelete).toHaveBeenCalledWith(handoutData2._id.toString());
    });

    it("should return 404 if handout is not found", async () => {
        mockHandout.findByIdAndDelete.mockResolvedValue(null);

        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/handouts/${nonExistentId}`);
        
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe(`Handout with id ${nonExistentId} not found`);
    });
});