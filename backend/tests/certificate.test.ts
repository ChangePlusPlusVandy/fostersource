import request from "supertest";
import app from "../app";
import Certificate from "../models/certificateModel";
import mongoose from "mongoose";

jest.setTimeout(10000);

const certificateData = {
    name: "John Doe",
    courseTitle: "Course A",
    creditHours: 3,
    dateCompleted: new Date(),
};

describe("Certificate API", () => {
    beforeEach(async () => {
        await Certificate.deleteMany({});
    });

    describe("POST /api/certificates", () => {
        it("should create a new certificate", async () => {
            const res = await request(app)
                .post("/api/certificates")
                .send(certificateData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(certificateData.name);
            expect(res.body.data.courseTitle).toBe(certificateData.courseTitle);
            expect(res.body.data.creditHours).toBe(certificateData.creditHours);
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/certificates")
                .send({ name: "John Doe" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Required fields are missing.");
        });
    });

    describe("GET /api/certificates", () => {
        it("should retrieve all certificates", async () => {
            await Certificate.create(certificateData); 

            const res = await request(app).get("/api/certificates");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].name).toBe(certificateData.name);
        });
    });

    describe("PUT /api/certificates/:id", () => {
        let certificateId: string;

        beforeEach(async () => {
            const certificate = await Certificate.create(certificateData);
            certificateId = (certificate._id as mongoose.Types.ObjectId).toString();
        });

        it("should update an existing certificate", async () => {
            const updates = { courseTitle: "Updated Course Title" };

            const res = await request(app)
                .put(`/api/certificates/${certificateId}`)
                .send(updates);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.courseTitle).toBe(updates.courseTitle);
        });

        it("should return 404 if certificate is not found", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/api/certificates/${nonExistentId}`)
                .send({ courseTitle: "Non-existent Course" });

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Certificate not found.");
        });
    });

    describe("DELETE /api/certificates/:id", () => {
        let certificateId: string;

        beforeEach(async () => {
            const certificate = await Certificate.create(certificateData);
            certificateId = (certificate._id as mongoose.Types.ObjectId).toString();
        });

        it("should delete an existing certificate", async () => {
            const res = await request(app).delete(`/api/certificates/${certificateId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Certificate deleted successfully.");

            // Verify that the certificate is deleted
            const deletedCertificate = await Certificate.findById(certificateId);
            expect(deletedCertificate).toBeNull();
        });

        it("should return 404 if certificate is not found", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/api/certificates/${nonExistentId}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Certificate not found.");
        });
    });
}); 