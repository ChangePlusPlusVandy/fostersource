import { useState, ReactNode, SetStateAction } from "react";
import Dropdown from "../../../components/dropdown-select";
import WorkshopCard from "./WorkshopCard";
import SurveyCard from "./SurveyCard";
import CertificateCard from "./CertificateCard";
import SaveCourseButton from "../../../components/SaveCourseButtons";

// Card Component
interface CardProps {
	children: ReactNode;
}
function Card({ children }: CardProps) {
	return (
		<div className="border rounded-lg shadow p-4 bg-white">{children}</div>
	);
}

function CardContent({ children }: CardProps) {
	return <div>{children}</div>;
}

// Button Component
interface ButtonProps {
	children: ReactNode;
	className?: string;
}
function Button({ children, className }: ButtonProps) {
	return (
		<button className={`bg-blue-500 text-white py-2 px-4 rounded ${className}`}>
			{children}
		</button>
	);
}

interface InclusiveSupportPageProps {
	workshop: any;
	survey: any;
	certificate: any;
}
export default function Component({
	workshop,
	survey,
	certificate,
}: InclusiveSupportPageProps) {
	return (
		<div>
			<div className="flex flex-row w-full gap-4 p-4">
				<WorkshopCard
					prerequisites={{
						survey: "",
						certificate: "",
					}}
					setPrerequisites={function (
						value: SetStateAction<{ survey: string; certificate: string }>
					): void {
						throw new Error("Function not implemented.");
					}}
				/>
				<SurveyCard
					prerequisites={{
						survey: "",
						certificate: "",
					}}
					setPrerequisites={function (
						value: SetStateAction<{ survey: string; certificate: string }>
					): void {
						throw new Error("Function not implemented.");
					}}
				/>
				<CertificateCard
					workshop={undefined}
					prerequisites={{
						survey: "",
						certificate: "",
					}}
					setPrerequisites={function (
						value: SetStateAction<{ survey: string; certificate: string }>
					): void {
						throw new Error("Function not implemented.");
					}}
				/>
			</div>
			<SaveCourseButton prevLink="pricing" nextLink="handouts" />
		</div>
	);
}
