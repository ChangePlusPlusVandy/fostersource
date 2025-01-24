import React, { useState } from "react";
import Dropdown from "../../components/dropdown-select";

interface CatalogSearchBarProps {
	onSearch: (query: string) => void;
	updateFilters: (filterType: string, filterValue: string) => void;
}

export default function CatalogSearchBar({
	onSearch,
	updateFilters,
}: CatalogSearchBarProps) {
	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const query = formData.get("searchQuery") as string;
		onSearch(query);
	};

	const categoryMenuItems = [
		{
			label: "All",
			onClick: () => {
				setSelectedCategory("All");
				updateFilters("category", "All");
			},
		},
		{
			label: "Technology",
			onClick: () => {
				setSelectedCategory("Technology");
				updateFilters("category", "Technology");
			},
		},
	];
	const ratingMenuItems = [
		{
			label: "All",
			onClick: () => {
				setSelectedRating("All");
				updateFilters("rating", "All");
			},
		},
		{
			label: "1+",
			onClick: () => {
				setSelectedRating("1+");
				updateFilters("rating", "1");
			},
		},
		{
			label: "2+",
			onClick: () => {
				setSelectedRating("2+");
				updateFilters("rating", "2");
			},
		},
		{
			label: "3+",
			onClick: () => {
				setSelectedRating("3+");
				updateFilters("rating", "3");
			},
		},
		{
			label: "4+",
			onClick: () => {
				setSelectedRating("4+");
				updateFilters("rating", "4");
			},
		},
		{
			label: "5",
			onClick: () => {
				setSelectedRating("5");
				updateFilters("rating", "5");
			},
		},
	];
	const creditsMenuItems = [
		{
			label: "All",
			onClick: () => {
				setSelectedCredits("All");
				updateFilters("credits", "All");
			},
		},
		{
			label: "1",
			onClick: () => {
				setSelectedCredits("1");
				updateFilters("credits", "1");
			},
		},
		{
			label: "2",
			onClick: () => {
				setSelectedCredits("2");
				updateFilters("credits", "2");
			},
		},
		{
			label: "3",
			onClick: () => {
				setSelectedCredits("3");
				updateFilters("credits", "3");
			},
		},
		{
			label: "4",
			onClick: () => {
				setSelectedCredits("4");
				updateFilters("credits", "4");
			},
		},
	];
	const formatMenuItems = [
		{
			label: "All",
			onClick: () => {
				setSelectedFormat("All");
				updateFilters("format", "All");
			},
		},
		{
			label: "Live",
			onClick: () => {
				setSelectedFormat("Live");
				updateFilters("format", "Live");
			},
		},
		{
			label: "On-Demand",
			onClick: () => {
				setSelectedFormat("On-Demand");
				updateFilters("format", "On-Demand");
			},
		},
	];
	const costMenuItems = [
		{
			label: "All",
			onClick: () => {
				setSelectedCost("All");
				updateFilters("cost", "All");
			},
		},
		{
			label: "Free",
			onClick: () => {
				setSelectedCost("Free");
				updateFilters("cost", "0");
			},
		},
	];

	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedRating, setSelectedRating] = useState<string>("All");
	const [selectedCredits, setSelectedCredits] = useState<string>("All");
	const [selectedFormat, setSelectedFormat] = useState<string>("All");
	const [selectedCost, setSelectedCost] = useState<string>("All");

	return (
		<div className="flex flex-col gap-4 mb-6">
			<form className="flex items-center gap-2" onSubmit={handleSearch}>
				<input
					type="text"
					name="searchQuery"
					placeholder="Search"
					className="border border-gray-300 py-2 px-4 rounded-lg w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-orange-500"
				/>
				<button
					type="submit"
					className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
				>
					Search
				</button>
			</form>

			<div className="flex space-x-4">
				<Dropdown
					buttonLabel={`Category: ${selectedCategory}`}
					menuItems={categoryMenuItems}
				/>
				<Dropdown
					buttonLabel={`Rating: ${selectedRating}`}
					menuItems={ratingMenuItems}
				/>
				<Dropdown
					buttonLabel={`Credits: ${selectedCredits}`}
					menuItems={creditsMenuItems}
				/>
				<Dropdown
					buttonLabel={`Format: ${selectedFormat}`}
					menuItems={formatMenuItems}
				/>
				<Dropdown
					buttonLabel={`Cost: ${selectedCost}`}
					menuItems={costMenuItems}
				/>
			</div>
		</div>
	);
}
