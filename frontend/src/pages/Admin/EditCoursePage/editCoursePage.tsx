import React, { useEffect, useState, useRef } from "react";
const EditCourse = () => {
	const [inputTitleValue, setInputTitleValue] = useState<string>("");
	const [inputSummaryValue, setSummaryValue] = useState<string>("");
	const [inputDescriptionValue, setDescriptionValue] = useState<string>("");
	const [inputShortUrlProduct, setInputShortUrlProduct] = useState<string>("");
	const [webinar, setWebinar] = useState<boolean>(false);
	const [survey, setSurvey] = useState<boolean>(false);
	const [certificate, setCertificate] = useState<boolean>(false);
	const [credit, setCredit] = useState<number>(0);
	const [date, setDate] = useState<Date>(new Date());

	const [file, setFile] = useState<File | null>(null);
	const [filePreview, setFilePreview] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			setFilePreview(URL.createObjectURL(selectedFile));
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			setFile(event.dataTransfer.files[0]);
		}
	};

	const [bannerImage, setBannerImage] = useState<File | null>(null);

	const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setBannerImage(event.target.files[0]);
		}
	};

	const handleBannerDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			setBannerImage(event.dataTransfer.files[0]);
		}
	};
	return (
		<div className="flex flex-col p-8 bg-white">
			<p className="text-2xl">Details</p>
			<div className="mt-2">
				<div className="flex justify-between flex-row-reverse">
					<div className="flex flex-col justify-end">
						<p className="text-xs">Catalog</p>
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
											setFilePreview(null);
										}}
									>
										🗑️
									</button>
								</div>
							)}
						</div>

						<p className="text-xs mr-52 mt-10">Banner Image</p>
						<div
							className="border-2 border-dashed border-gray-400 rounded-lg p-6 w-full max-w-lg mx-auto text-center cursor-pointer "
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleBannerDrop}
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
									id="bannerInput"
									onChange={handleBannerChange}
								/>
								<label
									htmlFor="bannerInput"
									className="mt-4 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm cursor-pointer"
								>
									Browse Files
								</label>

								{/* Show Selected File */}
							</div>
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
					<div className="">
						<div className="flex flex-col flex-grow text-sm w-full">
							<p>Title</p>
							<input
								type="text"
								className="h-8 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
								placeholder="Title of the class"
								value={inputTitleValue}
								onChange={(e) => setInputTitleValue(e.target.value)}
							/>
						</div>
						<div className="mt-3">
							<p className="text-sm">Summary</p>
							<div className="text-xs">
								<textarea
									className="w-full h-11 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
									placeholder="Enter text here..."
									value={inputSummaryValue}
									onChange={(e) => setSummaryValue(e.target.value)}
								/>
							</div>
						</div>
						<div className="mt-3">
							<p className="text-sm">Description</p>
							<textarea
								className="w-full h-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
								placeholder="Summary of the class"
								value={inputDescriptionValue}
								onChange={(e) => setDescriptionValue(e.target.value)}
							/>
						</div>
						<div className="mt-2">
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
									value={inputShortUrlProduct}
									onChange={(e) => setInputShortUrlProduct(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex flex-row">
							<div className="mt-2 gap-1 flex flex-col text-sm">
								Credits
								<div className="">
									<input
										type="number"
										className="h-6 w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
										min="0"
										max="10"
										defaultValue="0"
										onChange={(e) => setCredit(Number(e.target.value))}
									/>
								</div>
							</div>
							<div className="mt-3 flex flex-col text-sm">
								<p className="ml-12">Tags</p>
								<div className="flex flex-row">
									<button
										onClick={() => setWebinar(!webinar)}
										className={`w-16 h-4 ml-12 rounded-lg ${webinar ? "bg-orange-400" : "bg-gray-200"}`}
									>
										<p
											className={`text-xs ${webinar ? "text-black?" : "text-gray-600"}`}
										>
											Webinar
										</p>
									</button>
									<button
										onClick={() => setSurvey(!survey)}
										className={`w-14 h-4 ml-2 rounded-lg ${survey ? "bg-orange-400" : "bg-gray-200"}`}
									>
										<p
											className={`text-xs ${survey ? "text-black?" : "text-gray-600"}`}
										>
											Survey
										</p>
									</button>
									<button
										onClick={() => setCertificate(!certificate)}
										className={`w-20 h-4 ml-2 rounded-lg ${certificate ? "bg-orange-400" : "bg-gray-200"}`}
									>
										<p
											className={`text-xs ${certificate ? "text-black?" : "text-gray-600"}`}
										>
											Certificate
										</p>
									</button>
								</div>
							</div>
							<div className="flex flex-col mt-3">
								<p className="ml-20 text-sm">Live Event</p>
								<input
									type="datetime-local"
									className="text-sm w-48 h-6 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ml-20"
									min="0"
									max="10"
									onChange={(e) => setDate(new Date(e.target.value))}
								/>
							</div>
						</div>

						<div className="flex flex-row">
							<div className="mt-3 gap-1 flex flex-col text-sm">
								Categories
								<select className="w-52 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
									<option value="1">None Selected</option>
									<option value="2">Option 2</option>
									<option value="3">Option 3</option>
								</select>
							</div>
							<div className="mt-3 ml-12 gap-1 flex flex-col text-sm">
								Product Types
								<select className="w-52 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
									<option value="1">None Selected</option>
									<option value="2">Option 2</option>
									<option value="3">Option 3</option>
								</select>
							</div>
							<div className="mt-4 ml-12 gap-1 flex flex-col text-sm">
								<div className="flex flex-row">
									<p className="text-sm leading-none">Ribbon</p>
									<p className="text-gray-400 text-xs leading-none ml-2">
										(optional){" "}
									</p>
								</div>
								<select className="w-52 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
									<option value="1">None Selected</option>
									<option value="2">Option 2</option>
									<option value="3">Option 3</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div>
					<p className="text-sm mt-4">User Preview</p>
					<div className="w-full h-72 border border-black rounded-md p-5">
						<div className="p-4 w-full h-full border rounded-md shadow-md">
							<div className="flex flex-col ">
								<p className="text-lg">{inputTitleValue}</p>
							</div>
							<div className="flex flex-row">
								<p className="text-xs whitespace-nowrap">No Rating</p>
								<p className="text-xs ml-5">{credit}</p>
								<p className="text-xs ml-5 whitespace-nowrap">
									{date.toDateString()} at{" "}
									{date.toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})}{" "}
									(
									{date
										.toLocaleTimeString("en-US", { timeZoneName: "short" })
										.split(" ")
										.pop()}
									)
								</p>
								<div className="relative w-full h-[300px]">
									{filePreview && (
										<div className="absolute right-0 top-0">
											<img
												src={filePreview}
												alt="Preview"
												className="w-[397px] h-[250px] object-cover rounded-lg border border-gray-300 shadow-lg -mt-[44px]"
											/>
										</div>
									)}
								</div>
							</div>
							<div className="-mt-56">
								<p className="text-xs max-w-[513px]">{inputSummaryValue}</p>
							</div>
							<div className="mt-16 flex flex-row">
								<button className="w-40 h-9 bg-orange-400 rounded-lg">
									<p className="text-white text-xs">Register (Free)</p>
								</button>
								<button className="ml-5 w-40 h-9 border border-orange-400 rounded-lg bg-white">
									<p className="text-orange-400 text-xs">Learn More</p>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditCourse;
