import { Request, Response } from "express";
import Survey, { ISurvey } from "../models/surveyModel";

// @desc    Get all surveys or filter by query parameters
// @route   GET /api/surveys
// @access  Public
export const getSurveys = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, question } = req.query;
    const query: { [key: string]: any } = {};

    if (id) query.id = String(id);
    if (question) query.question = String(question);

    const surveys = await Survey.find(query).populate({
      path: "question",
      model: "Question",
    });

    res.status(200).json(surveys);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Create a new survey
// @route   POST /api/surveys
// @access  Public
export const createSurvey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, question } = req.body; // Changed from req.query to req.body

    // Check if survey exists
    const existingSurvey = await Survey.findOne({ id });

    if (existingSurvey) {
      res.status(200).json({
        survey: existingSurvey,
        message: "Survey already exists",
      });
      return;
    }

    // Create new survey
    const survey = new Survey({
      id,
      question,
    });
    await survey.save();

    res.status(201).json({
      survey,
      message: "Survey created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Update a survey
// @route   PUT /api/surveys/:id
// @access  Public
export const updateSurvey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: surveyId } = req.params;
    const updates = req.body;

    const updatedSurvey = await Survey.findByIdAndUpdate(
      surveyId,
      updates,
      { new: true } // Returns the updated document
    );

    if (!updatedSurvey) {
      res.status(404).json({ message: "Survey not found" });
      return;
    }

    res.status(200).json(updatedSurvey);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Delete a survey
// @route   DELETE /api/surveys/:id
// @access  Public
export const deleteSurvey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if survey exists
    const survey = await Survey.findById(id);
    if (!survey) {
      res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
      return;
    }

    // Delete the survey
    await Survey.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Survey deleted successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
