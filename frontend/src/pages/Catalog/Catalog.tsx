import React, { useEffect, useState } from "react";
import { Course } from "../../shared/types/course";
import CatalogCourseComponent from "./CatalogCourseComponent";
import CatalogSearchBar from "./CatalogSearchBar";
import { dummyCourses } from "../../shared/DummyCourses";

export default function Catalog() {
	const [courses, setCourses] = useState<Course[]>(dummyCourses);
	const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedRating, setSelectedRating] = useState<string>("All");
	const [selectedCredits, setSelectedCredits] = useState<string>("All");
	const [selectedFormat, setSelectedFormat] = useState<string>("All");
	const [selectedCost, setSelectedCost] = useState<string>("All");

	useEffect(() => {
		// Populate with dummy courses for testing
		setCourses(dummyCourses);
		setFilteredCourses(dummyCourses);
	}, []);

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
			if (selectedFormat === "Live") {
				filtered = filtered.filter((course) => course.isLive);
			} else {
				filtered = filtered.filter((course) => !course.isLive);
			}
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
	]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const updateFilters = (filterType: string, filterValue: string) => {
		switch (filterType) {
			case "category":
				setSelectedCategory(filterValue);
				console.log("Not Implemented");
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
				/>
			</div>

			<div className="container mx-auto">
				<div className="flex flex-col gap-6">
					{filteredCourses.map((course, index) => (
						<CatalogCourseComponent key={index} course={course} />
					))}
				</div>
			</div>
		</div>
	);
}
