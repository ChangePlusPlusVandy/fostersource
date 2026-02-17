import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Course } from "../../shared/types/course";
import { Link } from "react-router-dom";
import {
	addToCart,
	registerForCourse,
} from "../../services/registrationServices";

interface CatalogCourseComponentProps {
	course: Course;
	setCartItemCount: Dispatch<SetStateAction<number>>;
	isInCart: boolean;
	isLoggedIn: boolean;
}

type RegistrationStatus =
	| "none"
	| "waitlisted"
	| "enrolled"
	| "already-enrolled";

export default function CatalogCourseComponent({
	course,
	setCartItemCount,
	isInCart,
	isLoggedIn,
}: CatalogCourseComponentProps) {
	const storedUser = useMemo(() => {
		if (!isLoggedIn) {
			return null;
		}

		try {
			const rawUser = localStorage.getItem("user");
			return rawUser ? JSON.parse(rawUser) : null;
		} catch (error) {
			console.error("Failed to parse stored user:", error);
			return null;
		}
	}, [isLoggedIn]);

	const userId: string | undefined = storedUser?._id;

	const defaultStatus = useMemo<RegistrationStatus>(() => {
		if (!userId) {
			return "none";
		}

		if (course.students.some((id) => id === userId)) {
			return "enrolled";
		}

		const waitlistEntries = course.waitlist ?? [];
		const onWaitlist = waitlistEntries.some((entry) => {
			const entryUser = entry.user as string | { _id?: string } | undefined;
			const entryId =
				typeof entryUser === "string" ? entryUser : entryUser?._id;
			return entryId === userId;
		});

		return onWaitlist ? "waitlisted" : "none";
	}, [course.students, course.waitlist, userId]);

	const [registrationStatus, setRegistrationStatus] =
		useState<RegistrationStatus>(defaultStatus);

	useEffect(() => {
		setRegistrationStatus(defaultStatus);
	}, [defaultStatus]);

	const isRegistrationLocked =
		registrationStatus === "waitlisted" ||
		registrationStatus === "enrolled" ||
		registrationStatus === "already-enrolled";

	const renderStars = (rating: number) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;
		const emptyStars = 5 - Math.ceil(rating);

		return (
			<div className="flex items-center">
				{[...Array(fullStars)].map((_, i) => (
					<span key={`full-${i}`} className="text-yellow-500">
						★
					</span>
				))}
				{hasHalfStar && <span className="half-star">★</span>}
				{[...Array(emptyStars)].map((_, i) => (
					<span key={`empty-${i}`} className="text-gray-300">
						★
					</span>
				))}
			</div>
		);
	};

	async function handleRegister(course: Course) {
		if (isAtCapacity) {
			try {
				const data = await registerForCourse(course._id);
				const courseResult = data.results.find(
					(result) => result.courseId === course._id
				);

				setRegistrationStatus(courseResult?.status ?? "waitlisted");
			} catch (error) {
				console.error(error);
			}
			return;
		}

		await addToCart(course).then(() => {
			setCartItemCount(
				localStorage.user ? JSON.parse(localStorage.user).cart.length : 0
			);
		});
	}

	const isAtCapacity =
		course.registrationLimit > 0 &&
		course.students.length >= course.registrationLimit;
	const isDisabled = isInCart || isRegistrationLocked;

	const statusMessage = useMemo(() => {
		if (registrationStatus === "waitlisted") {
			return "You're on the waitlist for this course.";
		}

		if (
			registrationStatus === "enrolled" ||
			registrationStatus === "already-enrolled"
		) {
			return "You're registered for this course.";
		}

		return null;
	}, [registrationStatus]);

	const primaryButtonLabel = useMemo(() => {
		if (isInCart) {
			return "Already in Cart";
		}

		if (registrationStatus === "waitlisted") {
			return "On Waitlist";
		}

		if (
			registrationStatus === "enrolled" ||
			registrationStatus === "already-enrolled"
		) {
			return "Registered";
		}

		if (isAtCapacity) {
			return "Join Waitlist";
		}

		const cost = storedUser?.role?.cost;

		if (cost === 0) {
			return "Register (Free)";
		}

		if (typeof cost === "number") {
			const formattedCost = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(cost);
			return `Register (${formattedCost})`;
		}

		return "Register (Free)";
	}, [isAtCapacity, isInCart, registrationStatus, storedUser]);

	return (
		<div className="flex bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
			<div className="w-3/4 p-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					{course.className}
				</h2>

				<div className="flex items-center text-gray-500 text-sm mt-2">
					<div className="flex items-center">
						<span className="mr-1">
							{course.ratings.length > 0
								? (
										course.ratings.reduce((sum, r) => sum + r.rating, 0) /
										course.ratings.length
									).toFixed(1)
								: "No ratings"}
						</span>
						<span className="text-yellow-500">
							{renderStars(
								parseInt(
									course.ratings.length > 0
										? (
												course.ratings.reduce((sum, r) => sum + r.rating, 0) /
												course.ratings.length
											).toFixed(1)
										: "0"
								)
							)}
						</span>
					</div>
					<span className="mx-3">|</span>
					<div>
						<span className="mr-1">{course.creditNumber}</span>
						<span>Credits</span>
					</div>
				</div>

				{/* Description */}
				<p className="text-gray-600 mt-4 text-sm">{course.discussion}</p>

				{/* Instructor */}
				<p className="text-gray-500 text-sm mt-2">
					<span className="font-semibold">Speaker:</span>{" "}
					{course.instructorName}
				</p>

				<div className="flex items-center gap-4 mt-6">
					{isLoggedIn ? (
						<button
							disabled={isDisabled}
							onClick={() => !isDisabled && handleRegister(course)}
							className={`text-white text-sm font-medium py-2 px-4 rounded-lg transition ${
								isDisabled
									? "bg-gray-400 cursor-not-allowed"
									: "bg-orange-500 hover:bg-orange-600"
							}`}
						>
							{primaryButtonLabel}
						</button>
					) : (
						<Link to="/login">
							<button className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition">
								Login to Register
							</button>
						</Link>
					)}
					<Link to={`/courseDetails?courseId=${course._id}`}>
						<button className="bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition">
							Learn More
						</button>
					</Link>
				</div>
				{statusMessage && (
					<p
						className={`text-sm mt-2 ${
							registrationStatus === "waitlisted"
								? "text-blue-600"
								: "text-green-600"
						}`}
					>
						{statusMessage}
					</p>
				)}
			</div>
			<div className="w-1/4 bg-gray-300">
				<img
					src="https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg"
					alt="Course"
					className="object-cover w-full h-full"
				/>
			</div>
		</div>
	);
}
