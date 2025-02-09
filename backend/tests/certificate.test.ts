import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Certificate from "../models/certificateModel";

const certificateData = {
    name: "John Doe",
    courseTitle: "Advanced Programming",
    creditHours: 40,
    dateCompleted: new Date("2024-01-15"),
};

describe("Certificate API Tests", () => {

    beforeAll(() => {
        jest.setTimeout(20000);
    });

    let certificateId: string;

    beforeEach(async () => {
        const certificate = await Certificate.create(certificateData) as mongoose.Document & { _id: mongoose.Types.ObjectId };
        certificateId = certificate._id.toString();
    });

    afterEach(async () => {
        await Certificate.findByIdAndDelete(certificateId);
    });

    describe("GET /api/certificates", () => {
        it("should retrieve all certificates", async () => {
            const res = await request(app).get("/api/certificates");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe("POST /api/certificates", () => {
        it("should create a new certificate", async () => {
            const newCertificate = {
                name: "Jane Doe",
                courseTitle: "Machine Learning",
                creditHours: 50,
                dateCompleted: new Date("2024-02-20"),
            };
            const res = await request(app).post("/api/certificates").send(newCertificate);
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe("Jane Doe");
            expect(res.body.courseTitle).toBe("Machine Learning");
            await Certificate.findByIdAndDelete(res.body._id);
        });
    });

    describe("PUT /api/certificates/:id", () => {
        it("should update an existing certificate", async () => {
            const updates = { courseTitle: "Updated Course Title" };
            const res = await request(app)
                .put(`/api/certificates/${certificateId}`)
                .send(updates);
            expect(res.statusCode).toBe(200);
            expect(res.body.courseTitle).toBe("Updated Course Title");
        });

        it("should return 404 if certificate is not found", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/api/certificates/${nonExistentId}`)
                .send({ courseTitle: "Non-existent" });
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Certificate not found");
        });
    });

    describe("DELETE /api/certificates/:id", () => {
        it("should delete a certificate", async () => {
            const res = await request(app).delete(`/api/certificates/${certificateId}`);
            expect(res.statusCode).toBe(200);

            const deletedCertificate = await Certificate.findById(certificateId);
            expect(deletedCertificate).toBeNull();
        });

        it("should return 404 if certificate is not found", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/api/certificates/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Certificate not found");
        });
    });
});
