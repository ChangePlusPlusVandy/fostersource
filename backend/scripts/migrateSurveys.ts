import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Survey from "../models/surveyModel";
import Course from "../models/courseModel";
import SurveyResponse from "../models/surveyResponseModel";

async function migrate() {
	const uri = process.env.MONGO_URI;
	if (!uri) {
		console.error("MONGO_URI not set in .env");
		process.exit(1);
	}

	await mongoose.connect(uri);
	console.log("Connected to MongoDB");

	// --- Before counts ---
	const surveyCount = await Survey.countDocuments();
	const courseCount = await Course.countDocuments();
	const responseCount = await SurveyResponse.countDocuments();
	console.log(`\nBefore migration:`);
	console.log(`  Surveys: ${surveyCount}`);
	console.log(`  Courses: ${courseCount}`);
	console.log(`  SurveyResponses: ${responseCount}`);

	// --- Step 1: Find or create the survey ---
	let survey = await Survey.findOne();

	if (!survey) {
		console.log("\nNo existing survey found. Creating empty General Survey...");
		survey = new Survey({
			name: "General Survey",
			questions: [],
			courseIds: [],
			version: 1,
			parentSurveyId: null,
			isActive: true,
		});
		await survey.save();
	} else {
		console.log(`\nFound existing survey: ${survey._id}`);
		// Update with new fields (won't overwrite if already set)
		survey.name = survey.name || "General Survey";
		survey.version = survey.version || 1;
		survey.isActive = survey.isActive ?? true;
		survey.parentSurveyId = survey.parentSurveyId || null;
		await survey.save();
		console.log(
			`  Updated survey with name="${survey.name}", version=${survey.version}`
		);
	}

	// --- Step 2: Link all courses to this survey ---
	const courses = await Course.find();
	const courseIds: mongoose.Types.ObjectId[] = [];

	for (const course of courses) {
		if (!course.surveyId) {
			course.surveyId = survey._id as mongoose.Types.ObjectId;
			await course.save();
			console.log(
				`  Linked course "${course.className}" -> survey ${survey._id}`
			);
		} else {
			console.log(
				`  Course "${course.className}" already has surveyId=${course.surveyId}, skipping`
			);
		}
		courseIds.push(course._id as mongoose.Types.ObjectId);
	}

	// Update the survey's courseIds
	survey.courseIds = courseIds;
	await survey.save();
	console.log(`  Set survey.courseIds to ${courseIds.length} courses`);

	// --- Step 3: Backfill SurveyResponses ---
	const responsesWithoutSurveyId = await SurveyResponse.countDocuments({
		$or: [{ surveyId: null }, { surveyId: { $exists: false } }],
	});

	console.log(
		`\n  Found ${responsesWithoutSurveyId} responses without surveyId`
	);

	if (responsesWithoutSurveyId > 0) {
		const result = await SurveyResponse.updateMany(
			{ $or: [{ surveyId: null }, { surveyId: { $exists: false } }] },
			{ $set: { surveyId: survey._id } }
		);
		console.log(
			`  Updated ${result.modifiedCount} responses with surveyId=${survey._id}`
		);
		console.log(
			`  Note: courseId left as null — these will show as "Unknown Course" in analytics`
		);
	}

	// --- Validation ---
	const afterSurveys = await Survey.countDocuments();
	const coursesWithSurvey = await Course.countDocuments({
		surveyId: { $ne: null },
	});
	const responsesWithSurvey = await SurveyResponse.countDocuments({
		surveyId: { $ne: null },
	});
	const responsesStillMissing = await SurveyResponse.countDocuments({
		$or: [{ surveyId: null }, { surveyId: { $exists: false } }],
	});

	console.log(`\nAfter migration:`);
	console.log(`  Surveys: ${afterSurveys}`);
	console.log(`  Courses with surveyId: ${coursesWithSurvey}/${courseCount}`);
	console.log(
		`  Responses with surveyId: ${responsesWithSurvey}/${responseCount}`
	);
	console.log(`  Responses without surveyId: ${responsesStillMissing}`);

	if (responsesStillMissing > 0) {
		console.warn("\n⚠️  Some responses still missing surveyId!");
	} else {
		console.log("\n✅ Migration complete!");
	}

	await mongoose.disconnect();
}

migrate().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
