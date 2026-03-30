import { Request, Response } from "express";
import mongoose from "mongoose";
import SurveyResponse from "../models/surveyResponseModel";
import QuestionResponse from "../models/questionResponseModel";
import Survey from "../models/surveyModel";
import Course from "../models/courseModel";
import Question from "../models/questionModel";

// @desc    Get all survey responses or filter by query parameters
// @route   GET /api/surveyResponses?surveyId=&courseId=&userId=&startDate=&endDate=
// @access  Public
export const getSurveyResponses = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId, surveyId, courseId, startDate, endDate } = req.query;

		let filter: any = {};

		if (userId) filter.userId = userId;
		if (surveyId) filter.surveyId = surveyId;
		if (courseId) filter.courseId = courseId;

		if (startDate || endDate) {
			filter.dateCompleted = {};
			if (startDate) {
				filter.dateCompleted.$gte = new Date(startDate as string);
			}
			if (endDate) {
				filter.dateCompleted.$lte = new Date(endDate as string);
			}
		}

		const surveyResponses = await SurveyResponse.find(filter)
			.populate("answers")
			.populate("surveyId", "name version")
			.populate("courseId", "className")
			.exec();

		res.status(200).json({
			success: true,
			count: surveyResponses.length,
			data: surveyResponses,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// @desc    Create a new survey response
// @route   POST /api/surveyResponses
// @body    {userId, answers: string[], surveyId, courseId}
// @access  Public
export const createSurveyResponse = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// answers are a list of QuestionResponse IDs and QuestionResponse objects must be created first before calling this endpoint
		const { userId, answers, surveyId, courseId } = req.body;

		if (!userId || !answers || answers.length === 0) {
			res.status(400).json({
				success: false,
				message: "Please provide userId, and answers.",
			});
			return;
		}

		if (!surveyId || !courseId) {
			res.status(400).json({
				success: false,
				message: "Please provide surveyId and courseId.",
			});
			return;
		}


		const newSurveyResponse = new SurveyResponse({
			userId,
			answers,
			surveyId,
			courseId,
		});

		const savedSurveyResponse = await newSurveyResponse.save();

		res.status(201).json({
			success: true,
			data: savedSurveyResponse,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal service error.",
		});
	}
};

// No PUT request needed for now
// @desc    Update a survey response
// @route   PUT /api/surveyResponses/:id
// @access  Public
// export const updateSurveyResponse = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {};

// @desc    Delete a survey response and its question responses
// @route   DELETE /api/surveyResponses/:id
export const deleteSurveyResponse = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const surveyResponse = await SurveyResponse.findById(id);
 
		if (!surveyResponse) {
			res.status(404).json({ success: false, message: "Survey response not found." });
			return;
		}
 
		await QuestionResponse.deleteMany({ _id: { $in: surveyResponse.answers } });
		await SurveyResponse.deleteOne({ _id: id });
 
		res.status(200).json({
			success: true,
			message: "Survey response and associated question responses deleted.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal service error." });
	}
};

// @desc Get aggregated survey response statistics
// @route GET /api/surveyResponse/stats?surveyId=&courseId=
//
// Returns array of 
// {
//   surveyId, surveyName, surveyVersion,
//   courseId, courseName,
//   totalResponses,
//   questions: [{
//     questionId, questionText, answerType, options,
//     totalAnswered, breakdown: { "option": count }
//   }]
// }
export const getSurveyResponseStats = async (req: Request, res: Response): Promise<void> => {
	try {
		const { surveyId, courseId } = req.query;
		const matchStage: any = {};

		if (surveyId) matchStage.surveyId = new mongoose.Types.ObjectId(surveyId as string);
		if (courseId) matchStage.courseId = new mongoose.Types.ObjectId(courseId as string);

		// Group responses by survey + courses
		const grouped = await SurveyResponse.aggregate([
			{ $match: matchStage },
			{
				$group: {
					_id: { surveyId: "$surveyId", courseId: "$courseId" },
					totalResponses: { $sum: 1 },
				},
			},
		]);

		const results = [];

		for (const group of grouped) {
			const survey = await Survey.findById(group._id.surveyId).populate("questions");
			const course = group._id.courseId ? await Course.findById(group._id.courseId) : null;

			if (!survey) continue;

			// Get all QuestionResponse IDs for this survey+course combo
			const answerIds = await SurveyResponse.find({
				surveyId: group._id.surveyId,
				courseId: group._id.courseId,
			}).distinct("answers");

			// For each question in the survey, calculate breakdown of answers
			const questionStats = [];
			for (const question of survey.questions as any[]) {
				const questionResponses = await QuestionResponse.find({
					questionId: question._id,
					_id: { $in: answerIds },
				});

				const breakdown: Record<string, number> = {};
				for (const qr of questionResponses) {
					const parts = question.answerType === "Multi-select"
						? qr.answer.split(",").map((a: string) => a.trim())
						: [qr.answer];
					for (const part of parts) {
						breakdown[part] = (breakdown[part] || 0) + 1;
					}
				}
 
				questionStats.push({
					questionId: question._id,
					questionText: question.question,
					answerType: question.answerType,
					options: question.answers || [],
					totalAnswered: questionResponses.length,
					breakdown,
				});
			}
 
			results.push({
				surveyId: group._id.surveyId,
				surveyName: survey.name,
				surveyVersion: survey.version,
				courseId: group._id.courseId,
				courseName: course?.className || "Unknown Course",
				totalResponses: group.totalResponses,
				questions: questionStats,
			});
		}
 
		res.status(200).json({ success: true, data: results });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal service error." });
	}
};

// @desc    Export survey responses as CSV
// @route   GET /api/surveyResponses/export?surveyId=&courseId=&format=row-per-response|row-per-answer
export const exportSurveyResponses = async (req: Request, res: Response): Promise<void> => {
	try {
		const { surveyId, courseId, format = "row-per-response" } = req.query;
		const filter: any = {};
 
		if (surveyId) filter.surveyId = surveyId;
		if (courseId) filter.courseId = courseId;
 
		const responses = await SurveyResponse.find(filter)
			.populate("answers")
			.populate("surveyId", "name questions")
			.populate("courseId", "className")
			.exec();
 
		// Collect all surveys referenced
		const surveyIds = [...new Set(responses.map((r: any) => r.surveyId?._id?.toString()).filter(Boolean))];
		const surveys = await Survey.find({ _id: { $in: surveyIds } }).populate("questions");
		const surveyMap = new Map(surveys.map((s: any) => [s._id.toString(), s]));
 
		// Helper to escape CSV cells
		const escapeCell = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;
 
		if (format === "row-per-answer") {
			// Normalized: one row per question-answer pair
			const headers = [
				"SurveyName", "CourseName", "UserId", "SubmittedAt",
				"QuestionId", "QuestionText", "AnswerType", "Answer",
			];
 
			const rows: string[][] = [];
			for (const resp of responses as any[]) {
				const surveyName = resp.surveyId?.name || "Unknown";
				const courseName = resp.courseId?.className || "Unknown";
 
				for (const answer of resp.answers) {
					const question = await Question.findById(answer.questionId);
					rows.push([
						surveyName, courseName, resp.userId,
						resp.createdAt?.toISOString() || "",
						answer.questionId?.toString() || "",
						question?.question || "",
						question?.answerType || "",
						answer.answer || "",
					]);
				}
			}
 
			const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCell).join(","))].join("\n");
 
			res.setHeader("Content-Type", "text/csv");
			res.setHeader("Content-Disposition", "attachment; filename=survey_responses.csv");
			res.status(200).send(csv);
		} else {
			// Row per response: one row per user, questions as columns
			const allQuestions: any[] = [];
			const seen = new Set<string>();
			for (const survey of surveys) {
				for (const q of survey.questions as any[]) {
					if (!seen.has(q._id.toString())) {
						seen.add(q._id.toString());
						allQuestions.push(q);
					}
				}
			}
 
			const headers = [
				"SurveyName", "CourseName", "UserId", "SubmittedAt",
				...allQuestions.map((q, i) => `${i + 1}. ${q.question}`),
			];
 
			const rows: string[][] = [];
			for (const resp of responses as any[]) {
				const surveyName = resp.surveyId?.name || "Unknown";
				const courseName = resp.courseId?.className || "Unknown";
 
				const answerMap = new Map<string, string>();
				for (const answer of resp.answers) {
					answerMap.set(answer.questionId?.toString() || "", answer.answer || "");
				}
 
				rows.push([
					surveyName, courseName, resp.userId,
					resp.createdAt?.toISOString() || "",
					...allQuestions.map((q) => answerMap.get(q._id.toString()) || ""),
				]);
			}
 
			const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCell).join(","))].join("\n");
 
			res.setHeader("Content-Type", "text/csv");
			res.setHeader("Content-Disposition", "attachment; filename=survey_responses.csv");
			res.status(200).send(csv);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Internal service error." });
	}
};