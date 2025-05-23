import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	FaStar as _FaStar,
	FaStarHalfAlt as _FaStarHalfAlt,
} from "react-icons/fa";
import { ComponentType } from "react";

import { Course } from "../../shared/types/course";
import { Rating } from "../../shared/types/rating";
import apiClient from "../../services/apiClient";
import SurveyModal from "./SurveyModal";
import YouTube from "react-youtube";
import { Progress } from "../../shared/types/progress";

const FaStar = _FaStar as ComponentType<{ size?: number; color?: string }>;
const FaStarHalfAlt = _FaStarHalfAlt as ComponentType<{
	size?: number;
	color?: string;
}>;

interface CartItem {
	className: string;
	cost: number;
	creditNumber: number;
	instructor: string;
	_id: string;
}

interface CatalogProps {
	setCartItemCount: Dispatch<SetStateAction<number>>;
}

const CoursePage = ({ setCartItemCount }: CatalogProps) => {
	const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const courseId = searchParams.get("courseId");

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const cartItems: CartItem[] = user?.cart ? user.cart : [];
	const checkCourseInCart = () => {
		if (cartItems) {
			if (cartItems.some((item) => item._id === courseId)) {
				setIsAdded(true);
			}
		}
	};

	const navigate = useNavigate();
	const [courseDetailsData, setCourseDetailsData] = useState<Course | null>(
		null
	);
	const [starRating, setStarRating] = useState(-1);
	const [isAdded, setIsAdded] = useState(false);
	const [ratingsPageOpen, setRatingsPageOpen] = useState(false);
	const [numStarsRatingPage, setNumStarsRatingpage] = useState(0);
	const [hasProgress, setHasProgress] = useState<boolean | null>(null);
	const [progress, setProgress] = useState<Progress | null>(null);
	const [workshopCompleted, setWorkshopCompleted] = useState<boolean>(false);
	const [surveyCompleted, setSurveyCompleted] = useState<boolean>(false);
	const [certificateCompleted, setCertificateCompleted] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchProgress = async () => {
			if (!courseId || !user?._id) return;
			try {
				const response = await apiClient.get(
					`/courses/${courseId}/progress/single/${user._id}`
				);
				const progress = response.data.progress;
				if (!response.data.progress) {
					setHasProgress(false);
				} else {
					setHasProgress(true);
					setProgress(progress);
					setWorkshopCompleted(progress.completedComponents.webinar);
					setSurveyCompleted(progress.completedComponents.survey);
					setCertificateCompleted(progress.completedComponents.certificate);
					console.log("progress", response.data);
				}
			} catch (error) {
				setHasProgress(false);
				console.error("Error checking progress:", error);
			}
		};

		fetchCourse();
		checkCourseInCart();
		fetchProgress();
	}, [courseId]);

	const productType = courseDetailsData?.productType;

	const navigateToCourseEdit = () => {
		navigate(`/courses/edit`);
	};

	const fetchCourse = async () => {
		if (!courseId) return;
		try {
			const response = await apiClient.get(`courses/${courseId}`);
			response.data.data.time = new Date(response.data.data.time);
			console.log(response.data.data);
			setCourseDetailsData(response.data.data);
		} catch (error) {
			console.error(error);
		}
	};

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
					{!hasProgress ? (
						<button
							className="w-40 h-9 bg-[#D9D9D9] rounded-md text-xs mt-8"
							onClick={() => navigate("/catalog")}
						>
							Back to Catalog
						</button>
					) : (
						<div className="h-[50px]"></div>
					)}

					<div className="m-0 my-5 flex w-full gap-2 flex-col xl:flex-row xl:gap-20">
						<div className="flex flex-col text-xs w-auto gap-1">
							<p className="text-3xl font-bold">
								{courseDetailsData.className}
							</p>

							{/* Course Details + Rating */}
							<div className="flex flex-row min-w-fit w-fit gap-4 items-center text-xl mt-1 content-start">
								{/* Stars */}
								{/* <p className="font-bold w-max min-w-max">
									{starRating === -1 ? (
										"No ratings yet"
									) : (
										<StarDisplay rating={starRating} />
									)}
								</p> */}

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
							{/* {!hasProgress ? (
								<button
									onClick={() => {
										setIsAdded(!isAdded);
									}}
									style={{ width: "168px", height: "38px" }}
									className={`h-9 rounded-md text-white text-xs ${
										isAdded
											? "bg-gray-400 cursor-not-allowed"
											: "bg-orange-400 hover:bg-orange-500 cursor-pointer transition-colors duration-300"
									}`}
									disabled={isAdded}
								>
									{isAdded ? "Remove from Cart" : "Add to Cart"}
								</button>
							) : (
								<></>
							)} */}

							{/* {hasProgress ? (
								<button
									onClick={openRatingsPage}
									className="w-[168px] h-9 bg-orange-400 text-white text-xs rounded-md cursor-pointer transition-colors duration-300"
								>
									Rate This Course
								</button>
							) : (
								<></>
							)} */}

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
						</div>
					</div>
					<hr className="w-full my-4 border-t-4 border-gray-200 pb-1" />
				</div>

				<div className="flex gap-4 max-w-7xl w-full min-h-full flex-col xl:flex-row">
					<div
						className={`flex gap-3 w-fit ${hasProgress ? `flex-col-reverse` : `flex-col`}`}
					>
						{/*Overview Rectangle*/}
						<div className="bg-white rounded-2xl flex flex-col items-start justify-start p-3 text-sm gap-1">
							<p className="text-lg font-semibold">Overview</p>
							<p className="flex flex-col gap-1 text-lg">
								{courseDetailsData.courseDescription
									.split("\n")
									.map((line, index) => (
										<span key={index}>{line}</span>
									))}
							</p>
						</div>

						{/* Content overview */}
						<div className="p-3 flex flex-col rounded-2xl bg-white min-w-min w-full gap-1 h-full">
							<p className="text-xl font-semibold"> Content </p>
							<DisplayBar
								creditHours={courseDetailsData.creditNumber}
								time={courseDetailsData.time}
								isSurveyModalOpen={isSurveyModalOpen}
								setIsSurveyModalOpen={setIsSurveyModalOpen}
								productInfo={courseDetailsData.productInfo}
								productType={courseDetailsData.productType}
								hasProgress={hasProgress}
								workshop={workshopCompleted}
								survey={surveyCompleted}
								setWorkshopCompleted={setWorkshopCompleted}
								setSurveyCompleted={setSurveyCompleted}
								setCertificateCompleted={setCertificateCompleted}
								courseName={courseDetailsData.className}
								certificate={certificateCompleted}
							/>
						</div>
					</div>
					{/*Speaker discription rectangle*/}
					<div className="bg-white rounded-2xl p-3 gap-2 flex h-stretch text-sm w-fit flex-col">
						<div className="font-semibold text-lg">Speaker(s)</div>
						<div className="flex gap-2">
							{courseDetailsData.speakers.map((speaker, index) => (
								<div
									key={index}
									className="flex flex-col min-w-24 flex-wrap gap-3 w-[400px]"
								>
									<div className="bg-stone-100 min-h-28 w-[300px]">
										<img
											src={(speaker as any).image} // adjust if you have a type
											alt={`A profile picture of ${(speaker as any).name}`}
										/>
									</div>
									<div className="text-base text-lg font-medium">
										{(speaker as any).name}
									</div>
									<div className="text-md font-medium italic">
										{(speaker as any).title}
									</div>
									<div className="text-md font-medium">
										{(speaker as any).bio}
									</div>
								</div>
							))}
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
					<div className="flex rounded-full bg-[#F79518]">
						<p className="px-4 py-2 text-white leading-[15px] text-sm">
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
	time,
	isSurveyModalOpen,
	setIsSurveyModalOpen,
	productInfo,
	productType,
	hasProgress,
	workshop,
	survey,
	setWorkshopCompleted,
	setSurveyCompleted,
	setCertificateCompleted,
	certificate,
	courseName,
	creditHours,
}: {
	creditHours: number;
	time: Date;
	isSurveyModalOpen: boolean;
	setIsSurveyModalOpen: any;
	productInfo: string;
	productType: string;
	hasProgress: boolean | null;
	workshop: boolean;
	survey: boolean;
	certificate: boolean;
	setWorkshopCompleted: any;
	setSurveyCompleted: any;
	setCertificateCompleted: any;
	courseName: string;
}) => {
	const [currentPage, setCurrentPage] = useState("Workshop");
	const [surveyColor, setSurveyColor] = useState("#D9D9D9");
	const [certificateColor, setCertificateColor] = useState("#D9D9D9");
	const [videoLink, setVideoLink] = useState<string | null>("");
	const [videoCompleted, setVideoCompleted] = useState(false);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const courseId = searchParams.get("courseId");

	const onPlayerReady = (event: any) => {
		event.target.playVideo();
	};

	const onStateChange = async (event: any) => {
		console.log(event.data);
		if (event.data === 0) {
			setVideoCompleted(true);

			try {
				const user = JSON.parse(localStorage.getItem("user") || "{}");
				const response = await apiClient.put(
					`/courses/${courseId}/progress/single/${user._id}`,
					{
						webinarComplete: true,
					}
				);
				console.log("✅ Webinar completion updated:", response.data);
				setWorkshopCompleted(true);
			} catch (err) {
				console.error("❌ Failed to update webinar progress:", err);
			}
		}
	};

	// useEffect(() => {
	// 	const webinarEnd = new Date(time);
	// 	webinarEnd.setHours(webinarEnd.getHours() + 2); // 2 hours after the current time
	// 	const checkTime = () => {
	// 		const currentTime = new Date();
	// 		if (currentTime.getTime() > webinarEnd.getTime()) {
	// 			setSurvey(true);
	// 		}
	// 	};

	// 	checkTime(); // Run immediately when component mounts

	// 	const interval = setInterval(checkTime, 1000 * 60); // Run every 1 minute

	// 	return () => clearInterval(interval); // Cleanup when component unmounts
	// }, []);

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
	const handleAccessCertificate = async () => {
		const user = JSON.parse(localStorage.getItem("user") || "{}");

		if (!certificate) {
			setCertificateCompleted(true);

			try {
				await apiClient.put(
					`/courses/${courseId}/progress/single/${user._id}`,
					{
						webinarComplete: true,
						surveyComplete: true,
						certificateComplete: true,
					}
				);
			} catch (error) {
				console.error("Error updating progress after certificate:", error);
			}
		}

		try {
			const response = await apiClient.post(
				"/certificatePDFs",
				{
					certificateType: "completion", // or "attendance"
					participantName: user.name,
					courseInfo: `${courseName} (${creditHours} credits)`,
					completionDate: new Date().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
				},
				{
					responseType: "blob", // IMPORTANT for binary PDF data
				}
			);

			// Create a blob URL and trigger download
			const blob = new Blob([response.data], { type: "application/pdf" });
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = "certificate.pdf";
			link.click();
		} catch (error) {
			console.error("Error generating certificate:", error);
			alert("Failed to generate certificate. Please try again.");
		}
	};

	const getYouTubeEmbedUrl = (url: string) => {
		const match = url.match(
			/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
		);
		const videoId = match?.[1];
		return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
	};

	const getYoutubeVideoId = (url: string): string => {
		if (!url) return "";

		const regex =
			/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regex);
		return match ? match[1] : "";
	};

	const retrieveVideo = () => {
		try {
			setVideoLink(getYouTubeEmbedUrl(productInfo));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		retrieveVideo();
	}, [productInfo]);

	useEffect(() => {
		console.log(productInfo);
	}, [productInfo]);

	if (hasProgress)
		return (
			<div className="flex min-w-min min-h-min justify-between w-full gap-2">
				<div className="flex flex-col w-full">
					{/* Workshop -> Survey -> Certificate */}
					<div className="flex min-w-min h-9 mb-5">
						{/* Workshop Button */}
						<button
							className="bg-[#F79518] rounded-l-full text-center cursor-pointer w-48"
							style={{
								clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
							}}
							onClick={() => {
								setCurrentPage("Workshop");
								setSurveyColor("#FEC781");
								setCertificateColor("#FEC781");
							}}
						>
							<p className="flex justify-center items-center text-xs text-white font-semibold">
								Workshop
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
					{currentPage === "Workshop" && (
						<div className="flex flex-col justify-between w-full">
							{productType === "Virtual Training - On Demand" ? (
								<div className="relative w-full pb-[56.25%] h-0 overflow-hidden">
									{/* <iframe
										className="absolute top-0 left-0 w-full h-full"
										src={getYouTubeEmbedUrl(productInfo) || ""}
										title="On Demand Video"
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									></iframe> */}
									<YouTube
										videoId={getYoutubeVideoId(productInfo)}
										onReady={onPlayerReady}
										onStateChange={onStateChange}
										opts={{
											width: "100%",
											playerVars: {
												autoplay: 0,
												controls: 1,
												rel: 0,
												modestbranding: 1,
											},
										}}
									/>
								</div>
							) : productType === "Virtual Training - Live Meeting" ? (
								<div className="flex flex-col gap-2 text-sm">
									<p>Meeting ID: {productInfo}</p>
									<a
										href={`https://zoom.us/j/${productInfo}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 underline"
									>
										Join Zoom Meeting
									</a>
								</div>
							) : productType === "Virtual Training - Live Webinar" ? (
								<div className="flex flex-col gap-2 text-sm">
									<p>Webinar URL: </p>
									<a
										href={productInfo}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 underline"
									>
										Join Webinar
									</a>
								</div>
							) : productType === "In-Person Training" ? (
								(() => {
									try {
										const parsed = JSON.parse(productInfo);
										return (
											<div className="flex flex-col text-sm gap-1">
												<p>
													Location:{" "}
													<a
														href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.location)}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 underline"
													>
														{parsed.location}
													</a>
												</p>
												<p>
													Start Time:{" "}
													{new Date(parsed.startTime).toLocaleString()}
												</p>
												<p>Duration: {parsed.duration} minutes</p>
											</div>
										);
									} catch (e) {
										return (
											<p className="text-red-600">
												Invalid in-person course info.
											</p>
										);
									}
								})()
							) : (
								<p className="text-red-600">Unknown course type.</p>
							)}
							{workshop ? (
								<p className="text-green-500 text-sm">
									Completed! Please proceed to survey
								</p>
							) : (
								<></>
							)}
						</div>
					)}
					{currentPage === "Survey" && (
						<div className="text-sm font-normal flex flex-col gap-3">
							<div className="flex flex-col text-xs">
								<p
									className={workshop ? "hidden text-red-600" : "text-red-600"}
								>
									Complete workshop to access survey. (For in person events,
									this may take a couple of days to update.)
								</p>
								<button
									className={`w-max rounded-md text-center text-white text-xs align-middle px-6 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#F79518]}`}
									disabled={!workshop || survey}
									onClick={() => setIsSurveyModalOpen(true)}
								>
									{survey ? "Already Completed Survey" : "Begin Survey"}
								</button>
								<SurveyModal
									isOpen={isSurveyModalOpen}
									onClose={() => setIsSurveyModalOpen(false)}
									courseId={courseId}
									setSurveyCompleted={setSurveyCompleted}
								></SurveyModal>
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
									className={`w-max rounded-md text-center text-white text-xs align-middle px-6 py-3 cursor-pointer hover:bg-orange-500 transition ${!survey ? "bg-gray-400 cursor-not-allowed" : "bg-[#F79518]"}`}
									disabled={!survey}
									onClick={handleAccessCertificate}
								>
									Print Certificate
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	else return <div></div>;
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
