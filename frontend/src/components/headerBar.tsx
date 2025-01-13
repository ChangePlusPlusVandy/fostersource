import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./headerBar.css";

export const headerItems = [
  {
    description: "Home",
    href: "#",
  },
  {
    description: "About",
    href: "#",
  },
  {
    description: "Programs",
    href: "#",
  },
  {
    description: "Calendar",
    href: "#",
  },
  {
    description: "How to Help",
    href: "#",
  },
  {
    description: "News",
    href: "#",
  },
  {
    description: "Contact",
    href: "#",
  },
  {
    description: "Portal",
    href: "#",
  },
  {
    description: "🇺🇸 English",
    href: "#",
  },
];

// The Header Bar
const HeaderBar = () => {
  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  // State to handle collapsibility
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 768
  );

  // Automatically collapse header bar for narrow screens
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
    <div className="header flex flex-row w-full mb-3">
      <FosterSourceLogo />
      <HeaderItems />
    </div>
  );
};

// Display the Fostersource logo
export function FosterSourceLogo() {
  return (
    <img
      src="/assets/fostersource-logo.png"
      alt="FosterSource logo"
      className="header-image"
    />
  );
}

// Display and handle header bar entries
export function HeaderItems() {
  const headerItemList = headerItems.map(({ description, href }) => (
    <li>
      <Link to={href}>{description}</Link>
    </li>
  ));

  return <ul className="header-menu">{headerItemList}</ul>;
}

export default HeaderBar;
