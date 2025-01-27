import React, { useState } from "react";
import { sendPasswordResetEmail } from "../../services/firebaseAuthService";

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccess("");

		try {
			await sendPasswordResetEmail(email);
			setSuccess(
				"A confirmation email has been sent. Please check your email."
			);
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		}
	};

	return (
		// will add foster source navbar after Rachel finishes the component since she's working on that currently
		<div className="flex items-center justify-center h-screen bg-orange-500">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold text-center text-black">
					Forgot Password
				</h2>
				{error && <p className="text-red-500 text-center">{error}</p>}
				{success && <p className="text-green-500 text-center">{success}</p>}
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
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition ease-in-out duration-200"
					>
						Send Reset Email
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
