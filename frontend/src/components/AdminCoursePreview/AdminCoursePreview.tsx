import React from "react";
import { Course } from "../../shared/types/course";
import {
	Calendar,
	Edit2,
	List,
	PictureInPicture2,
	ShieldCheck,
	Star,
	Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

export interface Product {
	id: number;
	course: Course;
	status: string;
	avgRating: number;
	startTime: Date;
	endTime: Date;
	timeZone: string;
	selected: boolean;
}

interface AdminCoursePreviewProps {
	product: Product;
	toggleSelection: (id: number) => void;
}

const elemColors: Record<string, string> = {
	Ongoing: "#30CD5A",
	"Open Registration": "#F79518",
	"Closed Registration": "#BE0000",
	Storage: "#444444",
};

function AdminCoursePreview({
	product,
	toggleSelection,
}: AdminCoursePreviewProps) {
	return (
		<div
			key={product.id}
			className="flex items-center justify-between w-full pr-3 rounded-lg border relative"
			style={{
				backgroundColor: product.selected ? "#f5f0f7" : "white",
			}}
		>
			<div
				className="absolute left-0 top-0 rounded-l-lg w-1 h-full"
				style={{ backgroundColor: elemColors[product.status] }}
			></div>

			<div className="flex items-center space-x-6 flex-1 py-3 ml-3">
				<input
					type="checkbox"
					checked={product.selected}
					onChange={() => toggleSelection(product.id)}
					className="w-5 h-5"
					style={{ accentColor: "#8757a3" }}
				/>
				<div className="flex items-center gap-2">
					<span className="font-medium">{product.course.className}</span>
				</div>
			</div>

			<div className="flex items-center justify-end space-x-6 flex-1 py-3">
				<span className="text-gray-500">{product.avgRating}</span>
				<div className="flex">
					{Array.from({ length: Math.floor(product.avgRating) }, (_, i) => (
						<Star
							key={`filled-${i}`}
							className="w-4 fill-current text-yellow-500"
						/>
					))}
					{Array.from({ length: 5 - Math.floor(product.avgRating) }, (_, i) => (
						<Star key={`empty-${i}`} className="w-4 text-gray-300" />
					))}
				</div>

				<span className="text-gray-500 w-16">
					{product.course.creditNumber} credits
				</span>
				<Calendar className="w-12" />
				<span className="text-gray-500 w-24">
					{product.course.isLive ? "Live" : "Virtual"} Event{" "}
					{product.startTime.getMonth() + 1}/{product.startTime.getDate()}/
					{product.startTime.getFullYear()} at {product.startTime.getHours()}:
					{product.startTime.getMinutes().toString().padStart(2, "0")}{" "}
					{product.timeZone}
				</span>

				<div className="flex flex-col space-y-2 w-36">
					<div className="flex flex-row justify-between">
						<div
							className="flex rounded-lg border text-white px-1 group relative"
							style={{ backgroundColor: "#9C75B4" }}
						>
							<PictureInPicture2 />
							<List />
							<ShieldCheck />
							<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-24 p-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg group-hover:block">
								Includes: Webinar, Survey, Certificate
							</div>
						</div>
						<div
							className="text-white rounded-lg px-1 items-center justify-center flex"
							style={{ backgroundColor: "#9C75B4" }}
						>
							$0-$25
						</div>
					</div>
					<div className="flex flex-row justify-between">
						<div
							className="text-white rounded-lg px-1"
							style={{ backgroundColor: "#9C75B4" }}
						>
							Live
						</div>
						<div
							className="text-white rounded-lg px-1"
							style={{ backgroundColor: "#9C75B4" }}
						>
							{product.course.students.length} registered
						</div>
					</div>
				</div>

				<div className="flex gap-4">
					<Link to={`/admin/product/edit?courseId=${product.id}`}>
						<Edit2 className="w-4 h-4 text-gray-400" />
					</Link>
					<button
						onClick={() =>
							// TODO: handle delete Product
							console.log("hi")
						}
					>
						<Trash2 className="w-4 h-4 text-gray-400" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdminCoursePreview;
