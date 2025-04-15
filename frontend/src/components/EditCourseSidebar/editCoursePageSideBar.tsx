import React, { useEffect, useState, useRef, ReactNode } from "react";
import { useLocation, useNavigate, Outlet, NavLink } from "react-router-dom";
import { useCourseEditStore } from "../../store/useCourseEditStore";

import "./editCoursePageSideBar.css";
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";

interface SideBarProps {
	children?: ReactNode;
}

const EditSideBar: React.FC<SideBarProps> = ({ children }) => {
	// const location = useLocation();
	// const isEditPageRoute = location.pathname === "/editCoursePage";
	// const isPricePageRoute = location.pathname === "/";
	// const isComponentsPageRoute = location.pathname === "/";
	// const isSpeakersPageRoute = location.pathname === "/";
	// const isHandoutsPageRoute = location.pathname === "/";
	// const isManagersPageRoute = location.pathname === "/";
	// const isRegistrantsPageRoute = location.pathname === "/";
	// const isParticipationPageRoute = location.pathname === "/";
	// const isEmailPageRoute = location.pathname === "/";
	const { id: courseId } = useParams();

	const navigate = useNavigate();

	const setAllFields = useCourseEditStore((state) => state.setAllFields);
	const reset = useCourseEditStore((state) => state.reset);

	useEffect(() => {
		const hydrated = useCourseEditStore.persist.hasHydrated(); // Zustand persist provides this
		if (courseId && !hydrated) {
			const loadCourse = async () => {
				try {
					const res = await apiClient.get(`/courses/${courseId}`);
					setAllFields({ ...res.data.data, _id: courseId });
				} catch (err) {
					console.error("Failed to fetch course", err);
				}
			};
			loadCourse();
		} else if (!courseId) {
			reset();
		}
	}, [courseId]);

	const basePath = courseId
		? `/admin/product/edit/${courseId}`
		: `/admin/product/create`;

	const sidebarItems = [
		{
			name: "Details",
			path: `${basePath}/details`,
			highlightLeftOffset: "51.4px",
		},
		{
			name: "Pricing",
			path: `${basePath}/pricing`,
			highlightLeftOffset: "51.4px",
		},
		{
			name: "Components",
			path: `${basePath}/components`,
			highlightLeftOffset: "13.6px",
		},
		{
			name: "Speakers",
			path: `${basePath}/speakers`,
			highlightLeftOffset: "37px",
		},
		{
			name: "Handouts",
			path: `${basePath}/handouts`,
			highlightLeftOffset: "34px",
		},
		{
			name: "Managers",
			path: `${basePath}/managers`,
			highlightLeftOffset: "31.5px",
		},
		{
			name: "Registrants",
			path: `${basePath}/registrants`,
			highlightLeftOffset: "24.5px",
		},
		{
			name: "Participation",
			path: `${basePath}/participation`,
			highlightLeftOffset: "16px",
		},
		{
			name: "Email",
			path: `${basePath}/email`,
			highlightLeftOffset: "59.5px",
		},
	];

	// const handleDetailsClick = () => {
	// 	navigate("/admin/product/edit/details");
	// };

	// const handlePricingClick = () => {
	// 	navigate("/admin/product/edit/pricing");
	// };

	// const handleComponentClick = () => {
	// 	navigate("/admin/product/edit/components");
	// };

	// const handleSpeakersClick = () => {
	// 	navigate("/admin/product/edit/speakers");
	// };

	// const handleHandoutsClick = () => {
	// 	navigate("/");
	// };

	// const handleManagersClick = () => {
	// 	navigate("/");
	// };

	// const handleRegistrantsClick = () => {
	// 	navigate("/");
	// };

	// const handleParticipationClick = () => {
	// 	navigate("/");
	// };

	// const handleEmailClick = () => {
	// 	navigate("/");
	// };

	const handleExitClick = () => {
		navigate("/");
	};

	return (
		<div className="bg-white border rounded-md mt-5 ml-2 w-full mr-4">
			<div className="navheading py-4 flex flex-row border items-center rounded-t-md">
				<h1 className="text-white font-semibold ml-5">New Product</h1>
				<button
					className="mr-5 ml-auto border border-white w-7 h-7 rounded-sm"
					onClick={handleExitClick}
				>
					<p className="text-white">x</p>
				</button>
			</div>
			<div className="grid grid-cols-10">
				<div className="flex flex-col col-span-1 w-full gap-6 pt-12 border-r-4 border-gray-100">
					{sidebarItems.map((item) => (
						<div key={item.name} className="flex flex-row w-full pl-6 text-sm">
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									isActive
										? "text-purple-400 border-r-4 border-purple-400 w-full"
										: "text-gray-500 w-full"
								}
							>
								{item.name}
							</NavLink>
						</div>
					))}
				</div>
				<div className="col-span-9">
					<Outlet />
				</div>
			</div>
		</div>
	);
};
export default EditSideBar;
