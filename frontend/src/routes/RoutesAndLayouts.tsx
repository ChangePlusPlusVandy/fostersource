import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import UserTypesPage from "../pages/Admin/UserTypesPage/UserTypesPage";
import ProductProgressReport from "../pages/Admin/ProductSummaryPage/ProductProgressReport";
import FAQPage from "../pages/FAQPage/FAQPage";
import HandoutPage from "../pages/Admin/HandoutsPage/handoutsPage";
import EmailTemplates from "../pages/Admin/EmailTemplatePage/EmailTemplates";

function RoutesAndLayout({
	isHeaderBarOpen,
	setIsHeaderBarOpen,
	isCollapsed,
	setIsCollapsed,
	isLoggedIn,
	setIsLoggedIn,
	cartItemCount,
	setCartItemCount,
	isAdmin,
	PrivateRoute,
	AdminRoute,
}: {
	isHeaderBarOpen: boolean;
	setIsHeaderBarOpen: any;
	isCollapsed: boolean;
	setIsCollapsed: any;
	isLoggedIn: boolean;
	setIsLoggedIn: any;
	cartItemCount: number;
	setCartItemCount: any;
	isAdmin: boolean;
	PrivateRoute: any;
	AdminRoute: any;
}) {
	const location = useLocation(); // ✅ safe now

	const isAuthRoute =
		location.pathname.startsWith("/login") ||
		location.pathname.startsWith("/register") ||
		location.pathname.startsWith("/reset-password");

	const isAdminRoute = location.pathname.startsWith("/admin");

	return (
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
					{/* ===== LEARNER ROUTES ===== */}
					<Route path="/" element={<Home />} />
					<Route
						path="/dashboard"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path="/catalog"
						element={
							<PrivateRoute>
								<Catalog setCartItemCount={setCartItemCount} />
							</PrivateRoute>
						}
					/>
					<Route
						path="/calendar"
						element={
							<PrivateRoute>
								<Calendar />
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
						element={
							<PrivateRoute>
								<CoursePage setCartItemCount={setCartItemCount} />
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

					{/* ===== ADMIN PRODUCT ROUTES ===== */}
					<Route
						path="/admin/products"
						element={
							<AdminRoute>
								<ProductPage />
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
						path="admin/email"
						element={
							<AdminRoute>
								<EmailPage isSingleCourse={false} />
							</AdminRoute>
						}
					/>
					<Route
						path="admin/templates"
						element={
							<AdminRoute>
								<EmailTemplates />
							</AdminRoute>
						}
					/>

					{/* ===== create and edit product routes ===== */}
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
						<Route path="email" element={<EmailPage isSingleCourse={true} />} />
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
						<Route path="registrants" element={<Registrants />} />
						<Route path="email" element={<EmailPage isSingleCourse={true} />} />
					</Route>

					{/* ===== user management routes ===== */}
					<Route
						path="/admin/users"
						element={
							<AdminRoute>
								<UserManagementPage />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/user-types"
						element={
							<AdminRoute>
								<UserTypesPage />
							</AdminRoute>
						}
					/>

					{/* ===== report routes ===== */}
					<Route
						path="admin/content"
						element={
							<AdminRoute>
								<RegistrationPage />
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
						path="admin/reports/progress"
						element={
							<AdminRoute>
								<ProductProgressReport />
							</AdminRoute>
						}
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
	);
}

export default RoutesAndLayout;
