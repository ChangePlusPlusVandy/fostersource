import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
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
import SpeakerPage from "../pages/Admin/SpeakerPage/Speaker";
import ProductPage from "../pages/Admin/ProductPage/ProductPage";
import Dashboard from "../pages/Dashboard/dashboard";
import Cart from "../pages/CartPage/cart";
import Pricing from "../pages/Admin/Pricing/Pricing";
import ComponentPage from "../pages/Admin/ComponentPage/Component";
import WorkshopCreation from "../pages/Admin/WorkshopCreation/WorkshopCreation";
import RegistrationPage from "../pages/Admin/RegistrationPage/RegistrationPage";
import AdminPage from "../pages/Admin/AdminPage";
import EmailPage from "../pages/Admin/EmailPage/EmailPage";
import apiClient from "../services/apiClient";
import { AdminSidebar } from "../components/AdminSidebar/AdminSidebar";
import EditCourse from "../pages/Admin/EditCoursePage/editCoursePage";
import EditSideBar from "../components/EditCourseSidebar/editCoursePageSideBar";
import Registrants from "../pages/Admin/NewProductPage/Registrants";
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
		localStorage.user && JSON.parse(localStorage.user).role === "staff"
	);
	const [isAdminRoute, setIsAdminRoute] = useState(
		window.location.href.indexOf("/admin") > -1
	);

	// useEffect(() => {
	// 	setIsAdminRoute(window.location.href.indexOf("/admin") > -1);
	// }, [window.location.href]);

	// const isAdminRoute = window.location.href.indexOf("/admin") > -1;

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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100vh",
					// backgroundColor: "#ebebeb",
				}}
				className="bg-gray-100"
			>
				{isAdminRoute ? (
					<></>
				) : (
					<div>
						<GlobalBlackBar />
						<div style={{ width: "100%" }}>
							<HeaderBar
								isOpen={isHeaderBarOpen}
								setIsOpen={setIsHeaderBarOpen}
							/>
						</div>
					</div>
				)}
				<div
					style={{
						position: "absolute",
						display: "flex",
						alignItems: "center",
						top: isAdminRoute ? "0" : "25%",
					}}
				>
					{isAdminRoute ? (
						<div className="h-screen flex items-center">
							<AdminSidebar
								isLoggedIn={isLoggedIn}
								setIsLoggedIn={setIsLoggedIn}
							/>
						</div>
					) : (
						<Sidebar
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							cartItemCount={cartItemCount}
						/>
					)}
					{/* {window.location.href.indexOf("/admin/product/") > -1 ? (
						<EditSideBar />
					) : (
						<></>
					)} */}
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
						<Route
							path="/courseDetails"
							element={<CoursePage setCartItemCount={setCartItemCount} />}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/reset-password" element={<ResetPassword />} />
						<Route
							path="/reset-password/:token"
							element={<ResetPasswordForm />}
						/>
						<Route
							path="/admin"
							element={
								<AdminRoute>
									<AdminPage />
								</AdminRoute>
							}
						/>
						<Route
							path="/admin/discounts"
							element={
								<AdminRoute>
									<DiscountPage />
								</AdminRoute>
							}
						/>
						<Route
							path="/admin/speakers"
							element={
								<AdminRoute>
									<SpeakerPage />
								</AdminRoute>
							}
						/>
						<Route
							path="admin/email"
							element={
								<AdminRoute>
									<EmailPage />
								</AdminRoute>
							}
						/>
						<Route
							path="admin/new-product/registrants"
							element={
								<AdminRoute>
									<Registrants />
								</AdminRoute>
							}
						/>
						<Route
							path="admin/content"
							element={
								<AdminRoute>
									<RegistrationPage />
								</AdminRoute>
							}
						/>
						<Route
							path="/admin/products"
							element={
								<AdminRoute>
									<ProductPage />
								</AdminRoute>
							}
						/>
						<Route
							path="/admin/product/edit"
							element={
								<AdminRoute>
									<EditSideBar />
								</AdminRoute>
							}
						>
							<Route index element={<Navigate to="details" replace />} />
							<Route path="details" element={<EditCourse />} />
							<Route path="pricing" element={<Pricing />} />
							<Route
								path="components"
								element={
									<ComponentPage
										workshop={undefined}
										survey={undefined}
										certificate={undefined}
									/>
								}
							/>
							<Route
								path="workshop"
								element={
									<WorkshopCreation
										workshopName={`Workshop | The Inclusive Family Support Model`}
									/>
								}
							/>
							<Route path="speakers" element={<SpeakerPage />} />
						</Route>
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
