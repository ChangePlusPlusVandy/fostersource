import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../../services/authService";
import familyImage from "./images/family.png";
import fostersourceImage from "./images/fostersource-logo.png";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await authService.login(email, password);

			window.location.href = "/catalog";
		} catch (err: any) {
			console.error("Login error:", err);
			setError(err.message || "Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
		console.log(localStorage.user);
	};

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
						Login
					</h2>
					{error && <p className="text-red-500 text-center">{error}</p>}
					<form className="space-y-4" onSubmit={handleSubmit}>
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
								onChange={(e) => setPassword(e.target.value)}
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
						<button
							type="submit"
							disabled={isLoading}
							className="w-full px-4 py-2 text-white bg-[#F79518] rounded-lg hover:bg-[#F79518] transition ease-in-out duration-200"
						>
							{isLoading ? "Logging in..." : "Login"}
						</button>
					</form>
					<p className="text-center text-sm text-black">
						Don't have an account?{" "}
						<a
							href="/register"
							className="text-black-700 hover:underline font-semibold"
						>
							Register
						</a>
					</p>
					<p className="text-center text-sm text-black">
						<a
							href="/reset-password"
							className="text-black-700 hover:underline font-semibold"
						>
							Forgot Password?
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
