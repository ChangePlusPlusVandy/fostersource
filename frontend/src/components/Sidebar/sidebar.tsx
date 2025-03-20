import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import {
	House,
	KeyRound,
	LayoutDashboard,
	BookOpen,
	Mic,
	Calendar,
	MessageCircleQuestion,
	ShoppingCart,
	Phone,
	LogOut,
	LogIn,
} from "lucide-react";

import authService from "../../services/authService";
import { log } from "console";
import { User } from "../../shared/types/user";
import apiClient from "../../services/apiClient";

// User information
export const userInfo = {
	name: "First L.",
	role: localStorage.user ? localStorage.user.role : "No role",
	isLoggedIn: false,
	isAdmin: localStorage.user
		? localStorage.user.role === "staff"
			? true
			: false
		: false,
};

// All sidebar entries
export const items = [
	{
		icon: <House />,
		description: "Home",
		href: "/",
	},
	{
		icon: <LayoutDashboard />,
		description: "Dashboard",
		href: "/dashboard",
	},
	{
		icon: <BookOpen />,
		description: "Catalog",
		href: "/catalog",
	},
	{
		icon: <Mic />,
		description: "Podcasts",
		href: "#",
	},
	{
		icon: <Calendar />,
		description: "Calendar",
		href: "/calendar",
	},
	{
		icon: <MessageCircleQuestion />,
		description: "FAQs",
		href: "#",
	},
	{ icon: <ShoppingCart />, description: "Cart", href: "/cart" },
	{
		icon: <Phone />,
		description: "Contact",
		href: "mailto:info@fostersource.org",
	},
];

// Admin information for conditional rendering
export const admin = {
	icon: <KeyRound />,
	description: "Admin Tools",
	href: "/admin",
};

// Logout information for conditional rendering
export const logout = {
	icon: <LogOut />,
	description: "Logout",
	href: "#",
};

// State of collapsibility, abstracted
interface SidebarProps {
	isCollapsed: boolean;
	setIsCollapsed: Dispatch<SetStateAction<boolean>>;
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	cartItemCount: number;
}

// The Sidebar itself
export function Sidebar({
	isCollapsed,
	setIsCollapsed,
	isLoggedIn,
	setIsLoggedIn,
	cartItemCount,
}: SidebarProps) {
	// User Info
	const name = isLoggedIn ? JSON.parse(localStorage.user).name : "Log In";
	const role = isLoggedIn ? JSON.parse(localStorage.user).role : "Log In";
	// Automatically collapse sidebar for narrow screens
	useEffect(() => {
		const handleResize = () => {
			setIsCollapsed(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="sidebar">
			<Profile
				isCollapsed={isCollapsed}
				isLoggedIn={isLoggedIn}
				name={name}
				role={role}
			/>
			<SidebarItems
				isCollapsed={isCollapsed}
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				cartItemCount={cartItemCount}
			/>
		</div>
	);
}

interface ProfileProps {
	isCollapsed: boolean;
	isLoggedIn: boolean;
	name?: string;
	role?: string;
}

// Display either profile information or log in button
export function Profile({ isCollapsed, isLoggedIn, name, role }: ProfileProps) {
	return (
		<div className="profile flex flex-row items-center w-full">
			{!isLoggedIn && (
				<div className="w-full flex justify-center">
					<Link to={"/login"} className="w-full">
						<button className="login text-white rounded p-3 flex gap-3 justify-center text-center w-full">
							<LogIn /> {!isCollapsed && "Login"}
						</button>
					</Link>
				</div>
			)}
			{isLoggedIn && (
				<img
					src={
						"https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png"
					}
					alt="Profile"
					className="profile-pic"
				/>
			)}
			{isLoggedIn && !isCollapsed && (
				<div className="pl-3 align-middle">
					<p className="text-xl font-medium text-wrap">{name}</p>
					<p className="text-xs text-gray-600 mt-1">{role}</p>
				</div>
			)}
		</div>
	);
}

interface SidebarItemsProps {
	isLoggedIn: boolean;
	isCollapsed: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	cartItemCount: number;
}

// Display and handle sidebar entries
export function SidebarItems({
	isCollapsed,
	isLoggedIn,
	setIsLoggedIn,
	cartItemCount,
}: SidebarItemsProps) {
	const [isAdmin, setIsAdmin] = useState(false);

	const checkAdmin = async () => {
		try {
			const response = await apiClient.get("/users/is-admin");
			setIsAdmin(response.data.isAdmin);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		checkAdmin();
	}, []);

	const handleLogOut = async () => {
		try {
			await authService.logout();
		} catch (err: any) {
			console.error("Login error:", err);
		} finally {
			setIsLoggedIn(authService.isAuthenticated());
			window.location.href = "/login";
		}
	};

	const [activeItem, setActiveItem] = useState<string>(
		window.location.pathname
	);

	const sidebarItems = items.map(({ icon, description, href }) => {
		const active = activeItem === href ? "active" : "";
		const iconDescMargin = !isCollapsed ? "mr-4" : "";

		return (
			<li
				key={href + description}
				className={`${active}`}
				onClick={() => setActiveItem(window.location.pathname)}
			>
				<Link to={href}>
					<div className={`${iconDescMargin}`}>{icon}</div>
					{!isCollapsed && description}{" "}
					{description === "Cart" && cartItemCount !== 0
						? `(${cartItemCount})`
						: ""}
				</Link>
			</li>
		);
	});

	const adminActive = activeItem === admin.href ? "active" : "";
	const logoutActive = activeItem === logout.href ? "active" : "";
	const iconDescMargin = !isCollapsed ? "mr-4" : "";

	return (
		<ul className="menu mb-4">
			{isAdmin && (
				<li
					className={`${adminActive}`}
					onClick={() => {
						setActiveItem(window.location.pathname);
						window.location.href = admin.href;
					}}
				>
					<div className={`${iconDescMargin}`}>{admin.icon}</div>
					<Link to={""}>{!isCollapsed && admin.description}</Link>
				</li>
			)}
			{sidebarItems}
			{isLoggedIn && (
				<div className="logout">
					<li className={`${logoutActive}`} onClick={() => handleLogOut()}>
						<Link to={logout.href}>
							<div className={`${iconDescMargin}`}>{logout.icon}</div>
							{!isCollapsed && logout.description}
						</Link>
					</li>
				</div>
			)}
		</ul>
	);
}
