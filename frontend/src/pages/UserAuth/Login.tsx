import React, { useState } from "react";
import authService from "../../services/authService";

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
		console.log(localStorage.user)

	};

	return (
		// will add foster source nav bar after Rachel finishes component for it since she's working on that part currently
		<div className="flex items-center justify-center h-screen bg-orange-500 w-full">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold text-center text-black">Login</h2>
				{error && <p className="text-red-500 text-center">{error}</p>}
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block mb-1 text-sm font-medium text-black">
							Email
						</label>
						<input
							type="email"
							className="w-full px-4 py-2 border rounded-lg"
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
							className="w-full px-4 py-2 border rounded-lg"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-2 top-9 text-orange-600 hover:text-orange-700 focus:outline-none"
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full px-4 py-2 text-white bg-orange-600 rounded-lg transition ease-in-out duration-200 ${
							isLoading
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-orange-700"
						}`}
					>
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>
				<p className="text-center text-sm text-black">
					Don't have an account?{" "}
					<a href="/register" className="text-orange-600 hover:underline">
						Register
					</a>
				</p>
				<p className="text-center text-sm text-black">
					<a href="/reset-password" className="text-orange-600 hover:underline">
						Forgot Password?
					</a>
				</p>
			</div>
		</div>
	);
};

export default Login;
