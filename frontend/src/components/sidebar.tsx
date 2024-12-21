import { ReactNode, useState } from "react";
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
} from "lucide-react"; // Can change if want to use a different icon library

const Sidebar = ({ children }: { children?: ReactNode }) => {
  const user = "First L.";
  const role = "Role";

  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar mr-3">
      <div className="profile flex flex-row w-full">
        <img
          src="assets/cute_ghost.jpeg"
          alt="Profile"
          className="profile-pic"
        />
        <div className="pl-3 align-middle">
          <p className="text-xl font-medium text-wrap">{user}</p>
          <p className="text-xs text-gray-600 mt-1">{role}</p>
        </div>
      </div>
      <ul className="menu">
        <li
          className={activeItem === "home" ? "active" : ""}
          onClick={() => handleItemClick("home")}
        >
          <House />
          <Link to="/">Home</Link>
        </li>

        <li
          className={activeItem === "dashboard" ? "active" : ""}
          onClick={() => handleItemClick("dashboard")}
        >
          <LayoutDashboard />
          <Link to="/">Dashboard</Link>
        </li>
        <li
          className={activeItem === "catalog" ? "active" : ""}
          onClick={() => handleItemClick("catalog")}
        >
          <BookOpen />
          <Link to="/">Catalog</Link>
        </li>
        <li
          className={activeItem === "podcasts" ? "active" : ""}
          onClick={() => handleItemClick("podcasts")}
        >
          <Mic />
          <Link to="/">Podcasts</Link>
        </li>
        <li
          className={activeItem === "calendar" ? "active" : ""}
          onClick={() => handleItemClick("calendar")}
        >
          <Calendar />
          <Link to="/">Calendar</Link>
        </li>
        <li
          className={activeItem === "faqs" ? "active" : ""}
          onClick={() => handleItemClick("faqs")}
        >
          <MessageCircleQuestion />
          <Link to="/">FAQs</Link>
        </li>
        <li
          className={activeItem === "cart" ? "active" : ""}
          onClick={() => handleItemClick("cart")}
        >
          <ShoppingCart />
          <Link to="/">Cart</Link>
        </li>
        <li
          className={activeItem === "contact" ? "active" : ""}
          onClick={() => handleItemClick("contact")}
        >
          <Phone />
          <Link to="/">Contact</Link>
        </li>
        <div className="logout">
          <li
            className={activeItem === "logout" ? "active" : ""}
            onClick={() => handleItemClick("logout")}
          >
            <LogOut />
            <Link to="/">Logout</Link>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
