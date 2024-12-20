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
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li>
          <LayoutDashboard />
          <Link to="#">
            <i className="fas fa-home"></i> Dashboard
          </Link>
        </li>
        <li>
          <BookOpen />
          <Link to="#">
            <i className="fas fa-home"></i> Catalog
          </Link>
        </li>
        <li>
          <Mic />
          <Link to="#">
            <i className="fas fa-home"></i> Podcasts
          </Link>
        </li>
        <li>
          <Calendar />
          <Link to="#">
            <i className="fas fa-home"></i> Calendar
          </Link>
        </li>
        <li>
          <MessageCircleQuestion />
          <Link to="#">
            <i className="fas fa-home"></i> FAQs
          </Link>
        </li>
        <li>
          <ShoppingCart />
          <Link to="#">
            <i className="fas fa-home"></i> Cart
          </Link>
        </li>
        <li>
          <Phone />
          <Link to="#">
            <i className="fas fa-home"></i> Contact
          </Link>
        </li>
        <li>
          <LogOut />
          <Link to="#">
            <i className="fas fa-home"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
