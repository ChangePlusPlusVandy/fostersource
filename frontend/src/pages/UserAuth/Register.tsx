import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../../services/authService";
import familyImage from "./images//family.png";
import Select from "react-select";
import countryList from "react-select-country-list";
import fostersourceImage from "./images/fostersource-logo.png";
import apiClient from "../../services/apiClient";
import { UserType } from "../../shared/types";

const states = [
	"Alabama",
	"Alaska",
	"Arizona",
	"Arkansas",
	"California",
	"Colorado",
	"Connecticut",
	"Delaware",
	"Florida",
	"Georgia",
	"Hawaii",
	"Idaho",
	"Illinois",
	"Indiana",
	"Iowa",
	"Kansas",
	"Kentucky",
	"Louisiana",
	"Maine",
	"Maryland",
	"Massachusetts",
	"Michigan",
	"Minnesota",
	"Mississippi",
	"Missouri",
	"Montana",
	"Nebraska",
	"Nevada",
	"New Hampshire",
	"New Jersey",
	"New Mexico",
	"New York",
	"North Carolina",
	"North Dakota",
	"Ohio",
	"Oklahoma",
	"Oregon",
	"Pennsylvania",
	"Rhode Island",
	"South Carolina",
	"South Dakota",
	"Tennessee",
	"Texas",
	"Utah",
	"Vermont",
	"Virginia",
	"Washington",
	"West Virginia",
	"Wisconsin",
	"Wyoming",
];

const Register: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [certification, setCertification] = useState("");
	const [company, setCompany] = useState("");
	const [userType, setUserType] = useState<UserType | null>(null);
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zip, setZip] = useState("");
	const [country, setCountry] = useState<{
		label: string;
		value: string;
	} | null>(null);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);

	const [isLengthValid, setIsLengthValid] = useState(false);
	const [isUppercaseValid, setIsUppercaseValid] = useState(false);
	const [isLowercaseValid, setIsLowercaseValid] = useState(false);
	const [isNumberValid, setIsNumberValid] = useState(false);
	const [isSpecialCharValid, setIsSpecialCharValid] = useState(false);

	const handlePasswordChange = (password: string) => {
		setPassword(password);
		setIsLengthValid(password.length >= 8);
		setIsUppercaseValid(/[A-Z]/.test(password));
		setIsLowercaseValid(/[a-z]/.test(password));
		setIsNumberValid(/[0-9]/.test(password));
		setIsSpecialCharValid(/[^A-Za-z0-9]/.test(password));
	};

	const handleNext = () => {
		if (currentStep === 1) {
			if (
				password !== confirmPassword ||
				!isLengthValid ||
				!isUppercaseValid ||
				!isLowercaseValid ||
				!isNumberValid ||
				!isSpecialCharValid
			) {
				setError(
					"Please ensure all password requirements are met and passwords match."
				);
				return;
			}
		} else if (currentStep === 2) {
			if (!firstName || !lastName || !certification) {
				setError(
					"Please fill in your first name, last name, and certification."
				);
				return;
			}
		}
		setError("");
		setCurrentStep(currentStep + 1);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		try {
			await authService.register({
				email,
				password,
				name: `${firstName} ${lastName}`,
				phone,
				certification,
				userType: userType ? userType._id : "N/A",
				company,
				address1,
				address2,
				city,
				state,
				zip,
				country: country?.value || "N/A",
			});
			window.location.href = "/catalog";
		} catch (err: any) {
			console.error("Registration error:", err);
			setError(err.message || "Registration failed. Please try again.");
		}
	};

	const [userTypes, setUserTypes] = useState<UserType[]>([]);

	// const fetchUserTypes = async () => {
	// 	try {
	// 		const response = await apiClient.get("/user-types");
	// 		setUserTypes(response.data.data);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	const fetchUserTypes = async () => {
		try {
			const response = await apiClient.get("/user-types");
			const filtered = response.data.data.filter(
				(ut: UserType) => ut.name !== "Staff"
			);
			setUserTypes(filtered);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUserTypes();
	}, []);

	return (
		<div className="flex h-screen w-full bg-white">
			<div
				className="w-1/2 bg-cover"
				style={{
					backgroundImage: `url(${familyImage})`,
					backgroundPosition: "center 20%", // adjust this value to control how far down it shifts
				}}
			></div>
			<div className="w-1/2 flex items-center justify-center">
				<div className="w-full max-w-md p-8 space-y-6 bg-white">
					<img
						src={fostersourceImage}
						alt="Foster Source"
						className="w-full h-auto mb-4"
					/>
					<h2 className="text-4xl font-semibold text-center text-black">
						Create your account
					</h2>
					{error && <p className="text-red-500 text-center">{error}</p>}
					<form className="space-y-4" onSubmit={handleSubmit}>
						{currentStep === 1 && (
							<>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Email
									</label>
									<input
										type="email"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="relative">
									<label className="block mb-1 text-sm font-medium text-black">
										Password
									</label>
									<input
										type={showPassword ? "text" : "password"}
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={password}
										onChange={(e) => handlePasswordChange(e.target.value)}
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-2 top-9 text-black-600"
									>
										{showPassword ? <FaEyeSlash /> : <FaEye />}
									</button>
								</div>
								<div className="text-sm">
									<p
										className={`flex items-center ${isLengthValid ? "text-green-500" : "text-red-500"}`}
									>
										{isLengthValid ? "🟢" : "🔴"} At least 8 characters long
									</p>
									<p
										className={`flex items-center ${isUppercaseValid ? "text-green-500" : "text-red-500"}`}
									>
										{isUppercaseValid ? "🟢" : "🔴"} Includes uppercase
									</p>
									<p
										className={`flex items-center ${isLowercaseValid ? "text-green-500" : "text-red-500"}`}
									>
										{isLowercaseValid ? "🟢" : "🔴"} Includes lowercase
									</p>
									<p
										className={`flex items-center ${isNumberValid ? "text-green-500" : "text-red-500"}`}
									>
										{isNumberValid ? "🟢" : "🔴"} Includes numbers
									</p>
									<p
										className={`flex items-center ${isSpecialCharValid ? "text-green-500" : "text-red-500"}`}
									>
										{isSpecialCharValid ? "🟢" : "🔴"} Includes special
										character
									</p>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Confirm Password
									</label>
									<input
										type="password"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>
								<button
									type="button"
									onClick={handleNext}
									className={`w-full px-4 py-2 text-white bg-[#F79518] rounded-lg hover:bg-[#F79518] transition ease-in-out duration-200 ${
										!(
											isLengthValid &&
											isUppercaseValid &&
											isLowercaseValid &&
											isNumberValid &&
											isSpecialCharValid
										)
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}
									disabled={
										!(
											isLengthValid &&
											isUppercaseValid &&
											isLowercaseValid &&
											isNumberValid &&
											isSpecialCharValid
										)
									}
								>
									Next
								</button>
							</>
						)}
						{currentStep === 2 && (
							<>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block mb-1 text-sm font-medium text-black">
											First Name
										</label>
										<input
											type="text"
											className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
											value={firstName}
											onChange={(e) =>
												setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ""))
											}
											required
										/>
									</div>
									<div>
										<label className="block mb-1 text-sm font-medium text-black">
											Last Name
										</label>
										<input
											type="text"
											className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
											value={lastName}
											onChange={(e) =>
												setLastName(e.target.value.replace(/[^a-zA-Z]/g, ""))
											}
											required
										/>
									</div>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Who are you certified through?
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={certification}
										onChange={(e) => setCertification(e.target.value)}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Company (optional)
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={company}
										onChange={(e) => setCompany(e.target.value)}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Phone Number (optional)
									</label>
									<input
										type="tel"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={phone}
										onChange={(e) =>
											setPhone(e.target.value.replace(/[^0-9+]/g, ""))
										}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										User Type
									</label>
									<Select
										options={userTypes}
										getOptionLabel={(ut) => ut.name}
										getOptionValue={(ut) => ut._id}
										value={userType}
										onChange={(ut) => setUserType(ut)}
										placeholder="Choose User Type"
										styles={{
											control: (provided, state) => ({
												...provided,
												borderColor: state.isFocused
													? "orange"
													: provided.borderColor,
												boxShadow: state.isFocused
													? "0 0 0 1px orange"
													: provided.boxShadow,
												"&:hover": {
													borderColor: "orange",
												},
											}),
											placeholder: (provided) => ({
												...provided,
												color: "gray",
											}),
											singleValue: (provided) => ({
												...provided,
												color: "black",
											}),
										}}
									/>
								</div>
								<button
									type="button"
									onClick={handleNext}
									className="w-full px-4 py-2 text-white bg-[#F79518] rounded-lg hover:bg-[#F79518] transition ease-in-out duration-200"
								>
									Next
								</button>
							</>
						)}
						{currentStep === 3 && (
							<>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Address Line (optional)
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={address1}
										onChange={(e) => setAddress1(e.target.value)}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Address Line 2 (optional)
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={address2}
										onChange={(e) => setAddress2(e.target.value)}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										City (optional)
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={city}
										onChange={(e) =>
											setCity(e.target.value.replace(/[^a-zA-Z]/g, ""))
										}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										State (optional)
									</label>
									<Select
										options={states.map((state) => ({
											value: state,
											label: state,
										}))}
										value={state ? { value: state, label: state } : null}
										onChange={(selectedOption) =>
											setState(selectedOption ? selectedOption.value : "")
										}
										placeholder="Choose a State"
										styles={{
											control: (provided, state) => ({
												...provided,
												borderColor: state.isFocused
													? "orange"
													: provided.borderColor,
												boxShadow: state.isFocused
													? "0 0 0 1px orange"
													: provided.boxShadow,
												"&:hover": {
													borderColor: "orange",
												},
											}),
											placeholder: (provided) => ({
												...provided,
												color: "gray",
											}),
											singleValue: (provided) => ({
												...provided,
												color: "black",
											}),
										}}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Zip/Postal Code (optional)
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										value={zip}
										onChange={(e) =>
											setZip(e.target.value.replace(/[^0-9]/g, ""))
										}
									/>
								</div>
								<div>
									<label className="block mb-1 text-sm font-medium text-black">
										Country (optional)
									</label>
									<Select
										options={countryList()
											.getData()
											.map((country) => ({
												value: country.value,
												label: country.label,
											}))}
										value={country}
										onChange={(selectedOption) =>
											setCountry(selectedOption ? selectedOption : null)
										}
										placeholder="Choose a Country"
										styles={{
											control: (provided, state) => ({
												...provided,
												borderColor: state.isFocused
													? "orange"
													: provided.borderColor,
												boxShadow: state.isFocused
													? "0 0 0 1px orange"
													: provided.boxShadow,
												"&:hover": {
													borderColor: "orange",
												},
											}),
											placeholder: (provided) => ({
												...provided,
												color: "gray",
											}),
											singleValue: (provided) => ({
												...provided,
												color: "black",
											}),
										}}
									/>
								</div>
								<button
									type="submit"
									className="w-full px-4 py-2 text-white bg-[#F79518] rounded-lg hover:bg-[#F79518] transition ease-in-out duration-200"
								>
									Finish
								</button>
							</>
						)}
					</form>
					<p className="text-center text-sm text-black">
						Already have an account?{" "}
						<a
							href="/login"
							className="text-black-700 hover:underline font-semibold"
						>
							Log In
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
