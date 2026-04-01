import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { List, Pencil, Plus } from "lucide-react";
import DisplayBar from "./DisplayBar";
import { SurveyType } from "../../../shared/types/survey";
import { useNavigate } from "react-router-dom";
import {
	getCleanCourseData,
	useCourseEditStore,
} from "../../../store/useCourseEditStore";
import apiClient from "../../../services/apiClient";

interface SurveyProps {
	prerequisites: { survey: string; certificate: string };
	setPrerequisites: Dispatch<
		SetStateAction<{ survey: string; certificate: string }>
	>;
}

export default function SurveyCard({
	prerequisites,
	setPrerequisites,
}: SurveyProps) {
	const navigate = useNavigate();
	const course = getCleanCourseData();
	const setAllFields = useCourseEditStore((state) => state.setAllFields);
	const [survey, setSurvey] = useState<SurveyType | null>(null);
	const [loading, setLoading] = useState(false);

	// Fetch the course's assigned survey
	useEffect(() => {
		const fetchSurvey = async () => {
			if (!course.surveyId) return;
			try {
				setLoading(true);
				const response = await apiClient.get(`/surveys/${course.surveyId}`);
				const data = response.data.survey || response.data;
				setSurvey({
					id: data._id,
					name: data.name || "Untitled",
					questions: data.questions || [],
					courseIds: data.courseIds || [],
					version: data.version || 1,
					isActive: data.isActive ?? true,
					createdAt: data.createdAt,
					updatedAt: data.updatedAt,
				});
			} catch (error) {
				console.error("Error fetching survey:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchSurvey();
	}, [course.surveyId]);

	const handleEditClick = async () => {
		if (!course._id) {
			try {
				const res = await apiClient.post("/courses", course);
				const createdCourse = res.data.data;
				setAllFields({ ...createdCourse });
				navigate(`/admin/product/edit/${createdCourse._id}/survey`);
			} catch (e) {
				console.error("Failed to create course before editing", e);
			}
		} else {
			navigate(`/admin/product/edit/${course._id}/survey`);
		}
	};

	const hasSurvey = !!course.surveyId && !!survey;

	return (
		<div className="border rounded-lg shadow p-4 bg-white w-full last:mr-6 h-[98%] pb-2">
			<div>
				<div className="flex flex-row items-center">
					<List className="w-5 h-5" />
					<h2 className="text-xl font-bold pl-2">Survey</h2>
				</div>

				{loading ? (
					<p className="text-sm text-gray-400 mt-2">Loading...</p>
				) : hasSurvey ? (
					<>
						<p className="text-sm text-gray-700 font-medium mt-1">
							{survey.name}
						</p>
						<p className="text-sm text-gray-500 mb-5">
							{survey.questions.length} question
							{survey.questions.length !== 1 ? "s" : ""} &middot; v
							{survey.version}
							{survey.courseIds.length > 1 && (
								<span className="ml-1 text-amber-600">
									(shared across {survey.courseIds.length} courses)
								</span>
							)}
						</p>

						<div className="mt-4 text-xs font-bold">Preview</div>
						<div className="mt-2 border p-3 rounded-lg border-gray-300 h-[350px] relative flex items-center flex-col overflow-y-auto">
							<p className="font-medium text-left w-full mb-2">Content</p>
							<div className="flex justify-center">
								<DisplayBar status={"survey"} />
							</div>
							<div className="text-black text-sm font-medium space-y-2 w-full pt-4 pb-4">
								<p className="font-semibold">{survey.name}</p>
								<p>
									<span className="font-semibold">Questions:</span>{" "}
									{survey.questions.length}
								</p>
							</div>
							<div className="items-center w-[90%] mb-2">
								<button className="bg-[#F79518] text-white py-2 px-4 rounded w-full mt-4">
									<div className="flex flex-row justify-center">
										<Pencil className="mr-2 w-4 h-4" />
										Complete Survey
									</div>
								</button>
							</div>
						</div>

						<button
							className="bg-[#8757A3] text-white py-2 px-4 rounded w-full mt-4 transition transform active:scale-95 hover:scale-105"
							onClick={handleEditClick}
						>
							Edit Survey
						</button>
					</>
				) : (
					<>
						<p className="text-sm text-gray-500 mt-2 mb-6">
							No survey assigned to this course yet.
						</p>

						<div className="flex flex-col gap-3 mt-4">
							<button
								className="bg-[#8757A3] text-white py-2.5 px-4 rounded-md w-full transition hover:bg-[#6d4a92] flex items-center justify-center gap-2"
								onClick={handleEditClick}
							>
								<Plus className="w-4 h-4" />
								Create New Survey
							</button>
							<button
								className="text-[#8757A3] border border-[#8757A3] py-2.5 px-4 rounded-md w-full transition hover:bg-[#8757A3] hover:text-white"
								onClick={handleEditClick}
							>
								Use Existing Survey
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
