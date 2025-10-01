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
	const { id: courseId } = useParams();

	const navigate = useNavigate();

	const location = useLocation();

	const isCreatePage = location.pathname.includes("/create");
	// const isEditPage = location.pathname.includes("/edit");
	const isManagePage = location.pathname.includes("/manage");

	const setAllFields = useCourseEditStore((state) => state.setAllFields);
	const reset = useCourseEditStore((state) => state.reset);

	const hydrated = useCourseEditStore.persist.hasHydrated();

	const { hasFetchedFromBackend, setFetchedFromBackend } = useCourseEditStore();

	const className = useCourseEditStore((state) => state.className);

	useEffect(() => {
		if (!courseId) {
			reset();
			return;
		}

		const loadCourse = async () => {
			try {
				const res = await apiClient.get(`/courses/${courseId}`);
				const course = res.data.data;

				const cleanedCourse = {
					...course,
					speakers: Array.isArray(course.speakers)
						? course.speakers.map((s: any) => s._id.toString())
						: [],
					_id: courseId,
					// Convert date strings to Date objects
					time: course.time ? new Date(course.time) : new Date(),
					regStart: course.regStart ? new Date(course.regStart) : new Date(),
					regEnd: course.regEnd ? new Date(course.regEnd) : undefined,
				};

				setAllFields(cleanedCourse);
				setFetchedFromBackend();
			} catch (err) {
				console.error("Failed to fetch course", err);
			}
		};

		// Always load course if courseId changes
		if (hydrated) {
			loadCourse();
		}
	}, [courseId, hydrated]);

	const basePath = isCreatePage
		? `/admin/product/create`
		: isManagePage
			? `/admin/product/manage/${courseId}`
			: `/admin/product/edit/${courseId}`;

	const sidebarItems = [
		{
			name: "Details",
			path: `${basePath}/details`,
			highlightLeftOffset: "51.4px",
		},
		{
			name: "Settings",
			path: `${basePath}/pricing`,
			highlightLeftOffset: "51.4px",
		},
		{
			name: "Components",
			path: `${basePath}/components`,
			highlightLeftOffset: "13.6px",
		},
		{
			name: "Handouts",
			path: `${basePath}/handouts`,
			highlightLeftOffset: "34px",
		},
		{
			name: "Speakers",
			path: `${basePath}/speakers`,
			highlightLeftOffset: "37px",
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

	const filteredSidebarItems = sidebarItems.filter((item) => {
		if (isManagePage) {
			return ["Speakers", "Registrants", "Participation", "Email"].includes(
				item.name
			);
		} else {
			return !["Registrants", "Participation", "Email"].includes(item.name);
		}
	});

	const handleExitClick = () => {
		navigate("/admin/products");
	};

	return (
		<div className="bg-white border rounded-md mt-5 ml-2 w-full mr-4">
			<div className="navheading py-4 flex flex-row border items-center rounded-t-md">
				<h1 className="text-white font-semibold ml-5">
					{className?.trim() ? className : "New Product"}
				</h1>
				<button
					className="mr-5 ml-auto border border-white w-7 h-7 rounded-sm"
					onClick={handleExitClick}
				>
					<p className="text-white">x</p>
				</button>
			</div>
			<div className="grid grid-cols-10">
				<div className="flex flex-col col-span-1 w-full gap-6 pt-12 border-r-4 border-gray-100">
					{filteredSidebarItems.map((item) => (
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
