import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Email from "../models/emailModel";

const emailData1 = {
    title: "Welcome Email",
    body: "Welcome to our platform! We're excited to have you here."
};

const emailData2 = {
    title: "Course Reminder",
    body: "Don't forget about your upcoming course session tomorrow."
};

const incompleteEmailData = {
    title: "Incomplete Email"
};

describe("GET /api/emails", () => {
    beforeEach(async () => {
        await Email.create([emailData1, emailData2]);
    });

    afterEach(async () => {
        await Email.deleteMany({});
    });

    it("should retrieve all emails", async () => {
        const res = await request(app).get("/api/emails");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBe(2);
    });

    it("should retrieve emails by title", async () => {
        const res = await request(app)
            .get("/api/emails")
            .query({ title: "Welcome" });
        expect(res.statusCode).toBe(200);
        res.body.data.forEach((email: any) => {
            expect(email.title).toContain("Welcome");
        });
        expect(res.body.count).toBe(1);
    });
});

describe("GET /api/emails/:id", () => {
    let emailId: string;

    beforeEach(async () => {
        const email = await Email.create(emailData1);
        emailId = (email._id as mongoose.Types.ObjectId).toString();
    });

    afterEach(async () => {
        await Email.deleteMany({});
    });

    it("should retrieve a single email by id", async () => {
        const res = await request(app).get(`/api/emails/${emailId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe(emailData1.title);
        expect(res.body.data.body).toBe(emailData1.body);
    });

    it("should return 404 if email is not found", async () => {
        const nonExistentEmailId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/emails/${nonExistentEmailId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Email with id ${nonExistentEmailId} not found`);
    });
});

describe("POST /api/emails", () => {
    afterEach(async () => {
        await Email.deleteMany({});
    });

    it("should fail to create a new email if missing required fields", async () => {
        const res = await request(app)
            .post("/api/emails")
            .send(incompleteEmailData);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Please provide title and body");
    });

    it("should create a new email if all required fields are provided", async () => {
        const res = await request(app)
            .post("/api/emails")
            .send(emailData1);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.title).toBe(emailData1.title);
        expect(res.body.data.body).toBe(emailData1.body);
    });
});

describe("PUT /api/emails/:id", () => {
    let emailId: string;

    beforeEach(async () => {
        const email = await Email.create(emailData1);
        emailId = (email._id as mongoose.Types.ObjectId).toString();
    });

    afterEach(async () => {
        await Email.deleteMany({});
    });

    it("should update an email", async () => {
        const updates = {
            title: "Updated Welcome Email",
            body: "This is the updated welcome message!"
        };

        const res = await request(app)
            .put(`/api/emails/${emailId}`)
            .send(updates);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe(updates.title);
        expect(res.body.data.body).toBe(updates.body);
    });

    it("should return 404 if email is not found", async () => {
        const invalidEmailId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/emails/${invalidEmailId}`)
            .send({ title: "New Title", body: "New Body" });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Email with id ${invalidEmailId} not found`);
    });
});

describe("DELETE /api/emails/:id", () => {
    let emailId: string;

    beforeEach(async () => {
        const email = await Email.create(emailData1);
        emailId = (email._id as mongoose.Types.ObjectId).toString();
    });

    afterEach(async () => {
        await Email.deleteMany({});
    });

    it("should delete an email", async () => {
        const res = await request(app).delete(`/api/emails/${emailId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const email = await Email.findById(emailId);
        expect(email).toBeNull();
    });

    it("should return 404 if email not found", async () => {
        const nonExistentEmailId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/emails/${nonExistentEmailId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Email with id ${nonExistentEmailId} not found`);
    });
});