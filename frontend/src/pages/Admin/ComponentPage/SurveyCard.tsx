import { Dispatch, SetStateAction } from "react";
import Dropdown from "../../../components/dropdown-select";
import { List, Pencil, Wifi } from "lucide-react";
import DisplayBar from "./DisplayBar";
import { SurveyType } from "../../../shared/types/survey";
import { useNavigate } from "react-router-dom";
import {
	getCleanCourseData,
	useCourseEditStore,
} from "../../../store/useCourseEditStore";
import apiClient from "../../../services/apiClient";

interface SurveyProps {
	survey?: SurveyType;
	prerequisites: { survey: string; certificate: string };
	setPrerequisites: Dispatch<
		SetStateAction<{ survey: string; certificate: string }>
	>;
}

interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
	return (
		<label className="flex items-center space-x-1 cursor-pointer text-sm">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring focus:ring-blue-500"
			/>
			<span className="text-gray-600">{label}</span>
		</label>
	);
}

type SurveyDetailsProps = {
	survey: SurveyType;
};

const defaultSurvey: SurveyType = {
	id: "default_survey",
	questions: [
		{
			id: "q1",
			question: "What is your favorite programming language?",
			isMCQ: true,
			answers: ["JavaScript", "Python", "Java", "C++"],
		},
		{
			id: "q2",
			question: "Do you have prior programming experience?",
			isMCQ: true,
			answers: ["Yes", "No"],
		},
	],
	createdAt: new Date(),
	updatedAt: new Date(),
};

export const SurveyDetails = ({ survey }: SurveyDetailsProps) => {
	return (
		<div className="text-black text-sm font-medium space-y-2 w-full pt-4 pb-11 mb-24">
			<p className="font-semibold">Survey</p>

			<p>
				<span className="font-semibold">Questions:</span>{" "}
				{survey.questions.length}
			</p>
		</div>
	);
};

export default function SurveyCard({
	survey = defaultSurvey,
	prerequisites,
	setPrerequisites,
}: SurveyProps) {
	const formatMenuItems = [
		{
			label: "None Selected",
			onClick: () =>
				setPrerequisites((prev) => ({ ...prev, survey: "None Selected" })),
		},
		{
			label: "Workshop",
			onClick: () =>
				setPrerequisites((prev) => ({ ...prev, survey: "Workshop" })),
		},
	];

	const navigate = useNavigate();
	const course = getCleanCourseData();
	const setAllFields = useCourseEditStore((state) => state.setAllFields);

	const handleEditClick = async () => {
		console.log(course);
		if (!course._id) {
			try {
				const res = await apiClient.post("/courses", course); // or course with defaults
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

	return (
		<div className="border rounded-lg shadow p-4 bg-white w-full last:mr-6 h-[98%] pb-2">
			<div>
				<div className="flex flex-row">
					<List />
					<h2 className="text-xl font-bold pl-2">Survey</h2>
				</div>

				<p className="text-sm text-gray-500 mb-5">
					Survey has {survey.questions.length} questions{" "}
				</p>
				{/* <p className="text-sm font-medium">Prerequisites</p>

				<Dropdown
					buttonLabel={`None Selected: ${prerequisites.survey}`}
					menuItems={formatMenuItems}
				/>
				<div className="flex flex-col gap-2 mt-4">
					<Checkbox
						label={"Required?"}
						checked={false}
						onChange={function (checked: boolean): void {
							throw new Error("Function not implemented.");
						}}
					/>
					<Checkbox
						label={"Hide when completed?"}
						checked={false}
						onChange={function (checked: boolean): void {
							throw new Error("Function not implemented.");
						}}
					/>
				</div> */}

				<div className="mt-8 text-xs font-bold">Preview</div>
				<div className="mt-2 border p-3 rounded-lg border-black h-[350px] relative flex items-center flex-col">
					<p className="font-medium text-left w-full">Content</p>
					<div className="flex justify-center">
						<DisplayBar status={"survey"} />
					</div>
					<SurveyDetails survey={survey} />
					<div className=" items-center w-[90%] mb-2">
						<button className="bg-[#F79518] text-white py-2 px-4 rounded w-full mt-4">
							<div className="flex flex-row justify-center">
								<Pencil className="mr-2" />
								Complete Survey
							</div>
						</button>
					</div>
				</div>

				<button
					className="bg-[#8757A3] text-white py-2 px-4 rounded w-full mt-4 transition transform active:scale-95 hover:scale-105"
					onClick={handleEditClick}
				>
					Edit Component
				</button>

				{/* <div className="flex justify-center mt-2">
					<button className="text-purple-600 underline transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
						Hide Component
					</button>
				</div> */}
			</div>
		</div>
	);
}
