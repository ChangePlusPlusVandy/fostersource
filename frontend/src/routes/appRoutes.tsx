import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "../pages/HomePage/Home";
import { Sidebar } from "../components/Sidebar/sidebar";
import GlobalBlackBar from "../components/GlobalBlackBar/globalBlackBar";
import HeaderBar, { HeaderItems } from "../components/HeaderBar/headerBar";
import Catalog from "../pages/Catalog/Catalog";
import Calendar from "../pages/CalendarPage/Calendar";
import Login from "../pages/UserAuth/Login";
import Register from "../pages/UserAuth/Register";
import ResetPassword from "../pages/UserAuth/resetPassword";
import ResetPasswordForm from "../pages/UserAuth/resetPasswordForm";
import authService from "../services/authService";
import CoursePage from "../pages/courseDetailPage/courseDetailsPage";
import DiscountPage from "../pages/Admin/DiscountPage/Discount";
import SpeakerPage from "../pages/Admin/SpeakerPage/Speaker"
import ProductPage from "../pages/Admin/ProductPage/ProductPage";
import Dashboard from "../pages/Dashboard/dashboard";
import Cart from "../pages/CartPage/cart";
import Pricing from "../pages/Admin/Products/Pricing";
import ComponentPage from "../pages/Admin/ComponentPage/Component";
import WorkshopCreation from "../pages/Admin/WorkshopCreation/WorkshopCreation";
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

	const PrivateRoute = ({ children }: { children: JSX.Element }) => {
		if (isLoggedIn) {
			return children;
		} else {
			return <Navigate to="/login" />;
		}
	};

	return (
		<Router>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100vh",
					// backgroundColor: "#ebebeb",
				}}
				className="bg-gray-100"
			>
				<GlobalBlackBar />
				<div style={{ width: "100%" }}>
					<HeaderBar isOpen={isHeaderBarOpen} setIsOpen={setIsHeaderBarOpen} />
				</div>
				<div
					style={{
						position: "absolute",
						display: "flex",
						alignItems: "center",
						top: "25%",
					}}
				>
					<Sidebar
						isCollapsed={isCollapsed}
						setIsCollapsed={setIsCollapsed}
						isLoggedIn={isLoggedIn}
						setIsLoggedIn={setIsLoggedIn}
						cartItemCount={cartItemCount}
					/>
				</div>
				<div
					style={{
						display: "flex",
						flex: 1,
						overflow: "auto",
						marginLeft: isCollapsed ? "6rem" : "17rem",
					}}
				>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/calendar" element={<Calendar />} />
						<Route
							path="/catalog"
							element={
								<PrivateRoute>
									<Catalog setCartItemCount={setCartItemCount} />
								</PrivateRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<PrivateRoute>
									<Dashboard />
								</PrivateRoute>
							}
						/>
						<Route
							path="/cart"
							element={
								<PrivateRoute>
									<Cart />
								</PrivateRoute>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/reset-password" element={<ResetPassword />} />
						<Route
							path="/reset-password/:token"
							element={<ResetPasswordForm />}
						/>
						{/*<Route path="/admin" element={<AdminPage />} />*/}
						<Route path="/admin/discounts" element={<DiscountPage />} />
						<Route path="/admin/speakers" element={<SpeakerPage />} />
						<Route path="/admin/products/pricing" element={<Pricing />} />
						<Route path="/admin/components" element = {<ComponentPage workshop={undefined} survey={undefined} certificate={undefined} />}/>
						<Route path="/admin/products" element={<ProductPage />} />
						<Route path="/admin/create-workshop" element={<WorkshopCreation  workshopName={`Workshop | The Inclusive Family Support Model`}/>} />
						<Route
							path="/courseDetails"
							element={<CoursePage setCartItemCount={setCartItemCount} />}
						/>
						
					</Routes>
				</div>
				{isHeaderBarOpen && isCollapsed && (
					<div
						className="p-7"
						style={{
							position: "absolute",
							backgroundColor: "#f0f0f0",
							top: "4rem",
							bottom: 0,
							left: 0,
							right: 0,
						}}
					>
						<HeaderItems
							displayOptions="flex flex-col gap-3"
							outline="border-black"
						/>
					</div>
				)}
			</div>
		</Router>
	);
}

export default AppRoutes;
