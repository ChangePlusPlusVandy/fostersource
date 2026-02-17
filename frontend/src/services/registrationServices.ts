import { Course } from "../shared/types/course";
import apiClient from "./apiClient";
import { dummyCourses } from "../shared/DummyCourses";

type RegistrationResult = {
	courseId: string;
	status: "enrolled" | "waitlisted" | "already-enrolled";
	progressId?: string;
};

export type RegistrationResponse = {
	success: boolean;
	message: string;
	results: RegistrationResult[];
};

export async function addToCart(course: Course) {
	let user = localStorage.getItem("user")
		? // @ts-ignore
			JSON.parse(localStorage.getItem("user"))
		: null;

	if (user.cart === "") {
		user.cart = [];
		localStorage.setItem("user", JSON.stringify(user));
	}

	let cartCourseInfo = {
		className: course.className,
		cost: user.role.cost,
		creditNumber: course.creditNumber,
		instructor: course.instructorName,
		_id: course._id,
	};
	const isCourseInCart = user.cart.some(
		(cartItem: any) => cartItem._id === cartCourseInfo._id
	);

	if (!isCourseInCart) {
		user.cart.push(cartCourseInfo);

		try {
			const response = await apiClient.put(`/users/${user._id}`, {
				cart: JSON.stringify(user.cart),
			});
		} catch (error) {
			console.error(error);
		}
		localStorage.setItem("user", JSON.stringify(user));
	}
}

export async function removeFromCart(course: {
	className: string;
	cost: number;
	creditNumber: number;
	instructor: string;
}) {
	let user = localStorage.user ? JSON.parse(localStorage.user) : null;
	let cartItems = user.cart;
	user.cart = cartItems.filter(
		(item: {
			className: string;
			cost: number;
			creditNumber: number;
			instructor: string;
			_id: string;
		}) => item.className !== course.className
	);
	try {
		const response = await apiClient.put(`/users/${user._id}`, {
			cart: JSON.stringify(user.cart),
		});
		if (response.status === 200) {
			localStorage.setItem("user", JSON.stringify(user));
		}
	} catch (error) {
		console.error(error);
	}
	window.location.reload();
}

export async function registerFromCart() {
	let user = localStorage.user ? JSON.parse(localStorage.user) : null;

	if (user === null) {
		return;
	}

	let classes = [];
	const cart = user.cart;
	for (let course of cart) {
		classes.push(course._id);
	}

	try {
		console.log("making request");
		const response = await apiClient.post(`/users/register`, {
			userId: user._id,
			courseIds: classes,
		});

		console.log("first call:", response.status);

		if (response.status === 201) {
			user.cart = [];
			try {
				const response = await apiClient.put(`/users/${user._id}`, {
					cart: "[]",
				});
				console.log("second call:", response.status);
				if (response.status === 200) {
					localStorage.setItem("user", JSON.stringify(user));
					window.location.reload();
					window.location.href = "/dashboard";
				}
			} catch (error) {
				console.error(error);
			}
		}
	} catch (error) {
		console.error(
			"Error registering user for courses:",
			// @ts-ignore
			error.response?.data || error.message
		);
	}
}

export async function registerForCourse(
	courseId: string
): Promise<RegistrationResponse> {
	const user = localStorage.user ? JSON.parse(localStorage.user) : null;

	if (user === null) {
		throw new Error("User is not logged in.");
	}

	try {
		const response = await apiClient.post(`/users/register`, {
			userId: user._id,
			courseIds: [courseId],
		});

		return response.data as RegistrationResponse;
	} catch (error) {
		console.error(
			"Error registering user for course:",
			// @ts-ignore
			error.response?.data || error.message
		);
		throw error;
	}
}

export async function insertCoursesIndividually() {
	try {
		for (const course of dummyCourses) {
			const response = await apiClient.post("/courses", course);
			console.log(`Course inserted: ${course.className}`, response.data);
		}
		console.log("All courses inserted successfully!");
	} catch (error) {
		//@ts-ignore
		console.error(
			"Error inserting courses:",
			//@ts-ignore
			error.response?.data || error.message
		);
	}
}
