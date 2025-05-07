import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import apiClient from "../services/apiClient";
import RoutesAndLayout from "./RoutesAndLayouts";
import authService from "../services/authService";

// import AdminPage from "../pages/Admin/AdminPage";

function AppRoutes() {
	const [isHeaderBarOpen, setIsHeaderBarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(
		window.innerWidth < 768
	);

	const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
	const [cartItemCount, setCartItemCount] = useState(
		localStorage.user && JSON.parse(localStorage.user).cart
			? JSON.parse(localStorage.user).cart.length
			: 0
	);

	const [isAdmin, setIsAdmin] = useState(
		localStorage.user && JSON.parse(localStorage.user).role.name === "Staff"
	);

	const PrivateRoute = ({ children }: { children: JSX.Element }) => {
		if (isLoggedIn) {
			return children;
		} else {
			return <Navigate to="/login" />;
		}
	};

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = await apiClient.get("/users/is-admin");

				if (response.data.isAdmin) {
					setIsAdmin(true);
				}
			} catch (error) {
				console.error(error);
			}
		};

		checkAdmin();
	}, []);

	const AdminRoute = ({ children }: { children: JSX.Element }) => {
		if (isAdmin) {
			return children;
		} else {
			return <Navigate to="/" />;
		}
	};

	return (
		<Router>
			<RoutesAndLayout
				isHeaderBarOpen={isHeaderBarOpen}
				setIsHeaderBarOpen={setIsHeaderBarOpen}
				isCollapsed={isCollapsed}
				setIsCollapsed={setIsCollapsed}
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				cartItemCount={cartItemCount}
				setCartItemCount={setCartItemCount}
				isAdmin={isAdmin}
				PrivateRoute={PrivateRoute}
				AdminRoute={AdminRoute}
			/>
		</Router>
	);
}

export default AppRoutes;
