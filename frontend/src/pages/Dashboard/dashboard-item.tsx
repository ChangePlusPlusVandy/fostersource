import React from "react";
import { Course } from "../../shared/types/course";
import { Link } from "react-router-dom";

interface DashboardItemProps {
    course: Course;
}

export default function DashboardItem({
                                                   course,
                                               }: DashboardItemProps) {

    return (
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="w-3/4 p-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {course.className}
                </h2>
                <div className="flex items-center gap-4 mt-6">
                    <button
                        className="bg-orange-500 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                    >
                        Enter Course
                    </button>
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
