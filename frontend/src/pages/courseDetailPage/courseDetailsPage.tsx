import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Course } from "../../shared/types/course";
import { Rating } from "../../shared/types/rating";
import apiClient from "../../services/apiClient";

interface CatalogProps {
	setCartItemCount: Dispatch<SetStateAction<number>>;
}

const CoursePage = ({ setCartItemCount }: CatalogProps) => {
	const navigate = useNavigate();
	const [courseId, setCourseId] = useState<string>();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const [courseDetailsData, setCourseDetailsData] = useState<Course | null>();
	const [starRating, setStarRating] = useState(-1);
	const [isAdded, setIsAdded] = useState(false);
	const [ratingsPageOpen, setRatingsPageOpen] = useState(false);
	const [numStarsRatingPage, setNumStarsRatingpage] = useState(0);

	//================ Working axios request ======================
	const fetchCourses = async () => {
		if (!courseId) return;
		try {
			const response = await apiClient.get(`/courses/${courseId}`);
			console.log(response.data.data);
			setCourseDetailsData(response.data.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const id = queryParams.get("courseId");
		setCourseId(id || "");
	}, [location.search]);

	useEffect(() => {
		fetchCourses();
	}, [courseId]);

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
		<div className="w-full h-max m-0 p-0 md:text-lg xl:text-2xl">
			<div className="mr-4 mb-3">
				<div className="bg-gray-100 sticky top-0 z-50">
					<button
						className="w-40 h-9 bg-[#D9D9D9] rounded-md text-xs mt-8"
						onClick={() => navigate("/catalog")}
					>
						Back to Catalog
					</button>
					<div className="m-0 my-5 flex w-full gap-2 flex-col xl:flex-row xl:gap-20">
						<div className="flex flex-col text-xs w-auto gap-1">
							<p className="text-3xl font-bold">
								{courseDetailsData.className}
							</p>

							{/* Course Details + Rating */}
							<div className="flex flex-row min-w-fit w-fit gap-4 items-center text-xs mt-1 content-start">
								{/* Stars */}
								<p className="font-bold w-max min-w-max">
									{starRating === -1 ? (
										"No ratings yet"
									) : (
										<StarDisplay rating={starRating} />
									)}
								</p>

								<p className="w-max min-w-max">
									{courseDetailsData.creditNumber} Credits
								</p>
								<p className="w-max min-w-max">
									Live Web Event{" "}
									{new Date(courseDetailsData.time).toLocaleDateString()} at{" "}
									{new Date(courseDetailsData.time).toLocaleTimeString(
										"en-US",
										{
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										}
									)}
								</p>
								<div className="w-max min-w-max">
									<CategoryPills categories={courseDetailsData.categories} />
								</div>
							</div>
						</div>

						<div className="text-sm md:text-lg xl:text-2xl h-auto flex flex-row content-end gap-2 w-min xl:flex-col">
							<button
								onClick={() => {
									setIsAdded(!isAdded);
								}}
								className={`w-36 h-9 rounded-md text-white text-xs bg-orange-400 hover:bg-orange-500 cursor-pointer`}
							>
								{isAdded ? "Remove from Cart" : "Add to Cart"}
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
					<hr className="w-full my-4 border-t-4 border-gray-200 pb-1" />
				</div>

				<div className="flex gap-4 max-w-7xl w-full min-h-full flex-col xl:flex-row">
					<div className="flex flex-col gap-3 w-fit">
						{/*Overview Rectangle*/}
						<div className="bg-white rounded-2xl flex flex-col items-start justify-start p-3 text-sm gap-1">
							<p className="text-md font-semibold">Overview</p>
							<p className="flex flex-col gap-1">
								{courseDetailsData.courseDescription
									.split("\n")
									.map((line, index) => (
										<span key={index}>{line}</span>
									))}
							</p>
						</div>

						{/* Content overview */}
						<div className="p-3 flex flex-col rounded-2xl bg-white min-w-min w-full gap-1 h-full">
							<p className="text-sm font-semibold"> Content(s) </p>
							<DisplayBar
								surveyLength={courseDetailsData.lengthCourse}
								creditHours={courseDetailsData.creditNumber}
								time={courseDetailsData.time}
								lengthCourse={courseDetailsData.lengthCourse}
							/>
						</div>
					</div>
					{/*Speaker discription rectangle*/}
					<div className="bg-white rounded-2xl p-3 gap-2 flex h-stretch text-sm w-fit flex-col">
						<div className="font-semibold text-sm">Speaker(s)</div>
						<div className="flex gap-2">
							<div className="flex flex-col min-w-24 flex-wrap gap-3">
								<div className="bg-stone-100 min-h-28">
									<img
										src={courseDetailsData.thumbnailPath}
										alt={`A profile picture of ${courseDetailsData.instructorName}`}
									/>
								</div>
								<div className="text-base font-medium">
									{courseDetailsData.instructorName}
								</div>

								{/*Needs to be complete*/}
								<div className="text-xs font-medium">
									{courseDetailsData.instructorRole}
								</div>
								<CategoryPills categories={courseDetailsData.categories} />
							</div>
							<p className="flex flex-col gap-1">
								{courseDetailsData.instructorDescription
									.split("\n")
									.map((line, index) => (
										<span key={index}>{line}</span>
									))}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const CategoryPills = ({ categories }: { categories: string[] }) => {
	return (
		<ul className="flex flex-wrap gap-1">
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

	useEffect(() => {
		const webinarEnd = new Date(time);
		webinarEnd.setHours(webinarEnd.getHours() + 2); // 2 hours after the current time
		const checkTime = () => {
			const currentTime = new Date();
			if (currentTime.getTime() > webinarEnd.getTime()) {
				setSurvey(true);
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

	/* TODO: Needs to be complete once certificate page is out */
	const handleAccessCertificate = () => {};

	return (
		<div className="flex min-w-min min-h-min justify-between w-full gap-2">
			<div className="flex flex-col">
				{/* Webinar -> Survey -> Certificate */}
				<div className="flex min-w-min h-9 mb-5">
					{/* Webinar Button */}
					<button
						className="bg-[#F79518] rounded-l-full text-center cursor-pointer w-48"
						style={{
							clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
						}}
						onClick={() => {
							setCurrentPage("Webinar");
							setSurveyColor("#FEC781");
							setCertificateColor("#FEC781");
						}}
					>
						<p className="flex justify-center items-center text-xs text-white font-semibold">
							Webinar
						</p>
					</button>
					{/* Survey Button */}
					<button
						className="text-center cursor-pointer w-48 -ml-6 text-xs text-white font-semibold"
						style={{
							backgroundColor: surveyColor,
							clipPath:
								"polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%)",
						}}
						onClick={() => {
							setSurveyColor("#F79518");
							setCertificateColor("#FEC781");
							setCurrentPage("Survey");
						}}
					>
						Survey
					</button>
					{/* Certificate Button */}
					<button
						className="text-center cursor-pointer w-48 rounded-r-full -ml-6"
						style={{
							clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%)",
							backgroundColor: certificateColor,
						}}
					>
						<p
							className="flex justify-center items-center text-xs text-white font-semibold"
							onClick={() => {
								setSurveyColor("#F79518");
								setCertificateColor("#F79518");
								setCurrentPage("Certificate");
							}}
						>
							Certificate
						</p>
					</button>
				</div>
				{currentPage === "Webinar" && (
					<div className="flex justify-between">
						<div className="text-sm	font-normal flex flex-col gap-1">
							<div>Date: {new Date(time).toLocaleDateString()}</div>
							<div>
								Time:{" "}
								{new Date(time).toLocaleTimeString("en-US", {
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})}
							</div>
							<div>Length: {lengthCourse} hours</div>
						</div>
						<div className="flex flex-col w-max gap-2">
							{/*Needs to be complete add to calendar button*/}
							<button className="bg-[#F79518] w-full rounded-md text-center text-white text-xs align-middle px-6 py-3">
								Add Webinar to Calendar
							</button>
							<button
								onClick={testNetwork}
								className="bg-[#F79518] rounded-md text-center text-white text-xs align-middle px-6 py-3"
							>
								Test Network
							</button>
							<button className="bg-[#F79518] rounded-md text-center text-white text-xs align-middle px-6 py-3">
								{/*Needs to be complete*/}
								Handout(s)
							</button>
						</div>
					</div>
				)}
				{currentPage === "Survey" && (
					<div className="text-sm font-normal flex flex-col gap-3">
						Length: {surveyLength} questions
						<div className="flex flex-col text-xs text-red-600">
							<p className={survey ? "hidden" : ""}>
								Complete webinar to access survey
							</p>
							<button
								className={`w-max rounded-md text-center text-white text-xs align-middle px-6 py-3 ${!survey ? "bg-gray-400 cursor-not-allowed" : "bg-[#F79518]"}`}
								disabled={!survey}
							>
								Begin Survey
							</button>
						</div>
					</div>
				)}
				{currentPage === "Certificate" && (
					<div className="text-sm	font-normal flex flex-col gap-3">
						Once you have completed the course, your certificate will be
						accessible here.
						<div className="flex flex-col text-xs text-red-600">
							<p className={survey ? "hidden" : ""}>
								Complete webinar to access certificate
							</p>
							<button
								className={`w-max rounded-md text-center text-white text-xs align-middle px-6 py-3 ${!survey ? "bg-gray-400 cursor-not-allowed" : "bg-[#F79518]"}`}
								disabled={!survey}
							>
								Print Certificate
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

/* Displays the stars, credit numbers, and live event time */
const StarDisplay = ({ rating }: { rating: number }) => {
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
		<div className="flex min-w-min gap-3 items-center text-xs mt-1 mb-2">
			<p>{rating}</p>
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
		</div>
	);
};

export default CoursePage;
