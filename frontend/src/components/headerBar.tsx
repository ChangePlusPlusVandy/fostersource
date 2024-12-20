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
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li className={activeItem === "about" ? "active" : ""}>
          <Link to="/about" onClick={() => handleItemClick("about")}>
            <i className="fas fa-info-circle"></i> About
          </Link>
        </li>
        <li className={activeItem === "programs" ? "active" : ""}>
          <Link to="/programs" onClick={() => handleItemClick("programs")}>
            <i className="fas fa-th-list"></i> Programs
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i> Calendar
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i> How to help
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i> News
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i> Contact
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fas fa-home"></i> Portal
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderBar;
