import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "../pages/HomePage/Home";
import { Sidebar } from "../components/Sidebar/sidebar";
import HeaderBar, { HeaderItems } from "../components/HeaderBar/headerBar";
import Catalog from "../pages/Catalog/Catalog";
import About from "../pages/AboutPage/About";
import Calendar from "../pages/CalendarPage/Calendar";
import Contact from "../pages/ContactPage/Contact";
import Help from "../pages/HelpPage/Help";
import News from "../pages/NewsPage/News";
import Portal from "../pages/PortalPage/Portal";
import Programs from "../pages/ProgramsPage/Programs";
import Login from "../pages/UserAuth/Login";
import Register from "../pages/UserAuth/Register";
import ResetPassword from "../pages/UserAuth/resetPassword";
import ResetPasswordForm from "../pages/UserAuth/resetPasswordForm";
import authService from "../services/authService";
import CoursePage from "../pages/courseDetailPage/courseDetailsPage";

function AppRoutes() {
	const [isHeaderBarOpen, setIsHeaderBarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(
		window.innerWidth < 768
	);

	const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated())

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
					backgroundColor: "#eeeeee"
				}}
			>
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
					<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
				</div>
				<div
					style={{
						display: "flex",
						flex: 1,
						overflow: "auto",
						paddingLeft: isCollapsed ? "6rem" : "17rem",
					}}
				>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/calendar" element={<Calendar />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/help" element={<Help />} />
						<Route path="/news" element={<News />} />
						<Route path="/portal" element={<Portal />} />
						<Route path="/programs" element={<Programs />} />
						<Route
							path="/catalog"
							element={
								<PrivateRoute>
									<Catalog />
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
            <Route path="/courseDetails" element={<CoursePage />} />
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
