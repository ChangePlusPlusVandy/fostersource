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
    const { name, instructor, category } = req.query; // Example filters

    // Create a query object based on the provided query parameters
    const query: { [key: string]: string | undefined } = {};

    if (name) query.name = String(name);
    if (instructor) query.instructor = String(instructor);
    if (category) query.category = String(category);

    // Fetch surveys based on query (if no filters, return all surveys)
    const surveys = await Survey.find(query);

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
    const { name, instructor, category } = req.query; // Example filters

    // Create a query object based on the provided query parameters
    const query: { [key: string]: string | undefined } = {};

    if (name) query.name = String(name);
    if (instructor) query.instructor = String(instructor);
    if (category) query.category = String(category);

    const survey = new Survey({ query });
    await survey.save();
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
    const { id } = req.params;
    const { name, instructor, category } = req.body; // Example filters

    // Create a query object based on the provided query parameters
    const query: { [key: string]: string | undefined } = {};

    const toUpdate = (await Survey.findById(id)) as ISurvey | null;

    if (!toUpdate) {
      res.status(404).json({ message: "Survey not found" });
      return;
    }

    // figure out what to update later

    await toUpdate.save();
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

    await Survey.deleteOne({ _id: id });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
