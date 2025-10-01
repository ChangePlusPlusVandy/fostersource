import React, { Dispatch, SetStateAction } from "react";
import { Course } from "../../shared/types/course";
import { Link } from "react-router-dom";
import { addToCart } from "../../services/registrationServices";

interface CatalogCourseComponentProps {
	course: Course;
	setCartItemCount: Dispatch<SetStateAction<number>>;
	isInCart: boolean;
	isLoggedIn: boolean;
}

export default function CatalogCourseComponent({
	course,
	setCartItemCount,
	isInCart,
	isLoggedIn,
}: CatalogCourseComponentProps) {
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
		await addToCart(course).then(() => {
			setCartItemCount(
				localStorage.user ? JSON.parse(localStorage.user).cart.length : 0
			);
		});
	}

	// Check if course is at registration capacity
	const isAtCapacity =
		course.registrationLimit > 0 &&
		course.students.length >= course.registrationLimit;
	const isDisabled = isInCart || isAtCapacity;

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
							{isInCart
								? "Already in Cart"
								: isAtCapacity
									? "Course Full"
									: `Register (${
											localStorage.user &&
											JSON.parse(localStorage.user).role?.cost === 0
												? "Free"
												: localStorage.user
													? `${new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: "USD",
														}).format(JSON.parse(localStorage.user).role.cost)}`
													: "Free"
										})`}
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
