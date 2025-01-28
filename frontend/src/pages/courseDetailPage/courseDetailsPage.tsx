import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourseDetails } from "../../services/courseDetailServices";
import { FaStar } from "react-icons/fa";
import {dummyCourses} from "../../shared/DummyCourses";

import { Course } from "../../shared/types/course";

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

const CoursePage: React.FC = () => {
    function tempDataParse() {
        for(let course of dummyCourses){
            if (courseId === course.className.toLowerCase().trim().replaceAll(" ", "-")){
                return course;
            }
        }
        return {
            className: "Introduction to Computer Science",
            description:
                "Learn the basics of computer science, programming, and problem-solving.",
            instructor: "Dr. Alice Johnson",
            creditNumber: 3,
            discussion: "An interactive discussion about computational thinking.",
            components: ["Lectures", "Labs", "Quizzes"],
            handouts: ["syllabus.pdf", "lecture1.pdf", "assignment1.pdf"],
            ratings: [
                { userId: "user1", courseId: "cs101", rating: 2 },
                { userId: "user2", courseId: "cs101", rating: 2 },
            ],
            isLive: false,
            cost: 100,
            categories: ["Technology"],
            thumbnailPath: "",
        }
    }
  const { courseId } = useParams<{ courseId: string }>();
  const [courseDetailsData, setCourseDetailsData] = useState<Course | null>(tempDataParse());
  const [starRating, setStarRating] = useState(-1);
  const [isAdded, setIsAdded] = useState(false);
  const [surveyLength, setSurveyLength] = useState(-1);
  const [creditHours, setCreditHours] = useState(0);
  const [thumbnailpath, setThumbnailpath] = useState("");
  useEffect(() => {
    console.log("useEffect being used");
    const fetchData = async () => {
      if (!courseId) {
        console.error("No Id detected");
        return;
      }
      // try {
      //   const courseDetails: Course = await fetchCourseDetails(courseId);
      //   setCourseDetailsData(courseDetails);
      //   if (courseDetails) {
      //     const surveys = courseDetails.components.filter(
      //       (component): component is Survey => component.type === "Survey"
      //     );
      //     const totalQuestions = surveys.reduce(
      //       (sum, survey) => sum + survey.questions.length,
      //       0
      //     );
      //     setSurveyLength(totalQuestions);
      //     const credit = courseDetails.creditNumber
      //     setCreditHours(credit)
      //     setThumbnailpath(courseDetails.thumbnailPath)
      //   }

      // } catch (e) {
      //   console.error("Error loading course data");

      // }

    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!courseDetailsData) {
      console.log("Error in fetching data");
    } else {
      if (courseDetailsData.ratings.length !== 0) {
        let average = 0;
        let num = 0;
        let times = 0;
        for (let i = 0; i < courseDetailsData.ratings.length; i++) {
          num += courseDetailsData.ratings[i].rating;
          times++;
        }
        average = num / times;
        setStarRating(average);
      } else {
        setStarRating(-1);
      }
    }
  }, [courseDetailsData]);

  if (!courseDetailsData) {
    return <div>Loading Course Data</div>;
  }
  const handleClick = () => {
    setIsAdded(true);
  };

  return (
    <div style={{ margin: 0 }}>
      <div style={{ marginLeft: "10vw" }}>
        <div>
          <div>
            <button
              style={{
                width: "154px",
                height: "38px",
                backgroundColor: "#D9D9D9",
                borderRadius: "5px",
                fontSize: "16px",
              }}
            >
              {" "}
              Back to Catalog
            </button>
          </div>
          <div
            style={{ marginTop: "79px", lineHeight: "48px", display: "flex" }}
          >
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "0",
                lineHeight: "1.2",
              }}
            >
              {courseDetailsData.className}
            </p>
            <button
              onClick={handleClick}
              style={{
                width: "168px",
                height: "38px",
                backgroundColor: isAdded ? "#CCCCCC" : "#F79518", // Grey if added, original color otherwise
                borderRadius: "5px",
                textAlign: "center",
                lineHeight: "50px",
                color: "white",
                fontSize: "16px",
                transform: "translateY(10px)",
                marginLeft: "150px",
                border: "none",
                cursor: isAdded ? "not-allowed" : "pointer",
                transition: "background-color 0.3s ease",
              }}
              disabled={isAdded} // Disable the button once clicked
            >
              <p style={{ transform: "translateY(-5px)", margin: 0 }}>
                {isAdded ? "Added to Cart" : "Add to Cart"}
              </p>
            </button>
          </div>
          {/* Stars */}
          <div style={{ marginTop: "0x" }}>
            <StarDisplay
              rating={starRating}
              courseDetailsData={courseDetailsData}
            />
          </div>
          <ul style={{ display: "flex", gap: "5px" }}>
            {courseDetailsData.categories.map((component, index) => (
              <li key={index}>
                <ButtonLabel component={component} />
              </li>
            ))}
          </ul>
          {/* Filters */}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/*Overview Rectangle*/}
            <div
              style={{
                width: "537px",
                height: "115px",
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                padding: "10px",
                marginTop: "65px",
              }}
            >
              <p
                style={{
                  textAlign: "left",
                  fontSize: "16px",
                  margin: "0",
                  lineHeight: "1.5",
                  fontWeight: 400,
                }}
              >
                <span style={{ fontWeight: 600 }}>Overview</span>
                <br />
                {courseDetailsData.discussion}
              </p>
            </div>

            {/*Speaker discription rectangle*/}
            <div
              style={{
                width: "537px",
                height: "451px",
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "10px",
                display: "flex",
              }}
            >
              <p
                style={{
                  textAlign: "left",
                  margin: "0",
                  lineHeight: "1.5",
                  width: "150px",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "18px",
                  }}
                >
                  Speaker
                </span>
                <br />
                <span>
                  <DisplayThumbnail thumbnail={thumbnailpath} />
                </span>{" "}
                <br />
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: 500,
                  }}
                >
                  {courseDetailsData.instructor}
                </span>{" "}
                <br />
                <span>
                  {" "}
                  <ul style={{ display: "flex", gap: "5px" }}>
                    {courseDetailsData.categories.map((component, index) => (
                      <li key={index}>
                        <ButtonLabel component={component} />
                      </li>
                    ))}
                  </ul>{" "}
                </span>{" "}
                <br />
                {/*Needs to be complete*/}
                <span style={{ fontWeight: 500, fontSize: "16px" }}>
                  Instructor Description
                </span>
              </p>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "18px",
                }}
              >
                {courseDetailsData.description}
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "65px",
              width: "537px",
              height: "578px",
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "10px",
              paddingLeft: "20px",
            }}
          >
            <p style={{ textAlign: "left" }}>
              <p>Content</p>
              <DisplayBar
                surveyLength={surveyLength}
                creditHours={creditHours}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
const DisplayThumbnail = ({ thumbnail }: { thumbnail: string }) => {
  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <img
          src={"https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg"}
        // src={thumbnail}
        alt="No Picture Found"
        style={{
          maxWidth: "121px",
          height: "auto",
        }}
      />
    </div>
  );
};

const ButtonLabel = ({ component }: { component: String }) => {
  return (
    <div
      style={{
          padding: "10px",
        height: "18px",
        backgroundColor: "#F79518",
        borderRadius: "20px",
        display: "flex", // Use flexbox for proper alignment
        alignItems: "center", // Vertically center the text
        justifyContent: "center", // Horizontally center the text
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#FFFFFF",
          lineHeight: "15px",
          fontWeight: 500,
          font: "Poppins",
        }}
      >
        {component}
      </p>
    </div>
  );
};

{
  /*Displays the progress bar of webinar, survey, and certificate*/
}

const DisplayBar = ({
  surveyLength,
  creditHours,
}: {
  surveyLength: number;
  creditHours: number;
}) => {
  const [currentPage, setCurrentPage] = useState("Webinar");
  const [surveyColor, setSurveyColor] = useState("#D9D9D9");
  const [certificateColor, setCertificateColor] = useState("#D9D9D9");
  const testNetwork = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      ); // Test API endpoint
      if (response.ok) {
        alert("Network is working!");
      } else {
        alert("Network error: " + response.status);
      }
    } catch (error) {
      alert("Network is down");
    }
  };
  const handleWebinarClick = () => {
    setCurrentPage("Webinar");
    setSurveyColor("#D9D9D9");
    setCertificateColor("#D9D9D9");
  };
  const handleSurveyClick = () => {
    setSurveyColor("#FEC781"); // Turn survey button orange
    setCertificateColor("#D9D9D9"); // Turn certificate button orange
    setCurrentPage("Survey");
  };

  const handleCertificateClick = () => {
    setSurveyColor("#FEC781"); // Turn survey button orange
    setCertificateColor("#FEC781"); // Turn certificate button orange
    setCurrentPage("Certificate");
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        {/*First Shape*/}
        <button
          style={{
            width: "163px",
            height: "36px",
            backgroundColor: "#F79518",
            clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
            borderRadius: "20px", // Adds roundness
            margin: "0 -20px 0 0",
            padding: "0",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          <p
            onClick={handleWebinarClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            Webinar
          </p>
        </button>
        {/*Second Shape*/}
        <button
          style={{
            width: "163px",
            height: "36px",
            backgroundColor: surveyColor,
            clipPath:
              "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%)",
            margin: "0 -20px 0 0",
            padding: "0",
            border: "none",
            cursor: "pointer",
          }}
        >
          <p
            onClick={handleSurveyClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            Survey
          </p>
        </button>
        <button
          style={{
            width: "150px",
            height: "36px",
            backgroundColor: certificateColor,
            clipPath: "polygon(0 0, 85% 0, 85% 100%, 0 100%, 15% 50%)",
            borderRadius: "0 20px 20px 0",
            margin: "0",
            padding: "0",
            border: "none",
            cursor: "pointer",
          }}
        >
          <p
            onClick={handleCertificateClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              fontSize: "16px",
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            Certificate
          </p>
        </button>
        <button
          onClick={handleCertificateClick}
          style={{
            width: "40px",
            height: "36px",
            backgroundColor: certificateColor,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            borderRadius: "20px",
            margin: "0 -45px",
            padding: "0",
            border: "none",
            cursor: "pointer",
          }}
        ></button>
      </div>
      <div>
        {currentPage === "Webinar" && (
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              textAlign: "left",
              margin: "20px 0",
            }}
          >
            Webinar <br />
            <div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  textAlign: "left",
                  margin: "10px 0",
                  gap: "3px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/*Needs to be complete*/}
                <div>Date</div>
                {/*Needs to be complete*/}
                <div>Time</div>
                {/*Needs to be complete*/}
                <div>Length</div>
              </p>
            </div>
            <div>
              {/*Needs to be complete*/}
              <button
                style={{
                  width: "168px",
                  height: "38px",
                  backgroundColor: "#F79518",
                  borderRadius: "5px",
                  textAlign: "center",
                  lineHeight: "50px",
                  color: "white",
                  fontSize: "16px",
                  transform: "translateY(10px)",
                  border: "none",
                  marginTop: "20px",
                }}
              >
                {/*Needs to be complete*/}
                <p style={{ transform: "translateY(-5px)", margin: 0 }}>
                  Add to Calander
                </p>
              </button>{" "}
              <br />
              <button
                onClick={testNetwork}
                style={{
                  width: "168px",
                  height: "38px",
                  backgroundColor: "#F79518",
                  borderRadius: "5px",
                  textAlign: "center",
                  lineHeight: "50px",
                  color: "white",
                  fontSize: "16px",
                  transform: "translateY(10px)",
                  border: "none",
                  marginTop: "10px",
                }}
              >
                <p style={{ transform: "translateY(-5px)", margin: 0 }}>
                  Test Network
                </p>
              </button>
            </div>
          </p>
        )}
        {currentPage === "Survey" && (
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              textAlign: "left",
              margin: "20px 0",
            }}
          >
            Survey <br />
            Amount:{" "}
            <span style={{ fontWeight: 200 }}>{surveyLength} questions</span>
            <div>
              {/*Needs to be complete*/}
              <button
                style={{
                  width: "168px",
                  height: "38px",
                  backgroundColor: "#F79518",
                  borderRadius: "5px",
                  textAlign: "center",
                  lineHeight: "50px",
                  color: "white",
                  fontSize: "16px",
                  transform: "translateY(10px)",
                  border: "none",
                  marginTop: "30px",
                }}
              >
                {/*Needs to be complete*/}
                <p style={{ transform: "translateY(-5px)", margin: 0 }}>
                  Cannot access until Webinar
                </p>
              </button>
            </div>
          </p>
        )}
        {currentPage === "Certificate" && (
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "left",
              margin: "20px 0",
            }}
          >
            Certificate
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              Amount:{" "}
              <span style={{ fontWeight: 200 }}>{creditHours} questions</span>
            </p>
            <div style={{ textAlign: "left" }}>
              {/*Needs to be complete*/}
              <button
                style={{
                  width: "168px",
                  height: "38px",
                  backgroundColor: "#F79518",
                  borderRadius: "5px",
                  textAlign: "center",
                  lineHeight: "50px",
                  color: "white",
                  fontSize: "16px",
                  border: "none",
                  marginTop: "30px",
                }}
              >
                {/*Needs to be complete*/}
                <p style={{ transform: "translateY(-7px)", margin: 0 }}>
                  Cannot access until Survey
                </p>
              </button>
            </div>
          </p>
        )}
      </div>
    </div>
  );
};

{
  /*Displays the stars, credit numbers, and live event time*/
}
const StarDisplay = ({
  rating,
  courseDetailsData,
}: {
  rating: number;
  courseDetailsData: Course;
}) => {
  let stars = Array(0).fill(0);
  if (rating === -1) {
    stars = Array(0).fill(0);
  } else {
    stars = Array(rating).fill(0);
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center", // Ensures all items align vertically
          gap: "10px", // Adds spacing between elements
        }}
      >
        <p style={{ fontSize: "16px", margin: 0, fontWeight: "bold" }}>
          {rating === -1 ? "No ratings yet" : rating}
        </p>
        <ul
          style={{
            display: "flex",
            listStyleType: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {stars.map((item, index) => (
            <li
              key={index}
              style={{
                display: "inline-block",
                marginRight: "5px",
              }}
            >
              <FaStar
                size={10}
                color={index <= rating ? "#FFD700" : "#a9a9a9"}
              />
            </li>
          ))}
        </ul>
        <p style={{ fontSize: "16px", margin: 0 }}>
          {courseDetailsData.creditNumber} Credits{" "}
        </p>
        <p style={{ fontSize: "16px", margin: 0 }}>
          Live Events I couldn't find the data where when it is live is stored
        </p>
      </div>
    </div>
  );
};

export default CoursePage;
