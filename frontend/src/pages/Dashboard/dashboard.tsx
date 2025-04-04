import { useEffect, useState } from "react";
import { Course } from "../../shared/types/course";
import { fetchUserProgress } from "../../services/progressService";
import DashboardItem from "./dashboard-item";

export default function Dashboard() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [completedCourses, setCompletedCourses] = useState<any[]>([]);
	const [incompleteCourses, setIncompleteCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	let user = localStorage.user;

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const progresses = (await fetchUserProgress()).progresses;
				setIncompleteCourses(
					progresses.filter((p: any) => !p.course.isComplete)
				);
				setCompletedCourses(progresses.filter((p: any) => p.course.isComplete));
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		}
		fetchData();
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-4">My Courses</h1>

			{/* In progress. */}
			<div>
				<h3 className="text-xl font-semibold mb-2">In Progress</h3>
				{!loading ? (
					incompleteCourses.length > 0 ? (
						<div className="space-y-4">
							{incompleteCourses.map((progress) => (
								<DashboardItem course={progress.course} key={progress._id} />
							))}
						</div>
					) : (
						<p className="text-gray-500">No courses in progress.</p>
					)
				) : (
					<p>Loading</p>
				)}
			</div>

			{/* Completed Courses */}
			<div>
				<h3 className="text-xl font-semibold mb-2">Completed</h3>
				{!loading ? (
					completedCourses.length > 0 ? (
						<ul className="space-y-4">
							{completedCourses.map((course) => (
								<li
									key={course._id}
									className="p-4 border rounded-lg shadow bg-green-100"
								>
									<h4 className="text-lg font-medium">{course.className}</h4>
									<p className="text-gray-600">{course.description}</p>
									<p className="text-sm text-gray-500">
										Instructor: {course.instructor}
									</p>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500">No completed courses.</p>
					)
				) : (
					<p>Loading...</p>
				)}
			</div>
		</div>
	);
}
