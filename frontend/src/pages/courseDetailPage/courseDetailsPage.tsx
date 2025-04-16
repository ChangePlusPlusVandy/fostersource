import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { Course } from "../../shared/types/course";
import { Rating } from "../../shared/types/rating";
import apiClient from "../../services/apiClient";
import SurveyModal from "./SurveyModal";

interface CartItem {
	className: string;
	cost: number;
	creditNumber: number;
	instructor: string;
	_id: string;
}

// Video with a type field
interface Survey {
	type: "Survey";
	_id: string;
	questions: string[];
}

interface BaseSession {
	type: 'webinar' | 'inPerson' | 'onDemand';
}

interface WebinarSession extends BaseSession {
	type: 'webinar';
	meetingID: string;
	date: Date;
	time: string;
	length: number;
}

interface InPersonSession extends BaseSession {
	type: 'inPerson';
	location: string;
	date: Date;
	time: string;
	length: number;
}

interface OnDemandSession extends BaseSession {
	type: 'onDemand';
	videoUrl: string;
	length: number;
}

type SessionType = WebinarSession | InPersonSession | OnDemandSession;

interface CatalogProps {
	setCartItemCount: Dispatch<SetStateAction<number>>;
}

interface MapProps {
	location: string;
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
	const [courseDetailsData, setCourseDetailsData] = useState<Course | null>(null);
	const [starRating, setStarRating] = useState(-1);
	const [isAdded, setIsAdded] = useState(false);
	const [ratingsPageOpen, setRatingsPageOpen] = useState(false);
	const [numStarsRatingpage, setNumStarsRatingpage] = useState(0);
	const [isAdmin, setIsAdmin] = useState(false);
	const [currentComponent, setCurrentComponent] = useState<string>("");
	const [canProceed, setCanProceed] = useState<boolean>(false);
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const checkAdminStatus = async () => {
			try {
				const response = await apiClient.get("users/is-admin", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setIsAdmin(response.data.isAdmin);
			} catch (error) {
				console.error("Failed to check admin status", error);
			}
		};

		checkAdminStatus();
	}, []);

	const navigateToCourseEdit = () => {
		navigate(`/courses/edit`); // Change to the desired route
	};

	//================ Working axios request ======================
	const fetchCourse = async () => {
		if (!courseId) return;
		try {
			const response = await apiClient.get(`courses/${courseId}`);
      const courseData = response.data.data;
				
			setCourseDetailsData({
					...courseData,
					location: courseData.type === 'inPerson' ? courseData.location : undefined,
					videoUrl: courseData.type === 'onDemand' ? courseData.videoUrl : undefined,
					meetingID: courseData.type === 'webinar' ? courseData.meetingID : undefined,
					regStart: new Date(courseData.regStart),
					regEnd: new Date(courseData.regEnd)
				});
		} catch (error) {
			console.error(error);
		}
	};

	// useEffect(() => {
	// 	const id = queryParams.get("courseId");
	// 	setCourseId(id || "");
	// }, [location.search]);

	useEffect(() => {
		fetchCourse();
		checkCourseInCart();
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
			if (!prevCourse) return prevCourse;

			const newRating: Rating = {
				userId: JSON.parse(localStorage.user),
				courseId: courseId ? courseId : "",
				rating: value,
			};

			return {
				...prevCourse,
				ratings: [...prevCourse.ratings, newRating],
			};
		});
	};

	const handleComponentChange = (component: string) => {
		setCurrentComponent(component);
		setCanProceed(false);

		// Clear any existing timer
		if (timer) {
			clearTimeout(timer);
		}

		// Use the course's lengthCourse field from the schema
		const lengthInMilliseconds = courseDetailsData.lengthCourse * 60 * 60 * 1000;
		
		// Set a new timer based on course length
		const newTimer = setTimeout(() => {
			setCanProceed(true);
		}, lengthInMilliseconds);

		setTimer(newTimer);
	};

	const handleNextComponent = () => {
		if (canProceed) {
			// Clear the timer when proceeding
			if (timer) {
				clearTimeout(timer);
				setTimer(null);
			}
			setCanProceed(false);
			
			// Navigate based on current component
			switch (currentComponent) {
				case "Webinar":
					setCurrentComponent("Survey");
					break;
				case "Survey":
					setCurrentComponent("Certificate");
					break;
				case "Certificate":
					// Handle completion
					console.log("Course completed");
					break;
				default:
					console.log("Invalid component");
			}
			} else {
			// Calculate remaining time in minutes
			const remainingTime = Math.ceil(
				(courseDetailsData.lengthCourse * 60 * 60 * 1000 - 
				(Date.now() - (timer ? Date.now() : 0))) / 1000 / 60
			);
			alert(`Please wait ${remainingTime} minutes before proceeding to the next section.`);
		}
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

							<button
								onClick={openRatingsPage}
								className="w-[168px] h-9 bg-orange-400 text-white text-xs rounded-md cursor-pointer transition-colors duration-300"
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
																index < numStarsRatingpage
																	? "#FFD700"
																	: "#a9a9a9"
															}
														/>
													</button>
												))}
											</div>
											<button
												onClick={() => submitRatingPage(numStarsRatingpage)}
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
							{isAdmin && (
								<button
									onClick={navigateToCourseEdit}
									style={{ width: "168px", height: "38px" }}
									className={`w-42 h-9 rounded-md text-white text-xs bg-[#7B4899]`}
								>
									Edit Course
								</button>
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
								creditHours={courseDetailsData.creditNumber}
								time={courseDetailsData.time}
								lengthCourse={courseDetailsData.lengthCourse}
								isSurveyModalOpen={isSurveyModalOpen}
								setIsSurveyModalOpen={setIsSurveyModalOpen}
								components={courseDetailsData.components}
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
	creditHours,
	time,
	lengthCourse,
	isSurveyModalOpen,
	setIsSurveyModalOpen,
	components,
}: {
	creditHours: number;
	time: Date;
	lengthCourse: number;
	isSurveyModalOpen: boolean;
	setIsSurveyModalOpen: any;
	components: any[];
}) => {
	const [currentPage, setCurrentPage] = useState<"Webinar" | "Survey" | "Certificate">("Webinar");
	const [surveyColor, setSurveyColor] = useState("#D9D9D9");
	const [certificateColor, setCertificateColor] = useState("#D9D9D9");
	const [survey, setSurvey] = useState(false);
	const [videoLink, setVideoLink] = useState<string | null>("");

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

	const getYouTubeEmbedUrl = (url: string) => {
		const match = url.match(
			/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
		);
		const videoId = match?.[1];
		return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
	};

	const retrieveVideo = async () => {
		try {
			const response = await apiClient.get(`/videos`, {
				params: {
					_id: components[0],
				},
			});
			console.log(response.data.data[0].videoUrl);
			setVideoLink(getYouTubeEmbedUrl(response.data.data[0].videoUrl));
		} catch (error) {
r);
		}
	};

	{
		/* Needs to be complete once certificate page is out */
	}
	const handleAccessCertificate = () => {};

	const renderSessionContent = () => {
		if (!courseDetailsData) return null;

		switch (courseDetailsData.type) {
			case 'webinar':
				return (
					<div>
						<p className="text-sm font-semibold mb-4">Online Webinar</p>
						<div className="space-y-2">
							<div>Date: {dateEvent.toLocaleDateString()}</div>
							<div>Time: {dateEvent.toLocaleTimeString()}</div>
							<div>Length: {courseDetailsData.lengthCourse} hours</div>
							<button className="w-full bg-[#F79518] text-white py-2 px-4 rounded mt-4">
								Add to Calendar
							</button>
							<button 
								onClick={testNetwork}
								className="w-full bg-[#F79518] text-white py-2 px-4 rounded mt-2"
							>
								Test Network
							</button>
						</div>
					</div>
				);

			case 'inPerson':
				return (
					<div className="space-y-4">
						<p className="text-sm font-semibold">In-Person Meeting</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-gray-600" />
								<span>{courseDetailsData.location}</span>
							</div>
							<div>Date: {dateEvent.toLocaleDateString()}</div>
							<div>Time: {dateEvent.toLocaleTimeString()}</div>
							<div>Length: {courseDetailsData.lengthCourse} hours</div>
							
							{/* Google Maps component */}
							{courseDetailsData.location && (
								<>
									<div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
										<LocationMap location={courseDetailsData.location} />
									</div>
									<button 
										onClick={() => {
											if (courseDetailsData.location) {
												window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(courseDetailsData.location)}`, '_blank');
											}
										}}
										className="w-full bg-[#F79518] text-white py-2 px-4 rounded mt-4 flex items-center justify-center gap-2"
									>
										<MapPin className="w-4 h-4" />
										Open in Google Maps
									</button>
								</>
							)}

							<button className="w-full bg-[#F79518] text-white py-2 px-4 rounded mt-2">
								Add to Calendar
							</button>
						</div>
					</div>
				);

			case 'onDemand':
				return (
					<div>
						<p className="text-sm font-semibold mb-4">On-Demand Video</p>
						<div className="space-y-2">
							<div>Length: {courseDetailsData.lengthCourse} hours</div>
							<div className="aspect-video bg-gray-100 rounded mt-4">
								<video 
									controls 
									className="w-full h-full"
									src={courseDetailsData.videoUrl}
								>
									Your browser does not support the video tag.
								</video>
							</div>
							<button className="w-full bg-[#F79518] text-white py-2 px-4 rounded mt-4">
								Download Video
							</button>
						</div>
					</div>
				);

			default:
				return <div>Invalid session type</div>;
		}
	};

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
				{currentPage === "Webinar" && renderSessionContent()}
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

const LocationMap = ({ location }: MapProps) => {
	const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
	
	useEffect(() => {
		// Geocode the address to get coordinates
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode({ address: location }, (results, status) => {
			if (status === 'OK' && results?.[0]?.geometry?.location) {
				const { lat, lng } = results[0].geometry.location;
				setCoordinates({ lat: lat(), lng: lng() });
			}
		});
	}, [location]);

	const mapContainerStyle = {
		width: '100%',
		height: '250px',
	};

	if (!coordinates) return <div>Loading map...</div>;

	return (
		// need to setup billing account so havent made api key yet
		<LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY!}> 
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				center={coordinates}
				zoom={15}
			>
				<Marker position={coordinates} />
			</GoogleMap>
		</LoadScript>
	);
};

export default CoursePage;
