import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import {
	CourseFormData,
	useCourseEditStore,
	getCleanCourseData,
} from "../store/useCourseEditStore";

interface SaveCourseButtonProps {
	prevLink: string;
	nextLink: string;
}

const SaveCourseButton = ({ prevLink, nextLink }: SaveCourseButtonProps) => {
	const course = getCleanCourseData();

	const basePath = course._id
		? `/admin/product/edit/${course._id}`
		: `/admin/product/create`;

	const handleSave = async () => {
		try {
			if (course._id) {
				console.log("course:", course);
				await apiClient.put(`/courses/${course._id}`, course);
				navigate("/admin/products");
				alert("Course updated!");
			} else {
				const res = await apiClient.post("/courses", course);
				navigate("/admin/products");
				alert("Course created!");
				// Optionally redirect to edit mode after creating:
				// navigate(`/admin/product/edit/${res.data.data._id}/details`);
			}
		} catch (e) {
			console.error("Save error", e);
			alert("Failed to save course");
		}
	};

	const handlePublish = async () => {
		await apiClient.put(`/courses/${course._id}`, { draft: !course.draft });
		navigate("/admin/products");
	};

	const navigate = useNavigate();

	return (
		<div className="w-full flex justify-end gap-4 mt-2 z-50">
			<button
				className="text-purple2 cursor-pointer mr-4"
				onClick={() => {
					handlePublish();
				}}
			>
				{course.draft ? "Publish" : "Unpublish"}
			</button>
			<button
				onClick={() => {
					handleSave();
				}}
				className={`text-purple2 cursor-pointer ${prevLink === "" && nextLink === "" ? "text-white bg-purple2 py-3 px-6 rounded-md" : ""}`}
			>
				Exit and Save
			</button>

			{prevLink === "" ? (
				<></>
			) : (
				<button
					className="px-14 py-2 bg-purple2 text-white rounded-md cursor-pointer"
					onClick={() => {
						navigate(`${basePath}/${prevLink}`);
					}}
				>
					Previous
				</button>
			)}

			{nextLink === "" ? (
				<></>
			) : (
				<button
					className="px-14 py-2 bg-purple2 text-white rounded-md cursor-pointer"
					onClick={() => {
						navigate(`${basePath}/${nextLink}`);
					}}
				>
					Next
				</button>
			)}
		</div>
	);
};

export default SaveCourseButton;
