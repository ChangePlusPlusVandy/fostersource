import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Course } from "../../shared/types/course";
import CatalogCourseComponent from "./CatalogCourseComponent";
import CatalogSearchBar from "./CatalogSearchBar";
import { dummyCourses } from "../../shared/DummyCourses";
import apiClient from "../../services/apiClient";
import {
	addToCart,
	insertCoursesIndividually,
} from "../../services/registrationServices";

interface CatalogProps {
	setCartItemCount: Dispatch<SetStateAction<number>>;
}
export default function Catalog({ setCartItemCount }: CatalogProps) {
	const [courses, setCourses] = useState<Course[]>([]);
	const location = useLocation();
	const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedRating, setSelectedRating] = useState<string>("All");
	const [selectedCredits, setSelectedCredits] = useState<string>("All");
	const [selectedFormat, setSelectedFormat] = useState<string>("All");
	const [selectedCost, setSelectedCost] = useState<string>("All");
	const [loading, setLoading] = useState(false);
	const [cart, setCart] = useState<Course[]>(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser).cart || [] : [];
	});

	// Read query parameters from the URL and apply filters
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const response = await apiClient.get("/courses");
				console.log(response.data.data)
				let courses = response.data.data.filter((course:Course) => new Date(course.regStart).getTime() < new Date().getTime());
				setCourses(courses);
				setFilteredCourses(courses);
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		}
		fetchData();
	}, []);
	// Initialize cart state from localStorage when the component mounts
	useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem("user") || "{}").cart || [];
		setCart(storedCart); // Initialize cart state with stored data
		setCartItemCount(storedCart.length); // Set cart item count based on localStorage cart
	}, []); // Empty dependency array means it only runs once when the component mounts
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const formatFilter = params.get("format");

		if (formatFilter) {
			setSelectedFormat(formatFilter);
		}
	}, [location.search]);

	// Apply filters when the state changes
	useEffect(() => {
		let filtered = courses;

		if (searchQuery !== "") {
			filtered = filtered.filter((course) =>
				course.className.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (selectedCategory !== "All") {
			filtered = filtered.filter((course) =>
				course.categories.includes(selectedCategory)
			);
		}

		if (selectedRating !== "All") {
			filtered = filtered.filter((course) =>
				course.ratings.length > 0
					? course.ratings.reduce((sum, r) => sum + r.rating, 0) /
					course.ratings.length >=
					parseInt(selectedRating)
					: false
			);
		}

		if (selectedCredits !== "All") {
			filtered = filtered.filter(
				(course) => course.creditNumber === parseInt(selectedCredits)
			);
		}

		if (selectedFormat !== "All") {
			filtered = filtered.filter((course) =>
				selectedFormat === "Live" ? course.isLive : !course.isLive
			);
		}

		if (selectedCost !== "All") {
			filtered = filtered.filter((course) => course.cost === 0);
		}

		setFilteredCourses(filtered);
	}, [
		searchQuery,
		selectedCategory,
		selectedRating,
		selectedCredits,
		selectedFormat,
		selectedCost,
		courses,
	]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const updateFilters = (filterType: string, filterValue: string) => {
		switch (filterType) {
			case "category":
				setSelectedCategory(filterValue);
				break;
			case "rating":
				setSelectedRating(filterValue);
				break;
			case "credits":
				setSelectedCredits(filterValue);
				break;
			case "format":
				setSelectedFormat(filterValue);
				break;
			case "cost":
				setSelectedCost(filterValue);
				break;
		}
	};

	async function registerAll() {
		await insertCoursesIndividually().then(() => {
			console.log("Inserted!");
		});
	}

	return (
		<div className="min-h-screen w-full">
			<div className="container mx-auto py-6">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Catalog</h1>
				<CatalogSearchBar
					onSearch={handleSearch}
					updateFilters={updateFilters}
					initialFormat={selectedFormat}
				/>
			</div>

			<div className="container mx-auto">
				<div className="flex flex-col gap-6">
					{loading ? (
						<p>Loading...</p>
					) : filteredCourses.length > 0 ? (
						filteredCourses.map((course, index) => (
							<CatalogCourseComponent
								key={course._id || index}
								course={course}
								setCartItemCount={setCartItemCount}
								isInCart={cart.some((c) => c._id === course._id)}
							/>
						))
					) : (
						<p className="text-gray-600 text-center">No courses found.</p>
					)}
				</div>
			</div>
			{/*<div>*/}
			{/*	<p onClick={() => registerAll()}> DEBUG ONLY: Add all courses individually to mongo</p>*/}
			{/*</div>*/}
		</div>
	);
}
