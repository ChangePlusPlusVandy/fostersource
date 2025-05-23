import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../../services/apiClient";
import { useParams } from "react-router-dom";
type Row = {
	id?: number;
	subject: string;
	file: string | File;
};
type Handout = {
	title: string;
	file: string;
};

const HandoutPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [uploadFile, setUploadFile] = useState(false);
	const [uploadLink, setUploadLink] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [link, setLink] = useState("");
	const [upload, setUpload] = useState("");
	const [subjectValue, setSubjectValue] = useState("");
	const [rows, setRows] = useState<Row[]>([]);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editId, setEditId] = useState(0);
	const { id } = useParams();
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);
	const onHandoutClick = () => {
		setModalOpen(true);
	};

	const getHandouts = async () => {
		try {
			const response = await apiClient.get(`/courses/${id}`);
			const course = response.data.data;
			const formattedHandouts = course.handouts.map(
				(handout: { title: string; file: string }, index: number) => ({
					id: index,
					subject: handout.title,
					file: handout.file,
				})
			);
			setRows(formattedHandouts);
			setDataLoaded(true);
		} catch (e) {
			console.log("Error retrieving course " + e);
		}
	};

	const rowsRef = useRef<Handout[]>([]);
	useEffect(() => {
		const formattedRows = rows.map(({ subject, file }) => ({
			title: subject,
			file: typeof file === "string" ? file : file.name, // handle File object or string
		}));

		rowsRef.current = formattedRows;
	}, [rows]);

	const updateHandouts = async () => {
		try {
			const response = await apiClient.put(`/courses/${id}`, {
				handouts: rowsRef.current,
			});
		} catch (e) {
			console.log("Error updating course " + e);
		}
	};

	useEffect(() => {
		return () => {
			if (dataLoaded) {
				updateHandouts();
			}
		};
	}, [dataLoaded]);

	useEffect(() => {
		getHandouts();
	}, []);

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			setFile(event.dataTransfer.files[0]);
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
		}
	};

	const onUploadFile = () => {
		setUploadFile(true);
		setUploadLink(false);
	};
	const onUploadLink = () => {
		setUploadFile(false);
		setUploadLink(true);
	};

	const handleSubmit = (subject: string, file: string | File | null) => {
		if (file) {
			let id = rows.length;
			setRows([...rows, { id, subject, file }]);
			setModalOpen(false);
			setFile(null);
			setSubjectValue("");
			setLink("");
		} else {
			alert("Enter link/file");
		}
	};

	const handleEditSubmit = (
		id: number,
		subject: string,
		file: string | File | null
	) => {
		if (file) {
			const updatedRows = rows.map((row, index) => {
				if (index === id) {
					// If the row's id matches, update this row with new data
					console.log(row.id);
					return { ...row, subject, file };
				}
				return row; // Return the unchanged row for others
			});
			setRows(updatedRows); // Update the state with the modified rows array
			setEditModalOpen(false); // Close the modal
			setFile(null); // Clear the file state if needed
			setLink("");
			setSubjectValue("");
		} else {
			alert("Enter link/file");
		}
	};

	const handleEdit = (id: number) => {
		setEditId(id);
		setEditModalOpen(true);
		setSubjectValue(rows[id].subject);
		const fileType = rows[id].file;
		if (typeof fileType === "string") {
			setLink(fileType);
		} else {
			setFile(fileType);
		}
	};

	const handleDelete = (index: number) => {
		const updatedRows = rows.filter((_, i) => i !== index); // Remove the row at the specified index
		setRows(updatedRows); // Update the state with the new array
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex w-full justify-end">
				<button
					className="w-[146px] h-[32px] mr-[290px] border bg-purple-500 rounded-md"
					onClick={onHandoutClick}
				>
					<p className="text-xs text-white">Add handout</p>
				</button>
			</div>
			{/* {
                editModalOpen && <EditModal id={editId} />
            } */}
			{editModalOpen && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
					onClick={() => setEditModalOpen(false)} // Close modal when clicking background
				>
					<div
						className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
					>
						{/* Modal Content */}
						<div className="flex flex-col">
							<h2 className="text-lg font-bold mb-2">Add Handout</h2>
							<div className="mt-3">
								<p className="text-sm">Name</p>
								<div className="text-xs">
									<textarea
										className="w-[330px] h-8 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-xs"
										placeholder="Enter subject name here..."
										value={subjectValue}
										onChange={(e) => setSubjectValue(e.target.value)}
									/>
								</div>
								<div>
									{/* Option 1 */}
									{/* <label className="flex items-center space-x-2 cursor-pointer mt-2">
										<input
											type="radio"
											name="choice"
											value="Upload File"
											className="hidden"
											onChange={() => onUploadFile()}
										/>
										<div
											className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
												uploadFile === true
													? "border-purple-500"
													: "border-gray-400"
											}`}
										>
											{uploadFile === true && (
												<div className="w-4 h-4 bg-purple-500 rounded-full"></div>
											)}
										</div>
										<span className="text-gray-700 text-sm">Upload File</span>
									</label> */}

									{/* Option 2 */}
									<label className="flex items-center space-x-2 cursor-pointer mt-2">
										<input
											type="radio"
											name="choice"
											value="Insert Link"
											className="hidden"
											onChange={() => onUploadLink()}
										/>
										<div
											className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
												uploadLink === true
													? "border-purple-500"
													: "border-gray-400"
											}`}
										>
											{uploadLink === true && (
												<div className="w-4 h-4 bg-purple-500 rounded-full"></div>
											)}
										</div>
										<span className="text-gray-700 text-sm">Upload Link</span>
									</label>
								</div>
								{uploadFile && (
									<div>
										<h2 className="mt-2">File Upload</h2>
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
									</div>
								)}
								{uploadLink && (
									<div>
										<p className="mt-3 text-sm">Link</p>
										<div className="text-xs">
											<textarea
												className="w-[330px] h-8 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-xs"
												placeholder="Enter subject name here..."
												value={link}
												onChange={(e) => setLink(e.target.value)}
											/>
										</div>
									</div>
								)}
								<div className="flex flex-row mt-12 ">
									<button
										className="w-[124px] h-[34px] bg-purple-500 border rounded-md ml-12"
										onClick={() => {
											uploadLink
												? handleEditSubmit(editId, subjectValue, link)
												: handleEditSubmit(editId, subjectValue, file);
										}}
									>
										<p className="text-white text-xs">Save and Exit</p>
									</button>
									<button
										className="ml-3 w-[124px] h-[34px] bg-white border border-purple-500 rounded-md"
										onClick={() => {
											setEditModalOpen(false);
											setSubjectValue("");
											setLink("");
											setFile(null);
										}}
									>
										<p className="text-purple-500 text-xs">Exit</p>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{modalOpen && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
					onClick={() => setModalOpen(false)} // Close modal when clicking background
				>
					<div
						className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
					>
						{/* Modal Content */}
						<div className="flex flex-col">
							<h2 className="text-lg font-bold mb-2">Add Handout</h2>
							<div className="mt-3">
								<p className="text-sm">Name</p>
								<div className="text-xs">
									<textarea
										className="w-[330px] h-8 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-xs"
										placeholder="Enter subject name here..."
										value={subjectValue}
										onChange={(e) => setSubjectValue(e.target.value)}
									/>
								</div>
								<div>
									{/* Option 1 */}
									{/* <label className="flex items-center space-x-2 cursor-pointer mt-2">
										<input
											type="radio"
											name="choice"
											value="Upload File"
											className="hidden"
											onChange={() => onUploadFile()}
										/>
										<div
											className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
												uploadFile === true
													? "border-purple-500"
													: "border-gray-400"
											}`}
										>
											{uploadFile === true && (
												<div className="w-4 h-4 bg-purple-500 rounded-full"></div>
											)}
										</div>
										<span className="text-gray-700 text-sm">Upload File</span>
									</label> */}

									{/* Option 2 */}
									<label className="flex items-center space-x-2 cursor-pointer mt-2">
										<input
											type="radio"
											name="choice"
											value="Insert Link"
											className="hidden"
											onChange={() => onUploadLink()}
										/>
										<div
											className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
												uploadLink === true
													? "border-purple-500"
													: "border-gray-400"
											}`}
										>
											{uploadLink === true && (
												<div className="w-4 h-4 bg-purple-500 rounded-full"></div>
											)}
										</div>
										<span className="text-gray-700 text-sm">Upload Link</span>
									</label>
								</div>
								{uploadFile && (
									<div>
										<h2 className="mt-2">File Upload</h2>
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
									</div>
								)}
								{uploadLink && (
									<div>
										<p className="mt-3 text-sm">Link</p>
										<div className="text-xs">
											<textarea
												className="w-[330px] h-8 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-xs"
												placeholder="Enter subject name here..."
												value={link}
												onChange={(e) => setLink(e.target.value)}
											/>
										</div>
									</div>
								)}
								<div className="flex flex-row mt-12 ">
									<button
										className="w-[124px] h-[34px] bg-purple-500 border rounded-md ml-12"
										onClick={() => {
											uploadLink
												? handleSubmit(subjectValue, link)
												: handleSubmit(subjectValue, file);
										}}
									>
										<p className="text-white text-xs">Save and Exit</p>
									</button>
									<button
										className="ml-3 w-[124px] h-[34px] bg-white border border-purple-500 rounded-md"
										onClick={() => {
											setModalOpen(false);
											setSubjectValue("");
											setLink("");
											setFile(null);
										}}
									>
										<p className="text-purple-500 text-xs">Exit</p>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="p-4">
				<table className="border border-gray-300 rounded-lg border-separate border-spacing-0">
					<thead className="rounded-lg">
						<tr className="bg-gray-200 rounded-lg">
							<th className="p-2 border border-r border-gray-300 w-[500px]">
								Subject
							</th>
							<th className="p-2 border border-r border-gray-300 w-[500px]">
								File/Link
							</th>
							<th className="p-2 border w-32">Actions</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{rows.map((row, index) => (
							<tr
								key={row.id}
								className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
							>
								<td className="p-2 border">{row.subject}</td>
								<td className="p-2 border">
									{typeof row.file === "string" ? (
										<a
											href={row.file}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline"
										>
											{row.file}
										</a>
									) : (
										<p>{row.file.name}</p>
									)}
								</td>

								<td className="p-2 border flex flex-row">
									<button
										onClick={() => {
											handleEdit(index);
										}}
										className="ml-6"
									>
										🖊️
									</button>
									<button onClick={() => handleDelete(index)} className="ml-6">
										🗑️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default HandoutPage;
