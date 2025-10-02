import React, { useEffect, useState, createContext, useContext } from "react";
import adminApiClient from "../../../services/adminApiClient";
import apiClient from "../../../services/apiClient";

import {
	components as selectComponents,
	OptionProps,
	GroupBase,
	Props as SelectProps,
} from "react-select";
import ReactSelect from "react-select";
import SaveCourseButton from "../../../components/SaveCourseButtons";
import { useCourseEditStore } from "../../../store/useCourseEditStore";
import Modal from "../../../components/Modal";

export const SetOptionsContext = createContext<React.Dispatch<
	React.SetStateAction<OptionType[]>
> | null>(null);
export const useSetOptions = () => useContext(SetOptionsContext);

interface CustomSelectProps
	extends SelectProps<OptionType, true, GroupBase<OptionType>> {
	setOptions?: React.Dispatch<React.SetStateAction<OptionType[]>>;
}

const CustomSelect = ({ setOptions, ...props }: CustomSelectProps) => {
	return <ReactSelect {...props} />;
};

type OptionType = {
	id: string;
	value: string;
	label: string;
};

const EditCourse = () => {
	const {
		className,
		discussion,
		courseDescription,
		creditNumber,
		categories,
		thumbnailPath,
		bannerPath,
		shortUrl,
		setField,
		setAllFields,
	} = useCourseEditStore();

	type Category = { _id: string; category: string };

	const [optionValues, setOptionValues] = useState<Category[]>([]);
	const [options, setOptions] = useState<OptionType[]>([]);
	const [modalOpen, setModalopen] = useState<boolean>(false);
	const [enteredCategory, setEnteredCategory] = useState<string>("");
	const [oldOptions, setOldOptions] = useState<OptionType[]>([]);
	const [undoEdit, setUndoEdit] = useState<boolean>(false);

	const date = new Date();

	const getOptions = async () => {
		try {
			const response = await apiClient.get("/courseCategories");
			const mapped = response.data.data.map((cat: any) => ({
				id: cat._id,
				value: cat.category,
				label: cat.category,
			}));
			setOptions(mapped);
			setOldOptions(mapped);
		} catch (e) {
			console.error("Failed to fetch selected categories:", e);
		}
	};

	const mapToOptions = (categories: { _id: string; category: string }[]) => {
		const mapped: OptionType[] = categories.map((item) => ({
			id: item._id,
			value: item.category,
			label: item.category,
		}));
		setOptions(mapped);
		setOldOptions(mapped);
	};

	useEffect(() => {
		mapToOptions(optionValues);
	}, [optionValues]);

	useEffect(() => {
		getOptions();
	}, []);

	const [file, setFile] = useState<File | null>(null);
	const [bannerImage, setBannerImage] = useState<File | null>(null);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			// setFilePreview(URL.createObjectURL(selectedFile));

			const uploadedUrl = await uploadImageToCloudinary(selectedFile);

			if (uploadedUrl) {
				setField("thumbnailPath", uploadedUrl);
			}
		}
	};

	const handleBannerChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setBannerImage(selectedFile);

			const uploadedUrl = await uploadImageToCloudinary(selectedFile);
			if (uploadedUrl) {
				setField("bannerPath", uploadedUrl);
			}
		}
	};

	const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			const droppedFile = event.dataTransfer.files[0];
			setFile(droppedFile);

			const uploadedUrl = await uploadImageToCloudinary(droppedFile);
			if (uploadedUrl) {
				setField("thumbnailPath", uploadedUrl);
			}
		}
	};

	const handleBannerDrop = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			const droppedFile = event.dataTransfer.files[0];
			setBannerImage(droppedFile);

			const uploadedUrl = await uploadImageToCloudinary(droppedFile);
			if (uploadedUrl) {
				setField("bannerPath", uploadedUrl);
			}
		}
	};

	const uploadImageToCloudinary = async (
		file: File
	): Promise<string | null> => {
		const formData = new FormData();
		formData.append("image", file);

		try {
			const res = await adminApiClient.post("/upload/image", formData);

			// Adjust according to your API response structure
			return res.data.imageUrl || null;
		} catch (error: any) {
			console.error(
				"Error uploading image:",
				error?.response?.data || error.message
			);
			return null;
		}
	};

	const addOption = async (category: string) => {
		try {
			const response = await apiClient.post("/courseCategories", {
				category,
			});
			setOptions((options) => [
				...options,
				{ id: response.data._id, value: category, label: category },
			]);
		} catch (e) {
			console.log("Error updating categories");
		}
	};

	const CustomOption = (props: OptionProps<OptionType, true>) => {
		const { data, innerRef, innerProps } = props;
		const setOptions = useSetOptions();

		const handleDelete = async (e: React.MouseEvent) => {
			e.stopPropagation();
			if (!setOptions) return;

			try {
				await apiClient.delete(`/courseCategories/${data.id}`);
				const updatedOptions = (
					props.selectProps.options as OptionType[]
				).filter((opt) => opt.id !== data.id);
				setOptions(updatedOptions);
			} catch (err) {
				console.error("Failed to delete category", err);
			}
		};

		return (
			<div
				ref={innerRef}
				{...innerProps}
				className="flex justify-between items-center px-3 py-2 hover:bg-gray-100"
			>
				<span>{data.label}</span>
				<button
					onClick={(e) => {
						handleDelete(e);
						setUndoEdit(true);
					}}
					className="text-red-500 text-xs hover:text-red-700"
				>
					❌
				</button>
			</div>
		);
	};

	return (
		<div className="flex flex-col p-8 bg-white">
			<p className="text-2xl">Details</p>
			<div className="mt-2">
				<div className="flex justify-between flex-row-reverse gap-12">
					<div className="flex flex-col">
						<p className="text-lg">Thumbnail</p>
						<div
							className="border-2 border-dashed border-gray-400 rounded-lg p-6 w-full max-w-lg mx-auto text-center cursor-pointer"
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleDrop}
						>
							<div className="flex flex-col items-center">
								{/* Upload Icon */}
								<span className="text-gray-500 text-2xl">⬆️</span>

								{/* Upload Text */}
								<p className="font-semibold mt-2">
									Choose a file or drag & drop it here
								</p>
								<p className="text-gray-400 text-sm">
									JPEG or PNG format, up to 50MB
								</p>

								{/* File Input */}
								<input
									type="file"
									accept=".jpeg, .jpg, .png"
									className="hidden"
									id="fileInput"
									onChange={handleFileChange}
								/>
								<label
									htmlFor="fileInput"
									className="mt-4 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm cursor-pointer"
								>
									Browse Files
								</label>

								{/* Show Selected File */}
							</div>
						</div>
						<div className="relative text-center">
							{file && (
								<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[370px] h-[37px] bg-gray-200 flex flex-row items-center px-3 shadow-md rounded-md">
									<p className="text-sm text-gray-600 truncate max-w-[80%]">
										{file.name}
									</p>
									<button
										className="ml-auto text-right"
										onClick={() => {
											setFile(null);
										}}
									>
										🗑️
									</button>
								</div>
							)}
						</div>

						<div className="relative text-center">
							{bannerImage && (
								<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[370px] h-[37px] bg-gray-200 flex flex-row items-center px-3 shadow-md rounded-md">
									<p className="text-sm text-gray-600 truncate max-w-[80%] ">
										{bannerImage.name}
									</p>
									<button
										className="ml-auto text-right"
										onClick={() => setBannerImage(null)}
									>
										🗑️
									</button>
								</div>
							)}
						</div>
					</div>
					<div className=" w-full">
						<div className="flex flex-col flex-grow text-md w-full">
							<p>Title</p>
							<input
								type="text"
								className="h-12 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
								placeholder="Title of the class"
								value={className}
								onChange={(e) => setField("className", e.target.value)}
							/>
						</div>
						<div className="mt-3">
							<p className="text-md">Summary</p>
							<div className="text-md">
								<textarea
									className="w-full h-12 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									placeholder="Enter summary displayed on preview"
									value={discussion}
									onChange={(e) => setField("discussion", e.target.value)}
								/>
							</div>
						</div>
						<div className="mt-3">
							<p className="text-md">Description</p>
							<textarea
								className="w-full h-20 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 text-md"
								placeholder="Short description that will show on the overview tab"
								value={courseDescription}
								onChange={(e) => setField("courseDescription", e.target.value)}
							/>
						</div>
						{/* <div className="mt-2">
							<div className="flex flex-row items-start space-x-2 w-full">
								<p className="text-sm leading-none">Short Product Url</p>
								<p className="text-gray-400 text-xs leading-none">
									(optional){" "}
								</p>
							</div>
							<div className="text-sm mt-2">
								<textarea
									className="w-full h-8 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
									placeholder=""
									value={shortUrl}
									onChange={(e) => setField("shortUrl", e.target.value)}
								/>
							</div>
						</div> */}

						<div className="flex gap-8">
							<div className="flex flex-row">
								<div className="mt-2 gap-1 flex flex-col text-md">
									Credits
									<div className="">
										<input
											type="number"
											className="h-12 w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
											min="0"
											max="10"
											value={creditNumber}
											onChange={(e) =>
												setField("creditNumber", Number(e.target.value))
											}
										/>
									</div>
								</div>
							</div>

							<div className="flex">
								<div className="mt-3 gap-1 flex flex-col text-md ">
									Categories
									<SetOptionsContext.Provider value={setOptions}>
										<CustomSelect
											className="w-[250px]"
											options={options}
											isMulti
											value={options.filter((opt) =>
												categories.includes(opt.value)
											)}
											onChange={(selected) => {
												const selectedValues = (selected as OptionType[]).map(
													(opt) => opt.value
												);
												setField("categories", selectedValues);
											}}
											components={{ Option: CustomOption }}
										/>
									</SetOptionsContext.Provider>
								</div>

								<div className="self-end">
									<button
										className="w-32 h-10 text-purple-400"
										onClick={() => setModalopen(!modalOpen)}
									>
										<p className="text-xs font-medium text-purple-400">
											Add Category
										</p>
									</button>
								</div>
							</div>
						</div>
					</div>
					{/* {modalOpen && (
						<div
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
							onClick={() => setModalopen(false)}
						>
							<div
								className="md:w-[389px] md:h-[199px] w-[300px] h-[140px] flex bg-white overflow-auto border rounded-md p-5 md:p-6"
								onClick={(e) => e.stopPropagation()}
							> */}
					<Modal
						isOpen={modalOpen}
						onClose={() => setModalopen(false)}
						title="Add Category Type"
						footer={
							<div className="flex flex-row ml-auto">
								<button
									className="w-[100px] h-[20px] md:w-[110px] md:h-[35px] border border-gray-400 bg-gray-white rounded-md mt-5 mr-3"
									onClick={() => {
										setModalopen(false);
										setEnteredCategory("");
									}}
								>
									<p className="text-gray-400 text-sm">Cancel</p>
								</button>
								<button
									className="w-[100px] h-[20px] md:w-[110px] md:h-[35px] border bg-purple-500 rounded-md  mt-5"
									onClick={() => {
										setModalopen(false);
										setEnteredCategory("");
										addOption(enteredCategory);
									}}
								>
									<p className="text-white text-sm">Create Type</p>
								</button>
							</div>
						}
					>
						<div className="flex flex-col w-full">
							<p className="mt-2 md:mt-3 text-xs md:text-sm">Name</p>
							<input
								className="border w-full"
								type="text"
								value={enteredCategory}
								onChange={(e) => setEnteredCategory(e.target.value)}
							/>
						</div>
					</Modal>
				</div>
			</div>

			<div>
				<p className="text-sm mt-4">User Preview</p>
				<div className="w-full h-72 border border-black rounded-md p-5">
					<div className="p-4 w-full h-full border rounded-md shadow-md">
						<div className="flex flex-col ">
							<p className="text-lg">{className}</p>
						</div>
						<div className="flex flex-row">
							<p className="text-xs whitespace-nowrap">No Rating</p>
							<p className="text-xs ml-5">{creditNumber}</p>
							<p className="text-xs ml-5 whitespace-nowrap">
								{date &&
									(() => {
										const dateObj = new Date(date);
										return (
											<>
												{dateObj.toDateString()} at{" "}
												{dateObj.toLocaleTimeString("en-US", {
													hour: "2-digit",
													minute: "2-digit",
												})}
												(
												{dateObj
													.toLocaleTimeString("en-US", {
														timeZoneName: "short",
													})
													.split(" ")
													.pop()}
												)
											</>
										);
									})()}
							</p>
							<div className="relative w-full h-[300px]">
								{thumbnailPath && (
									<div className="absolute right-0 top-0">
										<img
											src={thumbnailPath}
											alt="Preview"
											className="w-[397px] h-[250px] object-cover rounded-lg border border-gray-300 shadow-lg -mt-[44px]"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="-mt-56">
							<p className="text-xs max-w-[513px]">{discussion}</p>
						</div>
						<div className="mt-16 flex flex-row">
							<button className="w-40 h-9 bg-orange-400 rounded-lg">
								Register{" "}
								{/* {price == 0 ? <span>(Free) </span> : <span>({price}) </span>} */}
							</button>
							<button className="ml-5 w-40 h-9 border border-orange-400 rounded-lg bg-white">
								<p className="text-orange-400 text-xs">Learn More</p>
							</button>
						</div>
					</div>
				</div>
			</div>
			<SaveCourseButton prevLink="" nextLink={"pricing"} />
		</div>
	);
};

export default EditCourse;
