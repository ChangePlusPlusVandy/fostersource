import { Request, Response } from "express";
import Survey, { ISurvey } from "../models/surveyModel";

// @desc    Get the single survey
// @route   GET /api/surveys
// @access  Public
export const getSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use `findOneAndUpdate` to find the survey and create one if it doesn't exist
    const survey = await Survey.findOneAndUpdate(
      {},  // Find the first document (survey)
      { $setOnInsert: { questions: [] } },  // If no document is found, insert a new one with empty questions
      { new: true, upsert: true }  // Return the updated/new document, and if not found, create it
    ).populate({
      path: "questions",
      model: "Question",
    });

    res.status(200).json(survey);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Create a new survey (only if it doesn't already exist)
// @route   POST /api/surveys
// @access  Public
// export const createSurvey = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Check if a survey already exists
//     const existingSurvey = await Survey.findOne();

//     if (existingSurvey) {
//       res.status(200).json({
//         survey: existingSurvey,
//         message: "Survey already exists. You can update it instead.",
//       });
//       return;
//     }

//     const { questions } = req.body;

//     if (!questions) {
//       res.status(400).json({ message: "Questions are required" });
//       return;
//     }

//     // Create a new survey
//     const survey = new Survey({
//       questions,
//     });
//     await survey.save();

//     res.status(201).json({
//       survey,
//       message: "Survey created successfully",
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "An unknown error occurred" });
//     }
//   }
// };

// @desc    Update the existing survey
// @route   PUT /api/surveys
// @access  Public
export const updateSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questions } = req.body;

    // Find the single existing survey (since there is only one survey)
    const survey = await Survey.findOne();

    if (!survey) {
      res.status(404).json({ message: "Survey not found" });
      return;
    }

    // Update the survey with new questions
    survey.questions = questions;
    await survey.save();

    res.status(200).json(survey);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Delete the survey
// @route   DELETE /api/surveys
// @access  Public
export const deleteSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    // Since there is only one survey, no need to look for it by ID
    const survey = await Survey.findOne();

    if (!survey) {
      res.status(404).json({
        success: false,
        message: "Survey not found",
      });
      return;
    }

    // Delete the survey
    await Survey.deleteOne({ _id: survey._id });

    res.status(200).json({
      success: true,
      message: "Survey deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
