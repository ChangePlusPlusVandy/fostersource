import { useEffect, useState } from "react";
import { Course } from "../../shared/types/course";
import { dummyCourses } from "../../shared/DummyCourses";

export default function Dashboard() {
	const [courses, setCourses] = useState<Course[]>([]);

	let user = localStorage.user;

	useEffect(() => {
		// console.log(user);
		setCourses([]);
	}, []);

	return <div>{JSON.stringify(user)}</div>;
}
