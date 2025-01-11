import { ReactNode, useState, useEffect } from "react";
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
} from "lucide-react";
import { isConditionalExpression } from "typescript";

export function Sidebar() {
  const user = "First L.";
  const role = "Child";

  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 768
  );

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
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""} mr-3`}>
      <div className="profile flex flex-row w-full">
        <img
          src="assets/cute_ghost.jpeg"
          alt="Profile"
          className="profile-pic"
        />
        {!isCollapsed && (
          <div className="pl-3 align-middle">
            <p className="text-xl font-medium text-wrap">{user}</p>
            <p className="text-xs text-gray-600 mt-1">{role}</p>
          </div>
        )}
      </div>

      <SidebarItems />
    </div>
  );
}

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
    icon: <LogOut />,
    description: "Logout",
    href: "#",
  },
];

export function SidebarItems() {
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [activeItem, setActiveItem] = useState<string>("");

  const sidebarItems = items.map(({ icon, description, href }) => {
    const active = activeItem === description ? "active" : "";
    const logout = description === "Logout" ? "logout" : "";

    return (
      <div className={`${logout}`}>
        <li
          className={`${active}`}
          onClick={() => handleItemClick(description)}
        >
          {icon}
          <Link to={href}>{description}</Link>
        </li>
      </div>
    );
  });

  return <ul className="menu mb-4">{sidebarItems}</ul>;
}
