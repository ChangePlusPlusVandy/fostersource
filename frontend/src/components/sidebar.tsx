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

export const items = () => [
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
];

export function Sidebar({ children }: { children?: ReactNode }) {
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
      <ul className="menu">
        <SidebarItems />
      </ul>
    </div>
  );
}

interface SidebarItemsProps {
  icon: any;
  description: string | null;
  href: string | null;
}

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

  return (
    <>
      <li
        className={activeItem === "home" ? "active" : ""}
        onClick={() => handleItemClick("home")}
      >
        <House />
        {!isCollapsed && <Link to="/">Home</Link>}
      </li>

      <li
        className={activeItem === "dashboard" ? "active" : ""}
        onClick={() => handleItemClick("dashboard")}
      >
        <LayoutDashboard />
        {!isCollapsed && <Link to="/">Dashboard</Link>}
      </li>
      <li
        className={activeItem === "catalog" ? "active" : ""}
        onClick={() => handleItemClick("catalog")}
      >
        <BookOpen />
        {!isCollapsed && <Link to="/">Catalog</Link>}
      </li>
      <li
        className={activeItem === "podcasts" ? "active" : ""}
        onClick={() => handleItemClick("podcasts")}
      >
        <Mic />
        {!isCollapsed && <Link to="/">Podcasts</Link>}
      </li>
      <li
        className={activeItem === "calendar" ? "active" : ""}
        onClick={() => handleItemClick("calendar")}
      >
        <Calendar />
        {!isCollapsed && <Link to="/">Calendar</Link>}
      </li>
      <li
        className={activeItem === "faqs" ? "active" : ""}
        onClick={() => handleItemClick("faqs")}
      >
        <MessageCircleQuestion />
        {!isCollapsed && <Link to="/">FAQs</Link>}
      </li>
      <li
        className={activeItem === "cart" ? "active" : ""}
        onClick={() => handleItemClick("cart")}
      >
        <ShoppingCart />
        {!isCollapsed && <Link to="/">Cart</Link>}
      </li>
      <li
        className={activeItem === "contact" ? "active" : ""}
        onClick={() => handleItemClick("contact")}
      >
        <Phone />
        {!isCollapsed && <Link to="/">Contact</Link>}
      </li>
      <div className="logout">
        <li
          className={activeItem === "logout" ? "active" : ""}
          onClick={() => handleItemClick("logout")}
        >
          <LogOut />
          {!isCollapsed && <Link to="/">Logout</Link>}
        </li>
      </div>
    </>
  );
}
