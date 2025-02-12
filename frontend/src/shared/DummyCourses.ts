export const dummyCourses = [
	{
		className: "Introduction to Computer Science",
		courseDescription:
			"Learn the basics of computer science, programming, and problem-solving.",
		instructorName: "Dr. Alice Johnson",
		instructorDescription: "Expert in computer science education and research.",
		instructorRole: "Professor of Computer Science",
		creditNumber: 3,
		discussion: "An interactive discussion about computational thinking.",
		components: ["Lectures", "Labs", "Quizzes"],
		handouts: ["syllabus.pdf", "lecture1.pdf", "assignment1.pdf"],
		ratings: [],
		// ratings: [
		// 	{ userId: "user1", courseId: "cs101", rating: 2 },
		// 	{ userId: "user2", courseId: "cs101", rating: 2 },
		// ],
		isLive: false,
		cost: 100,
		categories: ["Technology"],
		thumbnailPath: "Blah",
		lengthCourse: 10, // Example: duration in weeks
		time: new Date("2025-03-01T10:00:00Z"), // Example date
		isInPerson: false,
	},
	{
		className: "Advanced Mathematics",
		courseDescription:
			"Dive into complex mathematical theories and applications.",
		instructorName: "Professor Bob Smith",
		instructorDescription:
			"Renowned mathematician specializing in applied mathematics.",
		instructorRole: "Professor of Mathematics",
		creditNumber: 4,
		discussion: "Weekly seminars focusing on real-world problem-solving.",
		components: ["Lectures", "Projects", "Exams"],
		handouts: ["syllabus.pdf", "formulas.pdf"],
		ratings: [], // Empty array since ratings were commented out
		isLive: false,
		cost: 0,
		categories: [],
		thumbnailPath: "Blah",
		lengthCourse: 12, // Example duration
		time: new Date("2025-04-10T15:00:00Z"), // Example date
		isInPerson: true,
	},
	{
		className: "Introduction to Philosophy",
		courseDescription:
			"Explore the foundational questions of human existence and thought.",
		instructorName: "Dr. Clara Davis",
		instructorDescription:
			"Philosopher and researcher in ethics and metaphysics.",
		instructorRole: "Professor of Philosophy",
		creditNumber: 3,
		discussion:
			"Weekly discussions about classic and modern philosophical texts.",
		components: ["Lectures", "Essays", "Group Work"],
		handouts: ["syllabus.pdf", "plato.pdf", "kant.pdf"],
		ratings: [],
		// ratings: [
		// 	{ userId: "user1", courseId: "cs101", rating: 2 },
		// 	{ userId: "user2", courseId: "cs101", rating: 2 },
		// ],
		isLive: true,
		cost: 200,
		categories: [],
		thumbnailPath: "Blah",
		lengthCourse: 8, // Example duration
		time: new Date("2025-02-20T12:00:00Z"), // Example date
		isInPerson: false,
	},
];
