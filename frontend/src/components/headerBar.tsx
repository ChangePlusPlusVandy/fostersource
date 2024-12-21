import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./headerBar.css";

const HeaderBar = () => {
  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="header flex flex-row w-full mb-3">
      <img
        src="/assets/fostersource-logo.png"
        alt="FosterSource logo"
        className="header-image"
      />
      <ul className="header-menu">
        <li className={activeItem === "home" ? "active" : ""}>
          <Link to="/" onClick={() => handleItemClick("home")}>
            Home
          </Link>
        </li>
        <li className={activeItem === "about" ? "active" : ""}>
          <Link to="/about" onClick={() => handleItemClick("about")}>
            About
          </Link>
        </li>
        <li className={activeItem === "programs" ? "active" : ""}>
          <Link to="/programs" onClick={() => handleItemClick("programs")}>
            Programs
          </Link>
        </li>
        <li>
          <Link to="/">Calendar</Link>
        </li>
        <li>
          <Link to="/">How to help</Link>
        </li>
        <li>
          <Link to="/">News</Link>
        </li>
        <li>
          <Link to="/">Contact</Link>
        </li>
        <li>
          <Link to="/">Portal</Link>
        </li>
        <li>
          <Link to="/">🇺🇸 English</Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderBar;
