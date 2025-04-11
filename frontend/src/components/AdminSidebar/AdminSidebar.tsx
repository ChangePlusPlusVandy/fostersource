import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Link } from "react-router-dom";
import "./adminSidebar.css";
import {
	Users,
	Settings,
	LogOut,
	Layers,
	LogIn,
	HomeIcon,
	ChevronDown,
	ChevronRight,
	Disc3,
	Mail,
	ClipboardList,
	Tag,
	BookOpen,
	FilePlus2,
	Type,
	Flag,
} from "lucide-react";
import authService from "../../services/authService";

// All sidebar entries - Updated structure
// Define types for better structure
type SubItem = {
	icon: JSX.Element;
	description: string;
	href: string;
};

type SidebarItem = {
	icon: JSX.Element;
	description: string;
	href?: string;
	subItems?: SubItem[];
};

export const mainItems: SidebarItem[] = [
	{
		icon: <HomeIcon />,
		description: "Home",
		href: "/",
	},
	{
		icon: <Layers />,
		description: "Products",
		subItems: [
			{
				icon: <Layers />,
				description: "All Products",
				href: "/admin/products",
			},
			{ icon: <Disc3 />, description: "Discounts", href: "/admin/discounts" },
			{ icon: <Mail />, description: "Emails", href: "/admin/email" },
			{
				icon: <ClipboardList />,
				description: "Registrants",
				href: "/admin/registrants",
			},
		],
	},
	{
		icon: <Users />,
		description: "Users",
		subItems: [
			{
				icon: <Users />,
				description: "All Users",
				href: "/admin/users",
			},
			{
				icon: <Tag />,
				description: "User Types",
				href: "/admin/user-types",
			},
		],
	},
	{
		icon: <BookOpen />,
		description: "Reports",
		subItems: [
			{
				icon: <FilePlus2 />,
				description: "Registration",
				href: "/admin/content",
			},
			{
				icon: <Type />,
				description: "Survey",
				href: "/admin/reports/survey",
			},
			{
				icon: <Flag />,
				description: "Progress",
				href: "/admin/reports/progress",
			},
		],
	},
];

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

	// State for tracking the active item (can be parent or sub-item href)
	const [activeItem, setActiveItem] = useState<string>(
		window.location.pathname
	);

	// State to track which parent item is expanded
	const [expandedItem, setExpandedItem] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [focusedItem, setFocusedItem] = useState<string | null>(null);

	// Determine if the current active item belongs to an expanded parent
	const parentOfActive = mainItems.find((item) =>
		item.subItems?.some((sub) => sub.href === activeItem)
	);

	// Initialize expandedItem if an active sub-item is found on load
	useState(() => {
		if (parentOfActive) {
			setExpandedItem(parentOfActive.description);
		}
	});

	useEffect(() => {
		console.log("isFocused", isFocused);
		console.log("focusedItem", focusedItem);
	}, [isFocused, focusedItem]);

	return (
		<div
			className={`admin-sidebar ${isFocused ? "w-64" : "w-20"} hover:w-64 z-10 group select-none`}
		>
			<Profile
				isLoggedIn={isLoggedIn}
				name={name}
				role={role}
				isFocused={isFocused}
			/>
			<AdminSidebarItems
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				activeItem={activeItem}
				setActiveItem={setActiveItem}
				expandedItem={expandedItem}
				setExpandedItem={setExpandedItem}
				isFocused={isFocused}
				setIsFocused={setIsFocused}
				focusedItem={focusedItem}
				setFocusedItem={setFocusedItem}
			/>
			<div className="admin-footer-items">
				<ul className="admin-menu flex flex-col items-center gap-2 p-4">
					{/* Settings Item */}
					<div className="w-full">
						<li
							key={"/admin/settings"}
							className={`${activeItem === "/admin/settings" ? "active" : ""} w-full rounded-md p-2 hover:text-[#7b4899]`}
							onClick={() => {
								setActiveItem("/admin/settings");
								window.location.href = "/admin/settings";
							}}
							onFocus={() => {
								setFocusedItem("/admin/settings");
								setIsFocused(true);
							}}
							onBlur={() => {
								setFocusedItem(null);
								setIsFocused(false);
							}}
						>
							<Link
								to="/admin/settings"
								className="flex justify-center w-full rounded-md gap-4"
							>
								<div>
									<Settings />
								</div>
								<span
									className={`${isFocused ? "block" : "hidden group-hover:block"}`}
								>
									Settings
								</span>
							</Link>
						</li>
					</div>

					{/* Logout Item */}
					{isLoggedIn && (
						<li
							key={"logout"}
							className="w-full px-2"
							onFocus={() => {
								setFocusedItem("/admin/logout");
								setIsFocused(true);
							}}
							onBlur={() => {
								setFocusedItem(null);
								setIsFocused(false);
							}}
							tabIndex={0}
							onClick={async () => {
								try {
									await authService.logout();
								} catch (err: any) {
									console.error("Logout error:", err);
								} finally {
									setIsLoggedIn(authService.isAuthenticated());
									window.location.href = "/login"; // Redirect after logout
								}
							}}
						>
							<div
								className={`flex justify-center w-full cursor-pointer gap-4 rounded-md hover:text-[#be0000] ${isFocused ? "!text-[#be0000]" : ""}`}
							>
								{/* Always apply margin */}
								<div>
									<LogOut />
								</div>
								{/* Always show text */}
								<span
									className={`${isFocused ? "block" : "hidden group-hover:block"}`}
								>
									Logout
								</span>
							</div>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}

interface ProfileProps {
	isLoggedIn: boolean;
	name?: string;
	role?: string;
	isFocused: boolean;
}

// Display either profile information or log in button
export function Profile({ isLoggedIn, name, role, isFocused }: ProfileProps) {
	return (
		<div
			className={`align-middle my-7 flex justify-center w-max mx-auto group-hover:mx-6 ${isFocused ? "!mx-6" : ""}`}
		>
			{!isLoggedIn && (
				<div className="w-full flex justify-center">
					<Link to={"/login"} className="w-full">
						{/* Always show "Login" text */}
						<button className="admin-login text-white rounded p-3 flex gap-3 justify-center text-center w-full">
							<LogIn /> Login
						</button>
					</Link>
				</div>
			)}
			{isLoggedIn && (
				<img
					src={
						"https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png"
					}
					alt="Your profile picture"
					className="profile-pic"
				/>
			)}
			{/* Always render name/role based on isLoggedIn */}
			{isLoggedIn && (
				<div
					className={`${isFocused ? "block" : "hidden group-hover:block"} pl-3 align-middle profile-info`}
				>
					<p className="text-xl font-medium text-wrap whitespace-nowrap">
						{name}
					</p>
					<p className="text-xs text-gray-600 mt-1">{role}</p>
				</div>
			)}
		</div>
	);
}

interface AdminSidebarItemsProps {
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	activeItem: string;
	setActiveItem: Dispatch<SetStateAction<string>>;
	expandedItem: string | null;
	setExpandedItem: Dispatch<SetStateAction<string | null>>;
	isFocused: boolean;
	setIsFocused: Dispatch<SetStateAction<boolean>>;
	focusedItem: string | null;
	setFocusedItem: Dispatch<SetStateAction<string | null>>;
}

// Display and handle sidebar entries - Updated Logic
export function AdminSidebarItems({
	activeItem,
	setActiveItem,
	expandedItem,
	setExpandedItem,
	isFocused,
	setIsFocused,
	focusedItem,
	setFocusedItem,
}: AdminSidebarItemsProps) {
	const handleItemClick = (item: SidebarItem | SubItem) => {
		// If it's a parent item with subItems, toggle expansion
		if (item.description === "Home") {
			window.location.href = "/";
		} else if ("subItems" in item && item.subItems) {
			setExpandedItem(
				expandedItem === item.description ? null : item.description
			);
		} else if ("href" in item && item.href) {
			// If it's a clickable item (parent without subItems or a subItem)
			setActiveItem(item.href);
		}
	};

	return (
		<ul className="admin-menu flex flex-col flex-grow px-4">
			{mainItems.map((item) => {
				const isParentActive =
					expandedItem === item.description ||
					(item.href && activeItem === item.href);
				const isExpanded = expandedItem === item.description;

				return (
					<div>
						{item.description !== "Home" && (
							<hr className="border-t border-purple-200 border-2 rounded-full my-2" />
						)}
						<li
							key={item.description}
							tabIndex={0}
							onFocus={() => {
								setFocusedItem(item.description);
								setIsFocused(true);
							}}
							onBlur={() => {
								setFocusedItem(null);
								setIsFocused(false);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleItemClick(item);
									if (item.href) {
										window.location.href = item.href;
									}
								}
							}}
							// Add class if item itself is active or if it's the expanded parent
							className={`${isParentActive && !item.subItems ? "active" : ""} ${isExpanded ? "parent-expanded" : ""} justify-center`}
						>
							<div
								className={`flex justify-center items-center w-full cursor-pointer group-hover:justify-between ${isFocused ? "justify-between" : "justify-center"} p-2 rounded-lg`}
								onClick={() => handleItemClick(item)}
							>
								<div
									className={`peer flex items-center hover:text-[#7b4899] gap-4 ${focusedItem === item.description ? "text-[#7b4899]" : ""}`}
								>
									{item.icon}
									{/* Always show text */}
									<div
										className={`${isFocused ? "block" : "hidden group-hover:block"}`}
									>
										{item.description}
									</div>
								</div>
								<div
									className={`${isFocused ? "block" : "hidden group-hover:block"} peer-hover:text-[#7b4899] ${focusedItem === item.description ? "text-[#7b4899]" : ""}`}
								>
									{item.subItems &&
										(isExpanded ? (
											<ChevronDown size={24} />
										) : (
											<ChevronRight size={24} />
										))}
								</div>
							</div>

							{/* Render Sub-menu if item has subItems, and is expanded */}
							{item.subItems && isExpanded && (
								<ul className="admin-submenu">
									{item.subItems.map((subItem) => {
										const isSubActive = activeItem === subItem.href;
										return (
											<li
												key={subItem.href}
												className={`${isSubActive ? "active" : ""} hover:text-[#7b4899] ml-3 p-2 mr-1 rounded-lg`}
												onClick={(e) => {
													e.stopPropagation(); // Prevent parent li click
													handleItemClick(subItem);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleItemClick(subItem);
														window.location.href = subItem.href;
													}
												}}
											>
												<Link
													to={subItem.href}
													className={`flex items-center w-full ${focusedItem === subItem.description ? "text-[#7b4899]" : ""} p-1`}
													onFocus={() => {
														setFocusedItem(subItem.description);
														setIsFocused(true);
													}}
													onBlur={() => {
														setFocusedItem(null);
														setIsFocused(false);
													}}
													tabIndex={0}
												>
													<div className="mr-1">{subItem.icon}</div>{" "}
													<span
														className={`${isFocused ? "block" : "hidden group-hover:block"}`}
													>
														{subItem.description}
													</span>
												</Link>
											</li>
										);
									})}
								</ul>
							)}
						</li>
					</div>
				);
			})}
		</ul>
	);
}
