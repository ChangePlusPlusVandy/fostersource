import React, { useState } from "react";
import authService from "../../services/authService";
import familyImage from "./images/family.png"; 
import fostersourceImage from "./images/fostersource-logo.png";

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccessMessage("");
		setIsLoading(true);

		try {
			//await authService.sendResetPasswordEmail(email); will uncomment when integrating with emails
			setSuccessMessage("A reset link has been sent to your email.");
		} catch (err: any) {
			console.error("Reset password error:", err);
			setError(err.message || "Failed to send reset link. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-screen w-full bg-white">
			<div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${familyImage})` }}>
			</div>
			<div className="w-1/2 flex items-center justify-center">
				<div className="w-full max-w-md p-8 space-y-6 bg-white">
					<img src={fostersourceImage} alt="Foster Source" className="w-full h-auto mb-4" />
					<h2 className="text-4xl font-semibold text-center text-black">Reset Password</h2>
					{error && <p className="text-red-500 text-center">{error}</p>}
					{successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
					<form className="space-y-4" onSubmit={handleSubmit}>
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
						<button
							type="submit"
							disabled={isLoading}
							className="w-full px-4 py-2 text-white bg-[#F79518] rounded-lg hover:bg-[#F79518] transition ease-in-out duration-200"
						>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</button>
					</form>
					<p className="text-center text-sm text-black">
						Remembered your password?{" "}
						<a href="/login" className="text-black-700 hover:underline font-semibold">Log In</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
