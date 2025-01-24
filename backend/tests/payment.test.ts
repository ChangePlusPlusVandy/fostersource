import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Payment from "../models/paymentModel";
import User from "../models/userModel";
import jwt from "jsonwebtoken";

describe("GET /api/payments", () => {
	beforeEach(async () => {
		await Payment.create([
			{
				userId: new mongoose.Types.ObjectId(),
				date: new Date("2023-01-01T00:00:00.000Z"),
				amount: 123456789,
				memo: "Big Chungus was here",
			},
			{
				userId: new mongoose.Types.ObjectId(),
				date: new Date(),
				amount: 1,
				memo: "Big Chungus only had one dollar left",
			},
		]);
	});

	it("should retrieve all payments", async () => {
		const res = await request(app).get("/api/payments");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBe(2);
	});

	it("should retrieve payments by amount", async () => {
		const res = await request(app)
			.get("/api/payments")
			.query({ minAmount: 0, maxAmount: 1 });
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(1);
	});

	it("should retrieve payments by date", async () => {
		const res = await request(app)
			.get("/api/payments")
			.query({
				startDate: new Date("2023-01-01T00:00:00.000Z"),
				endDate: new Date("2023-02-01T00:00:00.000Z"),
			});
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(1);
	});
});

describe("POST /api/payments", () => {
	it("should create a payment and save automatically to user", async () => {
		const user = await User.create({
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
		});
		const resPayment = await request(app).post("/api/payments").send({
			userId: user._id,
			date: new Date(),
			amount: 123456789,
			memo: "Big Chungus was here",
		});
		expect(resPayment.statusCode).toBe(201);
		expect(resPayment.body.amount).toBe(123456789);

		const resUser = await request(app)
			.post("/api/users")
			.send({ firebaseId: 12345 });
		expect(resUser.body.user.payments.length).toBe(1);
	});

	it("should prevent creation of payment without all info", async () => {
		const res = await request(app).post("/api/payments").send({
			userId: new mongoose.Types.ObjectId(),
			date: new Date(),
			amount: 123456789,
		});
		expect(res.status).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe(
			"Please provide userId, date, amount, and memo."
		);
	});
});

describe("PUT /api/payments/:id", () => {
	let paymentId: string;
	beforeEach(async () => {
		const payment = await Payment.create<any>({
			userId: new mongoose.Types.ObjectId(),
			date: new Date(),
			amount: 123456789,
			memo: "Big Chungus was here",
		});
		paymentId = (payment._id as mongoose.Types.ObjectId).toString();
	});

	it("should update a payment", async () => {
		const updates = { amount: 987654321 };

		const res = await request(app)
			.put(`/api/payments/${paymentId}`)
			.send(updates);
		expect(res.statusCode).toBe(200);
		expect(res.body.amount).toBe(987654321);
	});

	it("should return 404 if payment is not found", async () => {
		const nonExistentPaymentId = new mongoose.Types.ObjectId();
		const res = await request(app)
			.put(`/api/payments/${nonExistentPaymentId}`)
			.send({ amount: 987654321 });
		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe("Payment not found.");
	});
});

describe("DELETE /api/payments/:id", () => {
	let userId: string;
	let paymentId: string;
	beforeEach(async () => {
		const user = await User.create<any>({
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
		});
		userId = (user._id as mongoose.Types.ObjectId).toString();

		const payment = await Payment.create<any>({
			userId: userId,
			date: new Date(),
			amount: 123456789,
			memo: "Big Chungus was here",
		});
		paymentId = (payment._id as mongoose.Types.ObjectId).toString();
	});

	it("should delete a payment and no longer exist in user", async () => {
		const resPayment = await request(app).delete(`/api/payments/${paymentId}`);
		expect(resPayment.statusCode).toBe(200);

		const resUser = await request(app)
			.post("/api/users")
			.send({ firebaseId: 12345 });
		expect(resUser.body.user.payments.length).toBe(0);
	});

	it("should return 404 if payment is not found", async () => {
		const nonExistentPaymentId = new mongoose.Types.ObjectId();
		const res = await request(app)
			.delete(`/api/payments/${nonExistentPaymentId}`)
			.send({ amount: 987654321 });
		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe("Payment not found.");
	});
});
