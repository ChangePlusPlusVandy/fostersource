import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

import { Course } from "../../shared/types/course";
import { Rating } from "../../shared/types/rating";
import apiClient from "../../services/apiClient";

interface CatalogProps {
	setCartItemCount: Dispatch<SetStateAction<number>>;
}

const CoursePage = ({ setCartItemCount }: CatalogProps) => {
	const { courseId } = useParams<{ courseId: string }>();
	const navigate = useNavigate();
	const [courseDetailsData, setCourseDetailsData] = useState<Course | null>({
		_id: "",
		className: "Introduction to Computer Science",
		courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae nibh nisi. Duis a imperdiet tellus. Mauris quis tortor sit amet nunc consequat dapibus quis nec lorem. Pellentesque vestibulum nulla quis arcu feugiat, ac euismod neque rhoncus. Morbi odio ligula, mattis egestas lacus vitae, pellentesque posuere tortor. Vivamus malesuada rhoncus rhoncus. Aenean sit amet ullamcorper metus. Suspendisse blandit ullamcorper lectus a vestibulum.\n

Nullam efficitur nisl vel nibh cursus vehicula. Etiam erat dolor, euismod quis nibh sit amet, auctor dapibus diam. Fusce mi nisl, volutpat ut lacus ut, pulvinar elementum mauris. Sed ornare tincidunt tortor id molestie. Proin semper dignissim imperdiet. Donec tellus augue, pulvinar ornare ex vel, semper tincidunt lectus. Integer id orci quam. Nulla ac erat vitae nisi aliquet molestie id at elit. Sed scelerisque sodales mi, in eleifend lorem feugiat sed.\n

Maecenas euismod erat rhoncus, viverra odio vitae, pulvinar enim. Duis sollicitudin nibh libero, vitae tristique lacus gravida dignissim. Mauris tempor magna consectetur neque volutpat, sit amet bibendum nisl consectetur. Morbi facilisis eu orci at volutpat. Sed tincidunt laoreet augue, faucibus ornare enim ullamcorper vitae. Ut interdum nibh et eros consectetur venenatis. Nulla pretium nunc est, sit amet mollis ante fringilla eget.\n
Maecenas euismod erat rhoncus, viverra odio vitae, pulvinar enim. Duis sollicitudin nibh libero, vitae tristique lacus gravida dignissim. Mauris tempor magna consectetur neque volutpat, sit amet bibendum nisl consectetur. Morbi facilisis eu orci at volutpat. Sed tincidunt laoreet augue, faucibus ornare enim ullamcorper vitae. Ut interdum nibh et eros consectetur venenatis. Nulla pretium nunc est, sit amet mollis ante fringilla eget.\n

Sed blandit blandit consequat. Duis ornare at dui in varius. Fusce vel dapibus nunc. Aliquam pellentesque hendrerit vestibulum. Phasellus turpis orci, commodo venenatis lacinia non, ultricies vel lacus. Nullam non euismod lacus, vitae porta magna. Etiam et sodales arcu. Nunc luctus sem et sodales tristique. Sed lorem sem, tristique in laoreet at, pulvinar et mi. Vestibulum libero felis, cursus sit amet egestas sed, luctus id nibh. Duis feugiat dolor metus, vel vulputate libero condimentum quis.`,
		instructorName: "Dr. Alice Johnson",
		creditNumber: 3,
		discussion: "An interactive discussion about computational thinking.",
		components: ["Lectures", "Labs", "Quizzes"],
		handouts: ["syllabus.pdf", "lecture1.pdf", "assignment1.pdf"],
		ratings: [],
		isLive: false,
		cost: 100,
		categories: ["Technology", "Category", "Misc"],
		thumbnailPath: "",
		instructorDescription: "PhD at Vandy",
		instructorRole: "Moderator",
		lengthCourse: 2,
		time: new Date("2025-10-15T00:00:00.000Z"),
		isInPerson: true,
	});
	const [starRating, setStarRating] = useState(-1);
	const [isAdded, setIsAdded] = useState(false);
	const [ratingsPageOpen, setRatingsPageOpen] = useState(false);
	const [numStarsRatingPage, setNumStarsRatingpage] = useState(0);

	//================ Working axios request ======================
	const fetchCourses = async () => {
		try {
			const response = await apiClient.get(`/courses/${courseId}`);
			setCourseDetailsData(response.data.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	useEffect(() => {
		if (courseDetailsData) {
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
		}
	}, [courseDetailsData]);

	if (!courseDetailsData) {
		return <div>Loading Course Data</div>;
	}

	const openRatingsPage = () => {
		setRatingsPageOpen(true);
	};

	const onClickRating = (value: number) => {
		setNumStarsRatingpage(value);
	};

	const submitRatingPage = (value: number) => {
		setRatingsPageOpen(false);
		setNumStarsRatingpage(value);
		// TODO: rating should connect to database?
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
		<div className="w-full h-full m-0 p-0 md:text-lg lg:text-2xl bg-orange-200">
			<div className="mt-8 mr-4">
				<button
					className="w-[154px] h-[38px] bg-[#D9D9D9] rounded-md text-xs"
					onClick={() => navigate("/catalog")}
				>
					Back to Catalog
				</button>

				<div className="m-0 my-5 flex text-3xl font-bold">
					<div className="flex flex-col">
						<p>{courseDetailsData.className}</p>
						{/* Stars */}
						<StarDisplay
							rating={starRating}
							courseDetailsData={courseDetailsData}
						/>
						<CategoryPills categories={courseDetailsData.categories} />
					</div>

					<div className="text-sm md:text-lg lg:text-2xl h-auto flex flex-col flex-start items-start gap-2 justify-start ml-36">
						<button
							onClick={() => {
								setIsAdded(true);
							}}
							className={`w-36 h-9 rounded-md text-white text-xs ${
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
							className="min-w-min w-36 h-9 bg-orange-400 text-white text-xs rounded-md cursor-pointer transition-colors duration-300"
						>
							Rate This Course
						</button>
						{/* Pop-Up Modal */}
						{ratingsPageOpen && (
							<div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
								<div className="bg-white p-6 rounded-lg shadow-lg z-40 text-center flex flex-col">
									<button
										className="flex ml-auto items-center justify-center w-3 h-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
										onClick={() => setRatingsPageOpen(false)}
									>
										×
									</button>
									<h2 className="text-xl font-bold mb-4">Rate this course</h2>
									<div>
										{[1, 2, 3, 4, 5].map((value, index) => (
											<button
												key={index}
												className="p-1"
												onClick={() => onClickRating(value)}
											>
												<FaStar
													color={
														index < numStarsRatingPage ? "#FFD700" : "#a9a9a9"
													}
												/>
											</button>
										))}
									</div>
									<button
										className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-30 h-8 text-sm"
										onClick={() => submitRatingPage(numStarsRatingPage)}
									>
										Submit
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex gap-5 py-3 max-w-7xl bg-pink-200 w-full pr-3 min-h-full h-full">
					<div
						className="bg-blue-200 min-w-min w-1/2"
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "10px",
							maxWidth: "100%",
						}}
					>
						{/*Overview Rectangle*/}
						<div className="bg-white rounded-2xl flex flex-col items-start justify-start p-3 text-xs gap-1">
							<p className="font-semibold">Overview</p>
							<p>{courseDetailsData.discussion}</p>
						</div>

						{/*Speaker discription rectangle*/}
						<div className="bg-white rounded-2xl p-3 flex gap-3 max-h-96">
							<div className="max-w-36 min-w-32">
								<div
									className="justify-start"
									style={{
										fontWeight: 600,
										fontSize: "12px",
									}}
								>
									Speaker
								</div>
								<div
									className="bg-slate-400"
									style={{ margin: "20px 0", textAlign: "center" }}
								>
									<img
										src={courseDetailsData.thumbnailPath}
										alt="No Picture Found"
										style={{
											maxWidth: "121px",
											height: "auto",
										}}
									/>
								</div>
								<div className="text-base font-medium">
									{courseDetailsData.instructorName}
								</div>

								<CategoryPills categories={courseDetailsData.categories} />

								{/*Needs to be complete*/}
								<p className="text-xs font-medium">
									{courseDetailsData.instructorDescription}
								</p>
							</div>
							<div className="text-xs overflow-scroll">
								{courseDetailsData.courseDescription}
							</div>
						</div>
					</div>
					<div className="p-3 pl-5 rounded-2xl bg-green-200 min-w-min w-1/2">
						Content
						<DisplayBar
							surveyLength={courseDetailsData.lengthCourse}
							creditHours={courseDetailsData.creditNumber}
							time={courseDetailsData.time}
							lengthCourse={courseDetailsData.lengthCourse}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const CategoryPills = ({ categories }: { categories: string[] }) => {
	return (
		<ul className="flex gap-1">
			{categories.map((category, index) => (
				<li key={index}>
					<div className="flex rounded-xl bg-[#F79518]">
						<p className="p-1 px-2 text-white leading-[15px] text-[10px]">
							{category}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
};

/* Displays the progress bar of webinar, survey, and certificate */
const DisplayBar = ({
	surveyLength,
	creditHours,
	time,
	lengthCourse,
}: {
	surveyLength: number;
	creditHours: number;
	time: Date;
	lengthCourse: number;
}) => {
	const [currentPage, setCurrentPage] = useState("Webinar");
	const [surveyColor, setSurveyColor] = useState("#D9D9D9");
	const [certificateColor, setCertificateColor] = useState("#D9D9D9");
	const [survey, setSurvey] = useState(false);
	const [surveyButton, setSurveyButton] = useState(false);

	useEffect(() => {
		const webinarEnd = time;
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
		setSurveyColor("#FEC781");
		setCertificateColor("#D9D9D9");
		setCurrentPage("Survey");
	};

	const handleCertificateClick = () => {
		setSurveyColor("#FEC781");
		setCertificateColor("#FEC781");
		setCurrentPage("Certificate");
	};

	/* TODO: Needs to be complete once certificate page is out */
	const handleAccessCertificate = () => {};

	return (
		<div className="w-min min-w-min bg-red-800 min-h-min">
			{/* Webinar -> Survey -> Certificate */}
			<div className="flex min-w-min">
				{/*First Shape*/}
				<button
					style={{
						width: "150px",
						height: "36px",
						backgroundColor: "#F79518",
						clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
						borderRadius: "20px",
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
						width: "150px",
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

						border: "none",
						cursor: "pointer",
					}}
				>
					<p
						onClick={handleCertificateClick}
						style={{
							display: "flex",
							justifyContent: "center",

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
								<div>Date {time.toLocaleDateString()}</div>
								{/*Needs to be complete*/}
								<div>
									Time{" "}
									{time.toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
									})}{" "}
								</div>
								{/*Needs to be complete*/}
								<div>Length {lengthCourse}</div>
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

/* Displays the stars, credit numbers, and live event time */
const StarDisplay = ({
	rating,
	courseDetailsData,
}: {
	rating: number;
	courseDetailsData: Course;
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
		<div className="flex gap-3 items-center text-xs mt-1 mb-2">
			<p className="font-bold">{rating === -1 ? "No ratings yet" : rating}</p>
			<ul>
				{stars.map((_, index) => (
					<li key={index} className="inline-block mr-1">
						{filledStars > index ? (
							<FaStar size={10} color="#FFD700" />
						) : rating - filledStars >= 0.5 &&
						  Math.ceil(filledStars) === index ? (
							<FaStarHalfAlt size={10} color="#FFD700" />
						) : (
							<FaStar size={10} color="#a9a9a9" />
						)}
					</li>
				))}
			</ul>
			<p>{courseDetailsData.creditNumber} Credits</p>
			<p>
				Live Web Event {courseDetailsData.time.toLocaleDateString()} at{" "}
				{courseDetailsData.time.toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				})}
			</p>
		</div>
	);
};

export default CoursePage;
