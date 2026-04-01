import { Request, Response } from "express";
import Survey, { ISurvey } from "../models/surveyModel";
import Course from "../models/courseModel";
import SurveyResponse from "../models/surveyResponseModel";

// @desc Get all active surveys
// @route GET /api/surveys?courseId=
export const getSurveys = async(req: Request, res: Response): Promise<void> => {
	try {
		const { courseId } = req.query;
		const filter: any = {isActive: true};
		if (courseId) filter.courseIds = courseId;

		const surveys = await Survey.find(filter).populate({
			path: "questions",
			model: "Question",
		});

		res.status(200).json({success: true, data: surveys});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({success: false, message: error.message});
		} else {
			res.status(500).json({success: false, message: "Internal service error."});
		}
	}
};

// @desc Get survey by ID
// @route GET /api/surveys/:id
export const getSurveyById = async(req: Request, res: Response): Promise<void> => {
	try {
		const survey = await Survey.findById(req.params.id).populate({
			path: "questions",
			model: "Question",
		});

		if (!survey) {
			res.status(404).json({success: false, message: "Survey not found."});
			return;
		}
		
		res.status(200).json({survey});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({success: false, message: error.message});
		} else {
			res.status(500).json({success: false, message: "Internal service error."});
		}
	}
};

// @desc Create new survey
// @route POST /api/surveys
export const createSurvey = async(req: Request, res: Response): Promise<void> => {
	try {
		const { name, questions, courseIds } = req.body;

		if (!name || !questions) {
			res.status(400).json({success: false, message: "Name and questions are required."});
			return;
		}
		
		const survey = new Survey({
			name,
			questions,
			courseIds: courseIds || [],
			version: 1,
			isActive: true,
		});
		await survey.save();

		// update each linked course's surveyId
		if (courseIds && courseIds.length > 0) {
			await Course.updateMany(
				{ _id: { $in: courseIds } },
				{ surveyId: survey._id }
			);
		}

		res.status(201).json({success: true, data: survey});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({success: false, message: error.message});
		} else {
			res.status(500).json({success: false, message: "Internal service error."});
		}
	}
};

// @desc Update survey (copy-on-write versioning if responses exist)
// @route PUT /api/surveys/:id
// @body { name?, questions?, courseIdsToUpdate?: string[] }
//
// courseIdsToUpdate controls which courses get the new version.
// Courses not listed keep pointing to the old version.
// If omitted, All linked courses will get the new version.
export const updateSurvey = async(req: Request, res: Response) : Promise<void> => {
	try {
		const {name, questions, courseIdsToUpdate} = req.body;
		const survey = await Survey.findById(req.params.id);

		if (!survey) {
			res.status(404).json({success: false, message: "Survey not found."});
			return;
		}

		// Check if there are existing responses for this survey
		const responseCount = await SurveyResponse.countDocuments({surveyId: survey._id});

		if (responseCount === 0) {
			// No responses, safe to update in place
			if (name) survey.name = name;
			if (questions) survey.questions = questions;

			await survey.save();

			const populated = await survey.populate({ path: "questions", model: "Question" });
			res.status(200).json({success: true, data: populated});
			return;
		}

		const coursesToUpdate = courseIdsToUpdate || survey.courseIds.map(id => id.toString());

		const coursesStaying = survey.courseIds.map(id => id.toString()).filter(id => !coursesToUpdate.includes(id));

		const newSurvey = new Survey({
			name: name || survey.name,
			questions: questions || survey.questions,
			courseIds: coursesToUpdate,
			version: survey.version + 1,
			parentSurveyId: survey._id,
			isActive: true,
		});
		await newSurvey.save();

		// Deactive old survey if no courses remain, otherwise trim its courseIds
		if (coursesStaying.length === 0) {
			survey.isActive = false;
			survey.courseIds = [];
		} else {
			survey.courseIds = coursesStaying as any;
		}
		await survey.save();

		// Point updating courses to new survey
		await Course.updateMany(
			{ _id: { $in: coursesToUpdate } },
			{ surveyId: newSurvey._id }
		);

		const populated = await newSurvey.populate({ path: "questions", model: "Question" });
		res.status(200).json({success: true, data: populated});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({success: false, message: error.message});
		} else {
			res.status(500).json({success: false, message: "Internal service error."});
		}
	}
};

// @desc Delete survey
// @route DELETE /api/surveys/:id
export const deleteSurvey = async(req: Request, res: Response): Promise<void> => {
	try {
		const survey = await Survey.findById(req.params.id);

		if (!survey) {
			res.status(404).json({success: false, message: "Survey not found."});
			return;
		}

		// Unlink from courses
		await Course.updateMany({ surveyId: survey._id }, { surveyId: null });

		const responseCount = await SurveyResponse.countDocuments({surveyId: survey._id});
		if (responseCount > 0) {
			// If there are responses, just mark as inactive instead of deleting
			survey.isActive = false;
			survey.courseIds = [];
			await survey.save();
		} else {
			// No responses, safe to delete
			await Survey.deleteOne({ _id: survey._id });
		}

		res.status(200).json({success: true, message: "Survey deleted successfully."});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({success: false, message: error.message});
		} else {
			res.status(500).json({success: false, message: "Internal service error."});
		}
	}
};

// @desc Assign survey to course
// @route POST /api/surveys/:id/assign
// @body {courseId}
export const assignSurvey = async(req: Request, res: Response): Promise<void> => {
	try {
		const { courseId } = req.body;
		if (!courseId) {
			res.status(400).json({success: false, message: "courseId is required."});
			return;
		}

		const survey = await Survey.findById(req.params.id);
		if (!survey) {
			res.status(404).json({success: false, message: "Survey not found."});
			return;
		}

		// Add courseId, avoid duplicates
		if (!survey.courseIds.includes(courseId)) {
			survey.courseIds.push(courseId);
			await survey.save();
		}

		await Course.findByIdAndUpdate(courseId, { surveyId: survey._id });

		res.status(200).json({success: true, data: survey, message: "Survey assigned to course successfully."});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({success: false, message: error.message});
		} else {
			res.status(500).json({success: false, message: "Internal service error."});
		}
	}
};

// @desc    Unassign survey from a course
// @route   POST /api/surveys/:id/unassign
// @body    { courseId }
export const unassignSurvey = async (req: Request, res: Response): Promise<void> => {
	try {
		const { courseId } = req.body;
		if (!courseId) {
			res.status(400).json({ success: false, message: "courseId is required" });
			return;
		}
 
		const survey = await Survey.findById(req.params.id);
		if (!survey) {
			res.status(404).json({ success: false, message: "Survey not found" });
			return;
		}
 
		survey.courseIds = survey.courseIds.filter(
			(id: any) => id.toString() !== courseId
		) as any;
		await survey.save();
 
		await Course.findByIdAndUpdate(courseId, { surveyId: null });
		res.status(200).json({ success: true, data: survey });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ success: false, message: error.message });
		} else {
			res.status(500).json({ success: false, message: "An unknown error occurred" });
		}
	}
};



// @desc    Duplicate survey as independent copy
// @route   POST /api/surveys/:id/duplicate
// @body    { name?, courseId? }
export const duplicateSurvey = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, courseId } = req.body;
		const original = await Survey.findById(req.params.id);
 
		if (!original) {
			res.status(404).json({ success: false, message: "Survey not found" });
			return;
		}
 
		const duplicate = new Survey({
			name: name || `${original.name} (Copy)`,
			questions: [...original.questions],
			courseIds: courseId ? [courseId] : [],
			version: 1,
			isActive: true,
		});
		await duplicate.save();
 
		if (courseId) {
			await Course.findByIdAndUpdate(courseId, { surveyId: duplicate._id });
		}
 
		res.status(201).json({ success: true, data: duplicate });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ success: false, message: error.message });
		} else {
			res.status(500).json({ success: false, message: "An unknown error occurred" });
		}
	}
};
			