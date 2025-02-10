export const dummyCourses = [
	{
		className: "Introduction to Computer Science",
		description:
			"Learn the basics of computer science, programming, and problem-solving.",
		instructor: "Dr. Alice Johnson",
		creditNumber: 3,
		discussion: "An interactive discussion about computational thinking.",
		components: ["Lectures", "Labs", "Quizzes"],
		handouts: ["syllabus.pdf", "lecture1.pdf", "assignment1.pdf"],
		ratings: [
			{ userId: "user1", courseId: "cs101", rating: 2 },
			{ userId: "user2", courseId: "cs101", rating: 2 },
		],
		isLive: false,
		cost: 100,
		categories: ["Technology"],
		thumbnailPath: "",
	},
	{
		className: "Advanced Mathematics",
		description: "Dive into complex mathematical theories and applications.",
		instructor: "Professor Bob Smith",
		creditNumber: 4,
		discussion: "Weekly seminars focusing on real-world problem-solving.",
		components: ["Lectures", "Projects", "Exams"],
		handouts: ["syllabus.pdf", "formulas.pdf"],
		ratings: [
			// { userId: "user3", courseId: "math201", rating: 4 },
			// { userId: "user4", courseId: "math201", rating: 3 },
		],
		isLive: false,
		cost: 0,
		categories: [],
		thumbnailPath: "",
	},
	{
		className: "Introduction to Philosophy",
		description:
			"Explore the foundational questions of human existence and thought.",
		instructor: "Dr. Clara Davis",
		creditNumber: 3,
		discussion:
			"Weekly discussions about classic and modern philosophical texts.",
		components: ["Lectures", "Essays", "Group Work"],
		handouts: ["syllabus.pdf", "plato.pdf", "kant.pdf"],
		ratings: [
			{ userId: "user5", courseId: "phil101", rating: 4 },
			{ userId: "user6", courseId: "phil101", rating: 4 },
		],
		isLive: true,
		cost: 200,
		categories: [],
		thumbnailPath: "",
	},
];
