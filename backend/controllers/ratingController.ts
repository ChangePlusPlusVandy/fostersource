import { Request, Response } from "express";
import Rating from "../models/ratingModel";
import Course from "../models/courseModel";

// @desc    Get all ratings or filter by query parameters
// @route   GET /api/ratings
// @access  Public
export const getRatings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId, minRating, maxRating } = req.query; // Filters

    // Create a query object
    const query: { [key: string]: any } = {};

    if (userId) {
      query.userId = String(userId);
    }
    if (courseId) {
      query.courseId = String(courseId);
    }
    
    // Add threshold filters
    if (minRating !== undefined) {
      query.rating = { ...query.rating, $gte: Number(minRating) }; // Greater than or equal to minRating
    }
    if (maxRating !== undefined) {
      query.rating = { ...query.rating, $lte: Number(maxRating) }; // Less than or equal to maxRating
    }

    // Fetch ratings based on the query
    const ratings = await Rating.find(query);

    res.status(200).json(ratings);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Create a new rating
// @route   POST /api/ratings
// @access  Public
export const createRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId, rating } = req.body;

    // Validate the data
    if (!userId || !courseId || rating == null) {
      res.status(400).json({ message: "User ID, Course ID and rating are required" });
      return;
    }

    const newRating = new Rating({ userId, rating });
    const savedRating = await newRating.save();

    res.status(201).json(savedRating);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Public
export const updateRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const updatedRating = await Rating.findOneAndUpdate({ id }, req.body, { new: true });

    if (!updatedRating) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Public
export const deleteRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedRating = await Rating.findById(id);

    if (!deletedRating) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }

    await Course.findByIdAndUpdate(
      deletedRating.courseId, 
      { $pull: { ratings: id } },
      { new: true }
    ); 

    await Rating.deleteOne({ _id: id }); 

    res.status(204).send(); // No content
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
