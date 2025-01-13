import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
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

interface HeaderBarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

// The Header Bar
export function HeaderBar({ isOpen, setIsOpen }: HeaderBarProps) {
  // State to handle collapsibility
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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
      {!isCollapsed ? (
        <HeaderItems displayOptions="header-menu flex-row" />
      ) : (
        <ul className="header-hamburger">
          <a href="#" className="w-full">
            <button
              className="rounded p-3 flex gap-3 justify-end text-center w-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </a>
        </ul>
      )}
    </div>
  );
}

// Display the Fostersource logo
function FosterSourceLogo() {
  return (
    <img
      src="/assets/fostersource-logo.png"
      alt="FosterSource logo"
      className="header-image"
    />
  );
}

interface HeaderItemsProps {
  displayOptions: string;
  outline?: string;
}

// Display and handle header bar entries
export function HeaderItems({ displayOptions, outline }: HeaderItemsProps) {
  const headerItemList = headerItems.map(({ description, href }) => (
    <li className="border-black border-solid">
      <Link to={href}>{description}</Link>
    </li>
  ));

  return <ul className={`${displayOptions}`}>{headerItemList}</ul>;
}

export default HeaderBar;
