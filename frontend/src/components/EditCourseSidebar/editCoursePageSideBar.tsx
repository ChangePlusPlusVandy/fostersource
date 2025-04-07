import React, { useEffect, useState, useRef, ReactNode } from "react";
import { useLocation, useNavigate, Outlet, NavLink } from "react-router-dom";

import "./editCoursePageSideBar.css";
import { useParams } from "react-router-dom";

interface SideBarProps {
	children?: ReactNode;
}

const EditSideBar: React.FC<SideBarProps> = ({ children }) => {
	const location = useLocation();
	const isEditPageRoute = location.pathname === "/editCoursePage";
	const isPricePageRoute = location.pathname === "/";
	const isComponentsPageRoute = location.pathname === "/";
	const isSpeakersPageRoute = location.pathname === "/";
	const isHandoutsPageRoute = location.pathname === "/";
	const isManagersPageRoute = location.pathname === "/";
	const isRegistrantsPageRoute = location.pathname === "/";
	const isParticipationPageRoute = location.pathname === "/";
	const isEmailPageRoute = location.pathname === "/";
	const { id: courseId } = useParams();

	const navigate = useNavigate();

	const sidebarItems = [
		{
			name: "Details",
			path: `/admin/product/edit/${courseId}/details`,
			highlightLeftOffset: "51.4px",
		},
		{
			name: "Pricing",
			path: `/admin/product/edit/${courseId}/pricing`,
			highlightLeftOffset: "51.4px",
		},
		{
			name: "Components",
			path: `/admin/product/edit/${courseId}/components`,
			highlightLeftOffset: "13.6px",
		},
		{
			name: "Speakers",
			path: `/admin/product/edit/${courseId}/speakers`,
			highlightLeftOffset: "37px",
		},
		{
			name: "Handouts",
			path: `/admin/product/edit/${courseId}/handouts`,
			highlightLeftOffset: "34px",
		},
		{
			name: "Managers",
			path: `/admin/product/edit/${courseId}/managers`,
			highlightLeftOffset: "31.5px",
		},
		{
			name: "Registrants",
			path: `/admin/product/edit/${courseId}/registrants`,
			highlightLeftOffset: "24.5px",
		},
		{
			name: "Participation",
			path: `/admin/product/edit/${courseId}/participation`,
			highlightLeftOffset: "16px",
		},
		{
			name: "Email",
			path: `/admin/product/edit/${courseId}/email`,
			highlightLeftOffset: "59.5px",
		},
	];	

	const handleDetailsClick = () => {
		navigate("/admin/product/edit/details");
	};

	const handlePricingClick = () => {
		navigate("/admin/product/edit/pricing");
	};

	const handleComponentClick = () => {
		navigate("/admin/product/edit/components");
	};

	const handleSpeakersClick = () => {
		navigate("/admin/product/edit/speakers");
	};

	const handleHandoutsClick = () => {
		navigate("/");
	};

	const handleManagersClick = () => {
		navigate("/");
	};

	const handleRegistrantsClick = () => {
		navigate("/");
	};

	const handleParticipationClick = () => {
		navigate("/");
	};

	const handleEmailClick = () => {
		navigate("/");
	};

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
