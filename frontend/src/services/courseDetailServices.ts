import axios from "axios";

interface Course {
    handouts: string[];
    ratings: number[];
    className: string;
    discussion: string;
    components: String[];
    isLive: boolean;
    categories: string[];
    creditNumber: number;
    courseDescription: string;
    thumbnailPath: string;
    cost: number;
    instructorName: string;
    instructorDescription: string;
    instructorRole: string;
    lengthCourse: number;
    time: Date;
  }
  

  type Component = Survey | Video;
  
  // Survey with a type field
  interface Video {
    type: "Video"; 
    _id: string;
    onDemand: boolean;
    meetingID: number;
    date: Date;
  }
  
  // Video with a type field
  interface Survey {
    type: "Survey"; 
    _id: string;
    questions: string[];
  }

// Represents the API response structure
interface FetchCourseDetailsResponse {
    success: boolean;
    count: number;
    data: Course[];
}


export const fetchCourseDetails = async (courseId: string): Promise<Course> => {
    try {
        console.log("Fetching course details with _id:", courseId);
        const response = await axios.get(`http://localhost:5001/api/courses`, {
            params: { _id: courseId }, // Pass the query parameter `_id`
        });
        console.log("Fetched course details:", response.data);
        return response.data.data[0]; // Ensure this matches the `Data` interface
    } catch (error) {
        console.error("Error in fetchCourseDetails:", error);
        throw error;
    }
};


export const fetchRating = async (courseId: string): Promise<any> =>{
    const response = await axios.get(`/api/ratings/${courseId}`)
    return response.data
};


