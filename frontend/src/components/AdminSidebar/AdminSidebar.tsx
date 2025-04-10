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
// import { log } from "console";
// import internal from "stream";

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
	href?: string; // Optional for parent items
	subItems?: SubItem[];
};

export const adminSidebarItems: SidebarItem[] = [
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
	// Note: Settings and Logout are handled separately below the main list usually
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

	// State for tracking the active item (can be parent or sub-item href)
	const [activeItem, setActiveItem] = useState<string>(
		window.location.pathname
	);
	// State to track which parent item is expanded
	const [expandedItem, setExpandedItem] = useState<string | null>(null);

	// Determine if the current active item belongs to an expanded parent
	const parentOfActive = adminSidebarItems.find((item) =>
		item.subItems?.some((sub) => sub.href === activeItem)
	);
	// Initialize expandedItem if an active sub-item is found on load
	useState(() => {
		if (parentOfActive) {
			setExpandedItem(parentOfActive.description);
		}
	});

	return (
		// Removed dynamic 'expanded' class
		<div className="admin-sidebar hover:w-64 z-10 group">
			<Profile isLoggedIn={isLoggedIn} name={name} role={role} />
			<AdminSidebarItems
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				activeItem={activeItem}
				setActiveItem={setActiveItem}
				expandedItem={expandedItem}
				setExpandedItem={setExpandedItem}
			/>
			{/* Separate Settings and Logout */}
			<div className="admin-footer-items">
				<ul className="admin-menu flex flex-col items-center gap-2 p-4">
					{/* Settings Item */}
					<div className="w-full">
						<li
							key={"/admin/settings"}
							className={`${activeItem === "/admin/settings" ? "active" : ""} w-full rounded-md p-2 hover:text-[#7b4899]`}
							onClick={() => {
								setActiveItem("/admin/settings");
								window.location.href = "/admin/settings"; // Simple navigation for example
							}}
						>
							<Link
								to="/admin/settings"
								className="flex justify-center w-full rounded-md gap-4"
							>
								<div>
									<Settings />
								</div>
								<span className="hidden group-hover:block">Settings</span>
							</Link>
						</li>
					</div>

					{/* Logout Item */}
					{isLoggedIn && (
						<li
							key={"logout"}
							className="w-full px-2"
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
								tabIndex={0}
								className="flex justify-center w-full cursor-pointer gap-4 rounded-md hover:text-[#be0000]"
							>
								{/* Always apply margin */}
								<div>
									<LogOut />
								</div>
								{/* Always show text */}
								<span className="hidden group-hover:block">Logout</span>
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
}

// Display either profile information or log in button
export function Profile({ isLoggedIn, name, role }: ProfileProps) {
	return (
		<div className="align-middle my-7 flex justify-center w-max mx-auto group-hover:justify-start group-hover:mx-6">
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
					alt="Profile"
					className="profile-pic"
				/>
			)}
			{/* Always render name/role based on isLoggedIn */}
			{isLoggedIn && (
				<div className="hidden group-hover:block pl-3 align-middle profile-info">
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
	activeItem: string; // Pass activeItem state
	setActiveItem: Dispatch<SetStateAction<string>>; // Pass setter
	expandedItem: string | null; // Pass expandedItem state
	setExpandedItem: Dispatch<SetStateAction<string | null>>; // Pass setter
}

// Display and handle sidebar entries - Updated Logic
export function AdminSidebarItems({
	activeItem,
	setActiveItem,
	expandedItem,
	setExpandedItem,
}: AdminSidebarItemsProps) {
	const handleItemClick = (item: SidebarItem | SubItem) => {
		// If it's a parent item with subItems, toggle expansion
		if ("subItems" in item && item.subItems) {
			setExpandedItem(
				expandedItem === item.description ? null : item.description
			);
		} else if ("href" in item && item.href) {
			// If it's a clickable item (parent without subItems or a subItem)
			setActiveItem(item.href);
			// Potentially navigate using Link or programmatically
			// For simplicity here, we assume Link handles navigation
		}
	};

	return (
		<ul className="admin-menu flex flex-col flex-grow gap-5 p-6">
			<li
				key={"/"}
				onClick={() => {
					window.location.pathname = "/"; // Or use Link/navigate
				}}
			>
				<Link
					to="/"
					className="flex justify-center w-full gap-4 hover:text-[#7b4899] group-hover:justify-start"
				>
					{/* Always apply margin */}
					<div>
						<HomeIcon />
					</div>
					{/* Always show text */}
					<span className="hidden group-hover:block">Home</span>
				</Link>
			</li>

			{adminSidebarItems.map((item) => {
				const isParentActive =
					expandedItem === item.description ||
					(item.href && activeItem === item.href);
				const isExpanded = expandedItem === item.description;

				return (
					<div>
						<hr className="border-t border-purple-200 border-2 rounded-full mb-4" />
						<li
							key={item.description}
							tabIndex={0}
							// Add class if item itself is active or if it's the expanded parent
							className={`${isParentActive && !item.subItems ? "active" : ""} ${isExpanded ? "parent-expanded" : ""} justify-center`}
						>
							<div
								className="flex justify-center items-center w-full cursor-pointer group-hover:justify-between"
								onClick={() => handleItemClick(item)}
							>
								<div className="peer flex items-center hover:text-[#7b4899] gap-4">
									{item.icon}
									{/* Always show text */}
									<div className="hidden group-hover:block">
										{item.description}
									</div>
								</div>
								<div className="hidden group-hover:block peer-hover:text-[#7b4899]">
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
												className={`${isSubActive ? "active" : ""} hover:text-[#7b4899]`}
												onClick={(e) => {
													e.stopPropagation(); // Prevent parent li click
													handleItemClick(subItem);
												}}
											>
												<Link
													to={subItem.href}
													className="flex items-center w-full"
												>
													<div className="mr-1">{subItem.icon}</div>{" "}
													{/* Icon for sub-item */}
													<span className="hidden group-hover:block">
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
