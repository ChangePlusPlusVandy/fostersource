import { Dispatch, SetStateAction } from "react";
import Dropdown from "../../../components/dropdown-select";
import { Vault, Eye, Wifi } from "lucide-react";
import DisplayBar from "./DisplayBar";

interface WorkshopProps {
	workshop: any;
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

export default function CertificateCard({
	workshop,
	prerequisites,
	setPrerequisites,
}: WorkshopProps) {
	const formatMenuItems = [
		{
			label: "None Selected",
			onClick: () =>
				setPrerequisites((prev) => ({ ...prev, survey: "None Selected" })),
		},
		{
			label: "Survey",
			onClick: () =>
				setPrerequisites((prev) => ({ ...prev, certificate: "Survey" })),
		},
	];

	return (
		<div className="border rounded-lg shadow p-4 bg-white w-full last:mr-6 h-[98%] pb-2">
			<div>
				<div className="flex flex-row">
					<Vault />
					<h2 className="text-xl font-bold pl-2">
						{workshop?.name || "Certificate"}
					</h2>
				</div>

				<p className="text-sm text-gray-500 mb-5">Certificate Template</p>
				{/* <p className="text-sm font-medium">Prerequisites</p>

        <Dropdown buttonLabel={`None Selected: ${prerequisites.survey}`} menuItems={formatMenuItems} />
        <div className="flex flex-col gap-2 mt-4">
            <Checkbox label={"Required?"} checked={false} onChange={function (checked: boolean): void {
                    throw new Error("Function not implemented.");
                } } />
            <Checkbox label={"Hide when completed?"} checked={false} onChange={function (checked: boolean): void {
                    throw new Error("Function not implemented.");
                } } />
        </div>
         */}
				<div className="mt-8 text-xs font-bold">Preview</div>
				<div className="mt-2 border p-3 rounded-lg border-black h-[350px] relative flex items-center flex-col">
					<p className="font-medium text-left w-full">Content</p>
					<div className="flex justify-center">
						<DisplayBar status={"certificate"} />
					</div>
					<div className="text-black text-sm font-medium space-y-2 w-full pt-7 pb-20 mb-24">
						<span></span>
					</div>
					<div className=" items-center w-[90%] mb-2">
						<button className="bg-[#F79518] text-white py-2 px-4 rounded w-full mt-4">
							<div className="flex flex-row justify-center">
								<Eye className="mr-2" />
								View Certificate
							</div>
						</button>
					</div>
				</div>

				<button
					className="bg-[#8757A3] text-white py-2 px-4 rounded w-full mt-4 transition transform disabled:bg-gray-400"
					onClick={() => {
						console.log("clicked");
					}}
					disabled={true}
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
