import { Request, Response } from "express";
import Course from "../models/courseModel";
import Rating from "../models/courseModel";
import Video from "../models/videoModel";
import Survey from "../models/surveyModel"

// @desc    Get all courses or filter courses by query parameters
// @route   GET /api/courses
// @access  Public
export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { courseId, courseName } = req.query; 

    const filter: any = {}; 

    if (courseId) filter.courseId = courseId; 
    if (courseName) filter.courseName = courseName; 

    const courseResponses = await Course.find(filter)
      .populate(["ratings", "components"])
      .exec(); 

      res.status(200).json({
        success: true,
        count: courseResponses.length,
        data: courseResponses,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal service error.",
      });
    }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { courseId, handouts, ratings, className, discussion, components } = req.body; 

    if (!courseId || !className || !components || components.length == 0) {
      res.status(400).json({
        success: false,
        message: "Please provide courseId, className, and components.",
      });
      return;
    }

    const newCourseResponse = new Course({
      courseId, 
      handouts, 
      ratings, 
      className, 
      discussion, 
      components
    });

    const savedCourseResponse = await newCourseResponse.save(); 

    res.status(201).json({
      success: true,
      data: savedCourseResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal service error.",
    });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public
export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; 

    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true, 
      runValidators: true,
    }); 


    if (!updatedCourse) {
      res.status(404).json({
        success: false, 
        message: "Course entry not found"
      }); 
    }

    const savedCourse = await updatedCourse?.save(); 

    res.status(200).json({
      success: true, 
      data: savedCourse, 
    }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal service error.",
    });
  }

};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Public
export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; 

    const courseResponse = await Course.findById(id); 

    if (!courseResponse) {
      res.status(404).json({
        success: false,
        message: "Course response not found.",
      });
      return;
    }

    await Rating.deleteMany({ _id: { $in: courseResponse.ratings }})

    for (const component of courseResponse.components) {
      if (component instanceof Survey) 
        await Survey.deleteOne({ _id: component.id }); 

      else if (component instanceof Video) 
        await Video.deleteOne({ _id: component.id }); 
      
    }

    await Course.deleteOne({ _id: id }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal service error.",
    });
  }

};
