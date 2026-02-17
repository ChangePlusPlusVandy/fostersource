import { Worker } from "bullmq";
import { Redis } from "ioredis";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Email from "../models/emailModel";
import User from "../models/userModel";
import { sendEmail } from "../config/resend";
import Course, { ICourse } from "../models/courseModel";
import connectDB from "../config/db";
import "../models/courseModel";
import { emailQueue } from "../jobs/emailQueue";

dotenv.config();

const connection = new Redis(process.env.REDIS_URL!, {
	maxRetriesPerRequest: null,
});

const recoverMissedEmails = async () => {
	const unsentEmails = await Email.find({
		sendDate: { $lt: new Date() },
		wasSent: false,
	});

	for (const email of unsentEmails) {
		const emailId = (email._id as mongoose.Types.ObjectId).toString();
		console.log("🔁 Re-queuing missed email:", emailId);

		const existingJob = await emailQueue.getJob(emailId);
		if (existingJob) {
			await existingJob.remove();
			console.log("🗑️ Removed old job for:", emailId);
		}

		await emailQueue.add(
			"send-course-email",
			{ emailId },
			{
				jobId: emailId,
				delay: 0, // Send immediately since it's overdue
			}
		);
		console.log("📬 Re-added job for:", emailId);
	}
};

(async () => {
	await connectDB();
	await recoverMissedEmails();

	const worker = new Worker(
		"emailQueue",
		async (job) => {
			try {
				console.log("📦 Worker picked up job:", job.id, job.data);

				if (job.name === "waitlist-confirmation") {
					const { userId, courseId } = job.data;
					const [user, course] = await Promise.all([
						User.findById(userId),
						Course.findById(courseId),
					]);
					if (user && course) {
						await sendEmail(
							user.email,
							`You are waitlisted for ${course.className}`,
							`<p>Hi {{name}},</p><p>You have been added to the waitlist for {{course}}. We'll email you if a seat opens.</p>`,
							{ name: user.name, course: course.className }
						);
					}
					return;
				}

				if (job.name === "waitlist-promotion") {
					const { userId, courseId } = job.data;
					const [user, course] = await Promise.all([
						User.findById(userId),
						Course.findById(courseId),
					]);
					if (user && course) {
						await sendEmail(
							user.email,
							`You're in! ${course.className}`,
							`<p>Hi {{name}},</p><p>A seat opened up and you are now enrolled in {{course}}.</p>`,
							{ name: user.name, course: course.className }
						);
					}
					return;
				}

				if (job.name === "registration-confirmation") {
					const { userId, courseId } = job.data;
					const [user, course] = await Promise.all([
						User.findById(userId),
						Course.findById(courseId),
					]);
					if (user && course) {
						await sendEmail(
							user.email,
							`Registered for ${course.className}`,
							`<p>Hi {{name}},</p><p>You are registered for {{course}}.</p>`,
							{ name: user.name, course: course.className }
						);
					}
					return;
				}

				if (job.name === "course-reminder") {
					console.log("course-reminder ");
					return;
				}

				if (job.name === "speaker-assignment") {
					console.log("speaker-assignment");
					return;
				}

				if (job.name !== "send-course-email") {
					console.log(`No handler for job type '${job.name}', skipping.`);
					return;
				}

				const email = await Email.findById(job.data.emailId).populate("course");
				if (!email) {
					console.warn("⚠️ Email not found for ID:", job.data.emailId);
					return;
				}

				const course = email.course as ICourse;
				const users = await User.find({ _id: { $in: course.students } });

				console.log(
					`👥 Sending to ${users.length} users for course ${course.className}`
				);

				for (const user of users) {
					await sendEmail(user.email, email.subject, email.body, {
						name: user.name,
						course: course.className,
						courselink: `https://yourapp.org/courses/${email.course._id}`,
					});
					console.log(`📧 Sent to ${user.email}`);
				}

				await Email.findByIdAndUpdate(email._id, { wasSent: true });
				console.log(`✅ Email marked as sent: ${email.subject}`);
			} catch (error) {
				console.error("❌ Worker error:", error);
			}
		},
		{ connection }
	);
})();
