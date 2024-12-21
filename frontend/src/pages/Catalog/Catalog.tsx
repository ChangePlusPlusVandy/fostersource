import React, {useEffect, useState} from "react";
import {Course} from "../../shared/types/course"
import CatalogCourseComponent from "./CatalogCourseComponent";
import CatalogSearchBar from "./CatalogSearchBar";

export default function Catalog() {

    const dummyCourses = [
        {
            className: "Introduction to Computer Science",
            description: "Learn the basics of computer science, programming, and problem-solving.",
            instructor: "Dr. Alice Johnson",
            creditNumber: 3,
            discussion: "An interactive discussion about computational thinking.",
            components: ["Lectures", "Labs", "Quizzes"],
            handouts: ["syllabus.pdf", "lecture1.pdf", "assignment1.pdf"],
            Ratings: [
                // { userId: "user1", courseId: "cs101", rating: 2 },
                // { userId: "user2", courseId: "cs101", rating: 2 },
            ],
            isLive: false
        },
        {
            className: "Advanced Mathematics",
            description: "Dive into complex mathematical theories and applications.",
            instructor: "Professor Bob Smith",
            creditNumber: 4,
            discussion: "Weekly seminars focusing on real-world problem-solving.",
            components: ["Lectures", "Projects", "Exams"],
            handouts: ["syllabus.pdf", "formulas.pdf"],
            Ratings: [
                { userId: "user3", courseId: "math201", rating: 4 },
                { userId: "user4", courseId: "math201", rating: 3 },
            ],
            isLive: false
        },
        {
            className: "Introduction to Philosophy",
            description: "Explore the foundational questions of human existence and thought.",
            instructor: "Dr. Clara Davis",
            creditNumber: 3,
            discussion: "Weekly discussions about classic and modern philosophical texts.",
            components: ["Lectures", "Essays", "Group Work"],
            handouts: ["syllabus.pdf", "plato.pdf", "kant.pdf"],
            Ratings: [
                { userId: "user5", courseId: "phil101", rating: 4 },
                { userId: "user6", courseId: "phil101", rating: 4 },
            ],
            isLive: true

        },
    ]

    const [courses, setCourses] = useState<Course[]>(dummyCourses);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedRating, setSelectedRating] = useState<string>("All");
    const [selectedCredits, setSelectedCredits] = useState<string>("All");
    const [selectedFormat, setSelectedFormat] = useState<string>("All");

    useEffect(() => {
        // Populate with dummy courses for testing
        setCourses(dummyCourses);
        setFilteredCourses(dummyCourses);
    }, []);

    useEffect(() => {
        let filtered = courses
        if(searchQuery !== ""){
            filtered = filtered.filter((course) =>
                course.className.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        //IDK what a category is lol
        // if(selectedCategory !== "All"){

        // }

        if(selectedRating !== "All"){
            filtered = filtered.filter((course) =>
                course.Ratings.length > 0 ? (course.Ratings.reduce((sum, r) => sum + r.rating, 0) / course.Ratings.length) >= parseInt(selectedRating) : false
            );
        }

        if(selectedCredits !== "All"){
            filtered = filtered.filter((course) =>
                course.creditNumber === parseInt(selectedCredits)
            );
        }

        if(selectedFormat !== "All"){
            if(selectedFormat === "Live"){
                filtered = filtered.filter((course) =>
                    course.isLive
                );
            }
            else{
                filtered = filtered.filter((course) =>
                    !course.isLive
                );
            }
        }
        console.log(filtered)
        setFilteredCourses(filtered);
    }, [searchQuery, selectedCategory, selectedRating, selectedCredits, selectedFormat]);


    const handleSearch = (query: string) => {
        setSearchQuery(query)
    };

    const updateFilters = (filterType: string, filterValue: string) => {

        switch(filterType){
            case "category":
                setSelectedCategory(filterValue)
                console.log("Not Implemented")
                break;
            case "rating":
                setSelectedRating(filterValue)
                break;
            case "credits":
                setSelectedCredits(filterValue)
                break;
            case "format":
                setSelectedFormat(filterValue)
                break;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto py-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Catalog</h1>
                <CatalogSearchBar onSearch={handleSearch} updateFilters={updateFilters}/>
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
