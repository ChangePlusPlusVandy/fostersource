import React, { useState } from "react";

interface CatalogSearchBarProps {
    onSearch: (query: string) => void;
}

export default function CatalogSearchBar({ onSearch }: CatalogSearchBarProps) {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get("searchQuery") as string;
        onSearch(query);
    };

    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedRating, setSelectedRating] = useState<string>("All");
    const [selectedCredits, setSelectedCredits] = useState<string>("All");
    const [selectedFormat, setSelectedFormat] = useState<string>("All");

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

            {/* Filters */}
            <div className="flex flex-wrap gap-4">

                {/* Category Filter */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block appearance-none w-44 bg-gray-200 border border-gray-300 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="All">Category</option>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Technology">Technology</option>
                    </select>
                </div>

                {/* Rating Filter */}
                <div className="relative">
                    <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="block appearance-none w-44 bg-gray-200 border border-gray-300 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="All">Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                    </select>
                </div>

                {/* Credits Filter */}
                <div className="relative">
                    <select
                        value={selectedCredits}
                        onChange={(e) => setSelectedCredits(e.target.value)}
                        className="block appearance-none w-44 bg-gray-200 border border-gray-300 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="All">Credits</option>
                        <option value="1">1 Credit</option>
                        <option value="2">2 Credits</option>
                        <option value="3">3 Credits</option>
                    </select>
                </div>

                {/* Format Filter */}
                <div className="relative">
                    <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="block appearance-none w-44 bg-gray-200 border border-gray-300 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="All">Format</option>
                        <option value="Online">Online</option>
                        <option value="In-Person">In-Person</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
