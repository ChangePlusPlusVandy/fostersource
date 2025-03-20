import { useState, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import "./adminSidebar.css";
import {
	Users,
	FileText,
	Settings,
	LogOut,
	Layers,
	LogIn,
	KeyRound,
} from "lucide-react";
import authService from "../../../services/authService";
import { log } from "console";
import internal from "stream";

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

// export const userInfo = {
// 	name: "First L.",
// 	role: "No role",
// 	isLoggedIn: false,
// 	isAdmin: true
// };

// All sidebar entries
export const adminSidebarItems = [
	{
		icon: <Layers />,
		description: "Products",
		href: "/admin/products",
	},
	{
		icon: <Users />,
		description: "Users",
		href: "/admin/users",
	},
	{
		icon: <FileText />,
		description: "Content",
		href: "/admin/content",
	},
	{
		icon: <Settings />,
		description: "Settings",
		href: "/admin/settings",
	},
];

//Admin information for conditional rendering
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
interface AdminSidebarProps {
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

// The Sidebar itself
export function AdminSidebar({ isLoggedIn, setIsLoggedIn }: AdminSidebarProps) {
	// User Info
	const name = isLoggedIn ? JSON.parse(localStorage.user).name : "Log In";
	const role = isLoggedIn ? JSON.parse(localStorage.user).role : "Log In";
	// const name =  "Log In";
	// const role = "Log In";
	const isCollapsed = true;

	return (
		<div className="admin-sidebar">
			<Profile
				isCollapsed={isCollapsed}
				isLoggedIn={isLoggedIn}
				name={name}
				role={role}
			/>
			<AdminSidebarItems
				isCollapsed={isCollapsed}
				isLoggedIn={isLoggedIn}
				isAdmin={userInfo.isAdmin}
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
						<button className="admin-login text-white rounded p-3 flex gap-3 justify-center text-center w-full">
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

interface AdminSidebarItemsProps {
	isLoggedIn: boolean;
	isAdmin: boolean;
	isCollapsed: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

// Display and handle sidebar entries
export function AdminSidebarItems({
	isCollapsed,
	isLoggedIn,
	isAdmin,
	setIsLoggedIn,
}: AdminSidebarItemsProps) {
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

	const sidebarItems = adminSidebarItems.map(({ icon, description, href }) => {
		const active = activeItem === href ? "active" : "";
		const iconDescMargin = !isCollapsed ? "mr-4" : "";

		return (
			<li
				key={href + description}
				className={`${active}`}
				onClick={() => {
					setActiveItem(window.location.pathname);
				}}
			>
				<Link to={href}>
					<div className={`${iconDescMargin}`}>{icon}</div>
				</Link>
			</li>
		);
	});

	const logoutActive = activeItem === logout.href ? "active" : "";
	const iconDescMargin = !isCollapsed ? "mr-4" : "";

	return (
		<ul className="admin-menu mb-4">
			{sidebarItems}
			{isLoggedIn && (
				<div className="logout">
					<li className={`${logoutActive}`} onClick={() => handleLogOut()}>
						<div className={`${iconDescMargin}`}>{logout.icon}</div>
						<Link to={logout.href}>{!isCollapsed && logout.description}</Link>
					</li>
				</div>
			)}
		</ul>
	);
}
