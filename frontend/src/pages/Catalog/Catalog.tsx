import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Course } from "../../shared/types/course";
import CatalogCourseComponent from "./CatalogCourseComponent";
import CatalogSearchBar from "./CatalogSearchBar";
import { dummyCourses } from "../../shared/DummyCourses";
import apiClient from "../../services/apiClient";

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

	// Read query parameters from the URL and apply filters
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await apiClient.get("/courses");
				setCourses(response.data.data);
				setFilteredCourses(response.data.data);
			} catch (error) {
				console.error(error);
			}
		}
		fetchData();
	}, []);
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
					{filteredCourses.length > 0 ? (
						filteredCourses.map((course, index) => (
							<CatalogCourseComponent key={index} course={course} setCartItemCount={setCartItemCount} />
						))
					) : (
						<p className="text-gray-600 text-center">No courses found.</p>
					)}
				</div>
			</div>
		</div>
	);
}
