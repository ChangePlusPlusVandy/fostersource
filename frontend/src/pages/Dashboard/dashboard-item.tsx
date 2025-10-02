import React from "react";
import { Course } from "../../shared/types/course";
import { Link } from "react-router-dom";

interface DashboardItemProps {
	course: Course;
}

export default function DashboardItem({ course }: DashboardItemProps) {
	// Handle case where course is null (deleted course)
	if (!course) {
		return (
			<div className="flex bg-red-50 shadow-lg rounded-lg overflow-hidden border border-red-200">
				<div className="w-3/4 p-6">
					<h2 className="text-2xl font-semibold text-red-800">
						Course Not Available
					</h2>
					<p className="text-red-600 mt-2">
						This course has been removed or is no longer available.
					</p>
				</div>
				<div className="w-1/4 bg-red-300">
					<img
						src="https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg"
						alt="Course not available"
						className="object-cover w-full h-full opacity-50"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
			<div className="w-3/4 p-6">
				<h2 className="text-2xl font-semibold text-gray-800">
					{course.className}
				</h2>
				<div className="flex items-center gap-4 mt-6">
					<Link
						to={`/courseDetails?courseId=${course._id}`}
						className="bg-orange-500 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition"
					>
						Enter Course
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
