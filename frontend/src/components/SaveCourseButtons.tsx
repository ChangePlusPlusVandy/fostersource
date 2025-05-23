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
				alert("Course updated!");
			} else {
				const res = await apiClient.post("/courses", course);
				alert("Course created!");
				// Optionally redirect to edit mode after creating:
				// navigate(`/admin/product/edit/${res.data.data._id}/details`);
			}
		} catch (e) {
			console.error("Save error", e);
			alert("Failed to save course");
		}
	};

	const navigate = useNavigate();

	return (
		<div className="w-full flex justify-end gap-4 mt-2 z-50">
			<button
				onClick={() => {
					handleSave();
					navigate("/admin/products");
				}}
				className="text-purple2 cursor-pointer"
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

			<button
				className="px-14 py-2 bg-purple2 text-white rounded-md cursor-pointer"
				onClick={() => {
					navigate(`${basePath}/${nextLink}`);
				}}
			>
				Next
			</button>
		</div>
	);
};

export default SaveCourseButton;
