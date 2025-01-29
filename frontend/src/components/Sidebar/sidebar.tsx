import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import {
	House,
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

// User information
export const userInfo = {
	name: "First L.",
	role: localStorage.user? localStorage.user.role : null,
	isLoggedIn: false,
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
		href: "#",
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
		href: "#",
	},
];

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
}

// The Sidebar itself
export function Sidebar({
	isCollapsed,
	setIsCollapsed,
	isLoggedIn,
	setIsLoggedIn,
}: SidebarProps) {
	// User Info
	const name = isLoggedIn ? JSON.parse(localStorage.user).name : "Log In";
	const role = isLoggedIn ? userInfo.role : "Log In";
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
					// src="assets/cute_ghost.jpeg"
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
}

// Display and handle sidebar entries
export function SidebarItems({
	isCollapsed,
	isLoggedIn,
	setIsLoggedIn,
}: SidebarItemsProps) {
	// Helper function for active tab highlighting
	// const handleItemClick = (item: string) => {
	// 	setActiveItem(item);
	// };

	const handleLogOut = async () => {
		// handleItemClick("logout");
		try {
			await authService.logout();
		} catch (err: any) {
			console.error("Login error:", err);
		} finally {
			setIsLoggedIn(authService.isAuthenticated());
			window.location.href = "/login";
		}
	};

	const [activeItem, setActiveItem] = useState<string>(window.location.pathname);

	const sidebarItems = items.map(({ icon, description, href }) => {
		const active = activeItem === href  ? "active" : "";
		const iconDescMargin = !isCollapsed ? "mr-4" : "";

		return (
			<li className={`${active}`} onClick={() => setActiveItem(window.location.pathname)}>
				<div className={`${iconDescMargin}`}>{icon}</div>
				<Link to={href}>{!isCollapsed && description}</Link>
			</li>
		);
	});

	const active = activeItem === logout.description ? "active" : "";
	const iconDescMargin = !isCollapsed ? "mr-4" : "";

	return (
		<ul className="menu mb-4">
			{sidebarItems}
			{isLoggedIn && (
				<div className="logout">
					<li className={`${active}`} onClick={() => handleLogOut()}>
						<div className={`${iconDescMargin}`}>{logout.icon}</div>
						<Link to={logout.href}>{!isCollapsed && logout.description}</Link>
					</li>
				</div>
			)}
		</ul>
	);
}
