import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import "./adminSidebar.css"; // Import CSS file
import {
  Users,
  FileText,
  Settings,
  LogOut,
  Layers,
  LogIn
} from "lucide-react";
import authService from "../../../services/authService";

// Admin User Information
export const adminUserInfo = {
  name: localStorage.user ? JSON.parse(localStorage.user).name : "Admin",
  role: localStorage.user ? JSON.parse(localStorage.user).role : "Administrator",
  isLoggedIn: localStorage.user ? true : false,
};

// Sidebar menu items for admin
export const adminItems = [
  {
    icon: <Layers />,
    description: "Products",
    href: "/admin/products",
  },
  {
    icon: <Users />,
    description: "Users",
    href: "/admin/users",
  },
  {
    icon: <FileText />,
    description: "Content",
    href: "/admin/content",
  },
  {
    icon: <Settings />,
    description: "Settings",
    href: "/admin/settings",
  },
];

// Logout information
export const adminLogout = {
  icon: <LogOut />,
  description: "Logout",
  href: "#",
};

// Sidebar props interface
interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

// **Admin Sidebar Component**
export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isLoggedIn,
  setIsLoggedIn,
}: AdminSidebarProps) {
  const location = useLocation(); // ✅ Tracks current URL path

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  return (
    <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <AdminProfile isCollapsed={isCollapsed} isLoggedIn={isLoggedIn} />
      <AdminSidebarItems
        isCollapsed={isCollapsed}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        currentPath={location.pathname}
      />
    </div>
  );
}

// **Admin Profile Component**
interface AdminProfileProps {
  isCollapsed: boolean;
  isLoggedIn: boolean;
}

export function AdminProfile({ isCollapsed, isLoggedIn }: AdminProfileProps) {
  return (
    <div className="admin-profile flex flex-row items-center w-full p-3">
      {isLoggedIn ? (
        <img
          src="https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png"
          alt="Admin Profile"
          className="admin-profile-pic"
        />
      ) : (
        <Link to="/login" className="admin-login-button w-full">
          <button className="admin-login text-white rounded p-3 flex gap-3 justify-center text-center w-full">
            <LogIn /> {!isCollapsed && "Login"}
          </button>
        </Link>
      )}
      {isLoggedIn && !isCollapsed && (
        <div className="pl-3">
          <p className="admin-name text-lg font-medium">{adminUserInfo.name}</p>
          <p className="admin-role text-gray-500 text-sm">{adminUserInfo.role}</p>
        </div>
      )}
    </div>
  );
}

// **Admin Sidebar Items Component**
interface AdminSidebarItemsProps {
  isCollapsed: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  currentPath: string;
}

export function AdminSidebarItems({ isCollapsed, isLoggedIn, setIsLoggedIn, currentPath }: AdminSidebarItemsProps) {
  // ✅ Use `useState` to track the active item based on the current path
  const [activeItem, setActiveItem] = useState<string>(currentPath);

  // ✅ Ensure the active item updates when the route changes
  useEffect(() => {
    setActiveItem(currentPath);
  }, [currentPath]);

  const handleLogOut = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggedIn(false);
      window.location.href = "/login";
    }
  };

  const sidebarItems = adminItems.map(({ icon, description, href }) => {
    const isActive = activeItem === href;
    return (
      <li key={href} className={`admin-menu-item ${isActive ? "active" : ""}`} onClick={() => setActiveItem(href)}>
        <div className="admin-icon mr-4">{icon}</div>
        {!isCollapsed && <Link to={href} className="admin-menu-text">{description}</Link>}
      </li>
    );
  });

  return (
    <ul className="admin-menu mb-4">
      {sidebarItems}
      {isLoggedIn && (
        <div className="admin-logout">
          <li className="admin-menu-item" onClick={() => handleLogOut()}>
            <div className="admin-icon mr-4">{adminLogout.icon}</div>
            {!isCollapsed && <Link to={adminLogout.href} className="admin-menu-text">{adminLogout.description}</Link>}
          </li>
        </div>
      )}
    </ul>
  );
}
