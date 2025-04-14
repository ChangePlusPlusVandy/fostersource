import React, { useState } from "react";
import authService from "../../services/authService";
import familyImage from "./family.png"; // Use the same image as in Login
import fostersourceImage from "./fostersource-logo.png";

const Register: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Password validation states
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

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (!isLengthValid || !isUppercaseValid || !isLowercaseValid || !isNumberValid || !isSpecialCharValid) {
			setError("Password does not meet the requirements");
			return;
		}

		try {
			await authService.register(email, password, name);
			window.location.href = "/catalog";
		} catch (err: any) {
			console.error("Registration error:", err);
			setError(err.message || "Registration failed. Please try again.");
		}
	};

	return (
		<div className="flex h-screen w-full bg-white">
			<div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${familyImage})` }}>
			</div>
			<div className="w-1/2 flex items-center justify-center">
				<div className="w-full max-w-md p-8 space-y-6 bg-white">
					<img src={fostersourceImage} alt="Foster Source" className="w-full h-auto mb-4" />
					<h2 className="text-4xl font-semibold text-center text-black">Create your account</h2>
					{error && <p className="text-red-500 text-center">{error}</p>}
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label className="block mb-1 text-sm font-medium text-black">Name</label>
							<input
								type="text"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block mb-1 text-sm font-medium text-black">Email</label>
							<input
								type="email"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="relative">
							<label className="block mb-1 text-sm font-medium text-black">Password</label>
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
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
						<div className="text-sm">
							<p className={`flex items-center ${isLengthValid ? "text-green-500" : "text-red-500"}`}>
								{isLengthValid ? "✔️" : "❌"} At least 8 characters long
							</p>
							<p className={`flex items-center ${isUppercaseValid ? "text-green-500" : "text-red-500"}`}>
								{isUppercaseValid ? "✔️" : "❌"} Includes uppercase
							</p>
							<p className={`flex items-center ${isLowercaseValid ? "text-green-500" : "text-red-500"}`}>
								{isLowercaseValid ? "✔️" : "❌"} Includes lowercase
							</p>
							<p className={`flex items-center ${isNumberValid ? "text-green-500" : "text-red-500"}`}>
								{isNumberValid ? "✔️" : "❌"} Includes numbers
							</p>
							<p className={`flex items-center ${isSpecialCharValid ? "text-green-500" : "text-red-500"}`}>
								{isSpecialCharValid ? "✔️" : "❌"} Includes special character
							</p>
						</div>
						<div>
							<label className="block mb-1 text-sm font-medium text-black">Confirm Password</label>
							<input
								type="password"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition ease-in-out duration-200"
						>
							Register
						</button>
					</form>
					<p className="text-center text-sm text-black">
						Already have an account?{" "}
						<a href="/login" className="text-black-700 hover:underline font-semibold">Log In</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
