import { Request, Response } from "express";
import SurveyResponse from "../models/surveyResponseModel";
import QuestionResponse from "../models/questionResponseModel";

// @desc    Get all survey responses or filter by query parameters
// @route   GET /api/surveyResponses
// @access  Public
export const getSurveyResponses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, startDate, endDate } = req.query;

    let filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

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
// @access  Public
export const createSurveyResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // answers are a list of QuestionResponse IDs and QuestionResponse objects must be created first before calling this endpoint
    const { userId, dateCompleted, answers } = req.body;

    if (!userId || !dateCompleted || !answers || answers.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please provide userId, dateCompleted, and answers.",
      });
      return;
    }

    const newSurveyResponse = new SurveyResponse({
      userId,
      dateCompleted,
      answers,
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

// @desc    Delete a survey response
// @route   DELETE /api/surveyResponses/:id
// @access  Public
export const deleteSurveyResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const surveyResponse = await SurveyResponse.findById(id);

    if (!surveyResponse) {
      res.status(404).json({
        success: false,
        message: "Survey response not found.",
      });
      return;
    }

    await QuestionResponse.deleteMany({ _id: { $in: surveyResponse.answers } });

    await SurveyResponse.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message:
        "Survey response and associated question responses deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal service error.",
    });
  }
};
