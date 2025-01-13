import { useState, useEffect } from "react";
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

// User information
export const userInfo = {
  name: "First L.",
  role: "Role",
  isLoggedIn: true,
};

// All sidebar entries
export const items = [
  {
    icon: <House />,
    description: "Home",
    href: "#",
  },
  {
    icon: <LayoutDashboard />,
    description: "Dashboard",
    href: "#",
  },
  {
    icon: <BookOpen />,
    description: "Catalog",
    href: "#",
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
  { icon: <ShoppingCart />, description: "Cart", href: "#" },
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

// The Sidebar itself
export function Sidebar() {
  // User Info
  const name = userInfo.name;
  const role = userInfo.role;
  const isLoggedIn = userInfo.isLoggedIn;

  // State to handle collapsibility
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 768
  );

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
      <SidebarItems isCollapsed={isCollapsed} isLoggedIn={isLoggedIn} />
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
          <a href="#" className="w-full">
            <button className="login text-white rounded p-3 flex gap-3 justify-center text-center w-full">
              <LogIn /> {!isCollapsed && "Login"}
            </button>
          </a>
        </div>
      )}
      {isLoggedIn && (
        <img
          src="assets/cute_ghost.jpeg"
          alt="Profile"
          className="profile-pic"
        />
      )}
      {!isCollapsed && (
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
}

// Display and handle sidebar entries
export function SidebarItems({ isCollapsed, isLoggedIn }: SidebarItemsProps) {
  // Helper function for active tab highlighting
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const [activeItem, setActiveItem] = useState<string>("");

  const sidebarItems = items.map(({ icon, description, href }) => {
    const active = activeItem === description ? "active" : "";
    const iconDescMargin = !isCollapsed ? "mr-4" : "";

    return (
      <li className={`${active}`} onClick={() => handleItemClick(description)}>
        <div className={`${iconDescMargin}`}>{icon}</div>
        <Link to={href}>{!isCollapsed && description}</Link>
      </li>
    );
  });

  const iconDescMargin = !isCollapsed ? "mr-4" : "";

  return (
    <ul className="menu mb-4">
      {sidebarItems}
      {isLoggedIn && (
        <li className="logout" onClick={() => handleItemClick("logout")}>
          <div className={`${iconDescMargin}`}>{logout.icon}</div>
          <Link to="#">{!isCollapsed && logout.description}</Link>
        </li>
      )}
    </ul>
  );
}
