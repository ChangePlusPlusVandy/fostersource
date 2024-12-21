import React, { ReactNode, useState } from "react";
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
  const user = "Lil Ghosty";
  const role = "Child";

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
        <li className={activeItem === "home" ? "active" : ""}>
          <House />
          <Link to="/" onClick={() => handleItemClick("home")}>
            Home
          </Link>
        </li>

        <li className={activeItem === "dashboard" ? "active" : ""}>
          <LayoutDashboard />
          <Link to="/" onClick={() => handleItemClick("dashboard")}>
            Dashboard
          </Link>
        </li>
        <li className={activeItem === "catalog" ? "active" : ""}>
          <BookOpen />
          <Link to="/" onClick={() => handleItemClick("catalog")}>
            Catalog
          </Link>
        </li>
        <li className={activeItem === "podcasts" ? "active" : ""}>
          <Mic />
          <Link to="/" onClick={() => handleItemClick("podcasts")}>
            Podcasts
          </Link>
        </li>
        <li className={activeItem === "calendar" ? "active" : ""}>
          <Calendar />
          <Link to="/" onClick={() => handleItemClick("calendar")}>
            Calendar
          </Link>
        </li>
        <li className={activeItem === "faqs" ? "active" : ""}>
          <MessageCircleQuestion />
          <Link to="/" onClick={() => handleItemClick("faqs")}>
            FAQs
          </Link>
        </li>
        <li className={activeItem === "cart" ? "active" : ""}>
          <ShoppingCart />
          <Link to="/" onClick={() => handleItemClick("cart")}>
            Cart
          </Link>
        </li>
        <li className={activeItem === "contact" ? "active" : ""}>
          <Phone />
          <Link to="/" onClick={() => handleItemClick("contact")}>
            Contact
          </Link>
        </li>
        <div className="logout">
          <li className={activeItem === "logout" ? "active" : ""}>
            <LogOut />
            <Link to="/" onClick={() => handleItemClick("logout")}>
              Logout
            </Link>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
