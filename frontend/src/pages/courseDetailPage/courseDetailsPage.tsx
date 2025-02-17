import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
	useNavigate,
	useParams,
} from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

import { Course } from "../../shared/types/course";
import { Rating } from "../../shared/types/rating";
import apiClient from "../../services/apiClient";

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
interface CatalogProps {
	setCartItemCount: Dispatch<SetStateAction<number>>;
}
const CoursePage = ({ setCartItemCount }: CatalogProps) => {
	const { courseId } = useParams<{ courseId: string }>();
	const [courseDetailsData, setCourseDetailsData] = useState<Course | null>({
		_id: "",
		className: "Introduction to Computer Science",
		courseDescription:
			"Learn the basics of computer science, programming, and problem-solving.",
		instructorName: "Dr. Alice Johnson",
		creditNumber: 3,
		discussion: "An interactive discussion about computational thinking.",
		components: ["Lectures", "Labs", "Quizzes"],
		handouts: ["syllabus.pdf", "lecture1.pdf", "assignment1.pdf"],
		ratings: [],
		isLive: false,
		cost: 100,
		categories: ["Technology"],
		thumbnailPath: "",
		instructorDescription: "PhD at Vandy",
		instructorRole: "Moderator",
		lengthCourse: 2,
		time: new Date("2025-10-15T00:00:00.000Z"),
		isInPerson: true,
	});
	const [starRating, setStarRating] = useState(-1);
	const [isAdded, setIsAdded] = useState(false);
	const [surveyLength, setSurveyLength] = useState(0);
	const [creditHours, setCreditHours] = useState(0);
	const [thumbnailpath, setThumbnailpath] = useState("");
	const [dateEvent, setDateEvent] = useState(new Date());
	const navigate = useNavigate();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [ratingsPageOpen, setRatingsPageOpen] = useState(false);
	const [numStarsRatingPage, setNumStarsRatingpage] = useState(0);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleBackToCatalog = () => {
		navigate("/catalog"); // Change to the desired route
	};

	//================ Working axios request ======================

	const fetchCourses = async () => {
		try {
			const response = await apiClient.get("/courses");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	//=============================================================

	useEffect(() => {
		async function fetchCourses() {
			try {
				const response = await apiClient.get(`/courses/${courseId}`);
				setCourseDetailsData(response.data.data)
			} catch (error) {
				console.error(error);
			}
		}
		fetchCourses();
	}, []);

	useEffect(() => {
		if (!courseDetailsData) {
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
				average.toFixed(2);
				setStarRating(parseFloat(average.toFixed(2)));
			} else {
				setStarRating(-1);
			}
			setDateEvent(courseDetailsData.time);
		}
	}, [courseDetailsData]);

	if (!courseDetailsData) {
		return <div>Loading Course Data</div>;
	}
	const handleClick = () => {
		setIsAdded(true);
	};
	const openRatingsPage = () => {
		setRatingsPageOpen(true);
	};

	const onClickRating = (value: number) => {
		setNumStarsRatingpage(value);
	};

	const submitRatingPage = (value: number) => {
		setRatingsPageOpen(false);
		setNumStarsRatingpage(value);
		setCourseDetailsData((prevCourse) => {
			if (!prevCourse) return prevCourse; // Handle null case

			const newRating: Rating = {
				userId: JSON.parse(localStorage.user),
				courseId: courseId ? courseId : "",
				rating: value,
			};

			return {
				...prevCourse, // Spread all existing properties
				ratings: [...prevCourse.ratings, newRating], // Add new rating
			};
		});
	};

	return (
		<div
			className="w-full min-h-screen m-0 p-0 md:text-lg lg:text-2xl"
			style={{ backgroundColor: "#F2F2F2" }}
		>
			<div style={{ marginTop: "75px", marginLeft: "250px" }}>
				<div>
					<div>
						<button
							style={{
								width: "154px",
								height: "38px",
								backgroundColor: "#D9D9D9",
								borderRadius: "5px",
								fontSize: "12px",
							}}
							onClick={handleBackToCatalog}
						>
							{" "}
							Back to Catalog
						</button>
					</div>
					<div
						style={{ marginTop: "50px", lineHeight: "48px", display: "flex" }}
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
						<div
							className="text-sm md:text-lg lg:text-2xl flex flex-col items-start gap-2"
							style={{ marginLeft: "150px" }}
						>
							<button
								onClick={handleClick}
								style={{ width: "168px", height: "38px" }}
								className={`h-9 rounded-md text-white text-xs ${
									isAdded
										? "bg-gray-400 cursor-not-allowed"
										: "bg-orange-400 hover:bg-orange-500 cursor-pointer transition-colors duration-300"
								}`}
								disabled={isAdded}
							>
								{isAdded ? "Added to Cart" : "Add to Cart"}
							</button>

							<button
								onClick={openRatingsPage}
								className="w-[168px] h-9 bg-orange-400 text-white text-xs rounded-md cursor-pointer transition-colors duration-300"
							>
								<p>Rate This Course</p>
							</button>
							{/* Pop-Up Modal */}
							{ratingsPageOpen && (
								<div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
									<div className="bg-white p-6 rounded-lg shadow-lg z-40 text-center">
										<div className="w-full">
											<div>
												<button
													className="flex ml-auto items-center justify-center w-3 h-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
													onClick={() => setRatingsPageOpen(false)}
												>
													×
												</button>
											</div>
										</div>
										<h2 className="text-xl font-bold mb-4">Rate this course</h2>
										<div>
											<div className="flex">
												{[1, 2, 3, 4, 5].map((value, index) => (
													<button
														key={index}
														onClick={() => onClickRating(value)}
														style={{
															padding: "5px",
														}}
													>
														<FaStar
															color={
																index < numStarsRatingPage
																	? "#FFD700"
																	: "#a9a9a9"
															}
														/>
													</button>
												))}
											</div>
											<button
												onClick={() => submitRatingPage(numStarsRatingPage)}
												className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-30 h-8 text-sm"
											>
												Submit
											</button>
										</div>

										{/* <button
											className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm w-3 h-2"
											onClick={() => setRatingsPageOpen(false)}
											>
											Close
										</button> */}
									</div>
								</div>
							)}
							<button
								onClick={handleClick}
								style={{ width: "168px", height: "38px" }}
								className={`w-42 h-9 rounded-md text-white text-xs bg-[#7B4899]`}
							>
								Edit Course
							</button>
						</div>
					</div>
					{/* Stars */}
					<div style={{ marginTop: "0x" }}>
						<StarDisplay
							rating={starRating}
							courseDetailsData={courseDetailsData}
							dateEvent={dateEvent}
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
						marginTop: "0px",
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
									fontSize: "12px",
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
										fontSize: "12px",
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
										fontSize: "16pz",
										lineHeight: "24px",
										fontWeight: 500,
									}}
								>
									{courseDetailsData.instructorName}
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
								<span style={{ fontWeight: 500, fontSize: "12px" }}>
									{courseDetailsData.instructorDescription}
								</span>
							</p>
							<p
								style={{
									fontWeight: 400,
									fontSize: "12px",
									lineHeight: "18px",
								}}
							>
								{courseDetailsData.courseDescription}
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
								courseDetailsData={courseDetailsData}
								dateEvent={dateEvent}
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
				src={thumbnail}
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
				width: "62px",
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
					fontSize: "10px",
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
	courseDetailsData,
	dateEvent,
}: {
	surveyLength: number;
	creditHours: number;
	courseDetailsData: Course;
	dateEvent: Date;
}) => {
	const [currentPage, setCurrentPage] = useState("Webinar");
	const [surveyColor, setSurveyColor] = useState("#D9D9D9");
	const [certificateColor, setCertificateColor] = useState("#D9D9D9");
	const [survey, setSurvey] = useState(false);
	const [surveyButton, setSurveyButton] = useState(false);
	const date = courseDetailsData.time;

	useEffect(() => {
		const webinarEnd = courseDetailsData.time;
		webinarEnd.setHours(webinarEnd.getHours() + 2); // 2 hours after the current time
		const checkTime = () => {
			const currentTime = new Date();
			if (currentTime.getTime() > webinarEnd.getTime()) {
				setSurvey(true);
				setSurveyButton(true);
			}
		};

		checkTime(); // Run immediately when component mounts

		const interval = setInterval(checkTime, 1000 * 60); // Run every 1 minute

		return () => clearInterval(interval); // Cleanup when component unmounts
	}, []);

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
	const handleCalendarClick = () => {};
	const handleAccessSurveyClick = () => {};

	{
		/* Needs to be complete once certificate page is out */
	}
	const handleAccessCertificate = () => {};
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
							fontSize: "12px",
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
							fontSize: "12px",
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

							fontSize: "12px",
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
						margin: "0 -40px",
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
							fontSize: "12px",
							fontWeight: 600,
							textAlign: "left",
							margin: "20px 0",
						}}
					>
						Webinar <br />
						<div>
							<p
								style={{
									fontSize: "12px",
									fontWeight: 600,
									textAlign: "left",
									margin: "10px 0",
									gap: "3px",
									display: "flex",
									flexDirection: "column",
								}}
							>
								{/*Needs to be complete*/}
								<div>Date {dateEvent.toLocaleDateString()}</div>
								{/*Needs to be complete*/}
								<div>
									Time{" "}
									{dateEvent.toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
									})}{" "}
								</div>
								{/*Needs to be complete*/}
								<div>Length {courseDetailsData.lengthCourse}</div>
							</p>
						</div>
						<div>
							{/*Needs to be complete add to calendar button*/}
							<button
								style={{
									width: "168px",
									height: "38px",
									backgroundColor: "#F79518",
									borderRadius: "5px",
									textAlign: "center",
									lineHeight: "50px",
									color: "white",
									fontSize: "12px",
									transform: "translateY(10px)",
									border: "none",
									marginTop: "20px",
								}}
							>
								{/*Needs to be complete*/}
								<p style={{ transform: "translateY(-5px)", margin: 0 }}>
									Add to Calendar
								</p>
							</button>
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
									fontSize: "12px",
									transform: "translateY(10px)",
									border: "none",
									marginTop: "10px",
								}}
							>
								<p style={{ transform: "translateY(-5px)", margin: 0 }}>
									Test Network
								</p>
							</button>
							<br />
							<button
								style={{
									width: "168px",
									height: "38px",
									backgroundColor: "#F79518",
									borderRadius: "5px",
									textAlign: "center",
									lineHeight: "50px",
									color: "white",
									fontSize: "12px",
									transform: "translateY(10px)",
									border: "none",
									marginTop: "10px",
								}}
							>
								{/*Needs to be complete*/}
								<p style={{ transform: "translateY(-5px)", margin: 0 }}>
									Handout
								</p>
							</button>
						</div>
					</p>
				)}
				{currentPage === "Survey" && (
					<p
						style={{
							fontSize: "12px",
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
									backgroundColor: survey ? "#F79518" : "#F79518",
									borderRadius: "5px",
									textAlign: "center",
									lineHeight: "50px",
									color: "white",
									fontSize: "12px",
									transform: "translateY(10px)",
									border: "none",
									marginTop: "30px",
									opacity: survey ? 1 : 0.6,
								}}
								disabled={!survey}
							>
								{/*Needs to be complete*/}

								<p style={{ transform: "translateY(-5px)", margin: 0 }}>
									{surveyButton ? (
										<h1>Survey</h1>
									) : (
										<h1 className="text-xs mt-1">
											Cannot access until webinar
										</h1>
									)}
								</p>
							</button>
						</div>
					</p>
				)}
				{currentPage === "Certificate" && (
					<p
						style={{
							fontSize: "12px",
							fontWeight: "bold",
							textAlign: "left",
							margin: "20px 0",
						}}
					>
						Certificate
						<p
							style={{
								fontSize: "12px",
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
									fontSize: "12px",
									border: "none",
									marginTop: "30px",
								}}
							>
								{/*Needs to be complete*/}
								<p
									style={{
										transform: "translateY(-7px)",
										margin: 0,
										font: "10px",
									}}
								>
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
	dateEvent,
}: {
	rating: number;
	courseDetailsData: Course;
	dateEvent: Date;
}) => {
	const [halfFilledStar, setHalfFilledStar] = useState(false);
	let stars = Array(5).fill(0);
	if (rating === -1) {
		stars = Array(0).fill(0);
	} else {
		stars = Array(5).fill(0);
	}
	let filledStars = Math.floor(rating);
	useEffect(() => {
		const filledStars = Math.floor(rating);
		setHalfFilledStar(rating - filledStars >= 0.5);
	}, [rating]);

	return (
		<div>
			<div
				style={{
					display: "flex",
					alignItems: "center", // Ensures all items align vertically
					gap: "10px", // Adds spacing between elements
				}}
			>
				<p style={{ fontSize: "12px", margin: 0, fontWeight: "bold" }}>
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
							{filledStars > index ? (
								<FaStar size={10} color="#FFD700" />
							) : rating - filledStars >= 0.5 &&
							  Math.ceil(filledStars) === index ? (
								<FaStarHalfAlt size={10} color="#FFD700" />
							) : (
								<FaStar size={10} color="#a9a9a9" />
							)}
							{/* <FaStar
                size={10}
                color={index < filledStars ? "#FFD700" : "#a9a9a9"}
              /> */}
						</li>
					))}
				</ul>
				<p style={{ fontSize: "12px", margin: 0 }}>
					{courseDetailsData.creditNumber} Credits{" "}
				</p>
				<p style={{ fontSize: "12px", margin: 0 }}>
					Live Web Event {dateEvent.toLocaleDateString()} at{" "}
					{dateEvent.toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					})}
				</p>
			</div>
		</div>
	);
};

export default CoursePage;
