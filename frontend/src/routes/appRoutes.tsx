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
import SurveyPage from "../pages/Admin/SurveyPage/Survey";
import WorkshopCreation from "../pages/Admin/WorkshopCreation/WorkshopCreation";
import RegistrationPage from "../pages/Admin/RegistrationPage/RegistrationPage";
import AdminPage from "../pages/Admin/AdminPage";
import path from "path";
import EmailPage from "../pages/Admin/EmailPage/EmailPage";
import apiClient from "../services/apiClient";
import { AdminSidebar } from "../components/AdminSidebar/AdminSidebar";
import EditCourse from "../pages/Admin/EditCoursePage/editCoursePage";
import EditSideBar from "../components/EditCourseSidebar/editCoursePageSideBar";
import Registrants from "../pages/Admin/RegistrantsPage/Registrants";
import SurveySummary from "../pages/Admin/SurveySummaryPage/SurveySummary";
import CourseManagerPage from "../pages/Admin/CourseManagerPage/CourseManagerPage";
import UserManagementPage from "../pages/Admin/UserManagementPage/Users";
import ProductProgressReport from "../pages/Admin/ProductSummaryPage/ProductProgressReport";
import FAQPage from "../pages/FAQPage/FAQPage";
import HandoutPage from "../pages/Admin/HandoutsPage/handoutsPage";
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

	const [isAuthRoute, setIsAuthRoute] = useState(
		window.location.href.indexOf("/register") > -1 ||
			window.location.href.indexOf("/login") > -1
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
				{isAdminRoute || isAuthRoute ? (
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
					) : isAuthRoute ? (
						<div></div>
					) : (
						<Sidebar
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							cartItemCount={cartItemCount}
						/>
					)}
				</div>
				<div
					style={{
						display: "flex",
						flex: 1,
						overflow: "auto",
						marginLeft: isAuthRoute
							? "0"
							: isCollapsed || isAdminRoute
								? "6rem"
								: "17rem",
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
						<Route path="/faqs" element={<FAQPage />} />
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
						{/*<Route path="/admin" element={<AdminPage />} />*/}
						<Route path="/admin/discounts" element={<DiscountPage />} />
						<Route path="/admin/speakers" element={<SpeakerPage />} />
						<Route path="/admin/users" element={<UserManagementPage />} />
						<Route path="/admin/products/pricing" element={<Pricing />} />
						<Route
							path="/admin/components"
							element={
								<ComponentPage
									workshop={undefined}
									survey={undefined}
									certificate={undefined}
								/>
							}
						/>
						<Route path="/admin/components/survey" element={<SurveyPage />} />
						<Route path="/admin/products" element={<ProductPage />} />
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
							path="admin/reports/progress"
							element={
								<AdminRoute>
									<ProductProgressReport />
								</AdminRoute>
							}
						/>
						<Route
							path="admin/registrants"
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
							path="/admin/reports/survey"
							element={
								<AdminRoute>
									<SurveySummary />
								</AdminRoute>
							}
						/>

						<Route
							path="/admin/product/edit/:id"
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
							<Route path="workshop" element={<WorkshopCreation />} />
							<Route path="speakers" element={<SpeakerPage />} />
							<Route path="managers" element={<CourseManagerPage />} />
							<Route path="survey" element={<SurveyPage />} />
							<Route path="handouts" element={<HandoutPage />} />
							<Route path="registrants" element={<Registrants />} />
						</Route>
						<Route
							path="/admin/product/create"
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
							<Route path="workshop" element={<WorkshopCreation />} />
							<Route path="speakers" element={<SpeakerPage />} />
							<Route path="managers" element={<CourseManagerPage />} />
							<Route path="survey" element={<SurveyPage />} />
							<Route path="handouts" element={<HandoutPage />} />
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
