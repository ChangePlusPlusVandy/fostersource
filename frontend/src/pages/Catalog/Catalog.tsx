import React, {useEffect, useState} from "react";
import {Course} from "../../sharedTypes/course"
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
                { userId: "user1", courseId: "cs101", rating: 2 },
                { userId: "user2", courseId: "cs101", rating: 2 },
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
                { userId: "user3", courseId: "math201", rating: 5 },
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

    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

    useEffect(() => {
        // Populate with dummy courses for testing
        setCourses(dummyCourses);
        setFilteredCourses(dummyCourses);
    }, []);


    const handleSearch = (query: string) => {
        const filtered = courses.filter((course) =>
            course.className.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto py-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Catalog</h1>
                <CatalogSearchBar onSearch={handleSearch} />
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

