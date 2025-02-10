import { Course } from "../shared/types/course";
import apiClient from "./apiClient";

const backendUrl = "http://localhost:5001";

export async function addToCart(course: Course) {
	let user = localStorage.getItem("user")
		? // @ts-ignore
			JSON.parse(localStorage.getItem("user"))
		: null;

	if (!user.cart) {
		user.cart = [];
		localStorage.setItem("user", JSON.stringify(user));
	}

	let cartCourseInfo = {
		className: course.className,
		cost: course.cost,
		creditNumber: course.creditNumber,
		instructor: course.instructor,
	};
	const isCourseInCart = user.cart.some(
		(cartItem: any) => cartItem.className === cartCourseInfo.className
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

	console.log(localStorage.getItem("user"));
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
		}) => item.className !== course.className
	);
	try {
		const response = await apiClient.put(`/users/${user._id}`, {
			cart: JSON.stringify(user.cart),
		});
		localStorage.setItem("user", JSON.stringify(user));
	} catch (error) {
		console.error(error);
	}
	window.location.reload();
}
