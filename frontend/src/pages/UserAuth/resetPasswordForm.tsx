import React, { useState } from "react";
import { confirmPasswordReset } from "../../services/firebaseAuthService";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
	const { token } = useParams<{ token: string }>();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			await confirmPasswordReset(token || "", newPassword);
			setSuccess("Password reset successful! Redirecting to login...");
			setTimeout(() => navigate("/login"), 3000);
		} catch (err: any) {
			setError(err.message || "Error resetting password.");
		}
	};

	return (
		// will add navbar after Rachel finishes component since she's working on that currently
		<div className="flex items-center justify-center h-screen bg-orange-500">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold text-center text-black">
					Reset Your Password
				</h2>
				{error && <p className="text-red-500 text-center">{error}</p>}
				{success && <p className="text-green-500 text-center">{success}</p>}
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block mb-1 text-sm font-medium text-black">
							New Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-2 border rounded-lg"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-black">
							Confirm Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-2 border rounded-lg"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition ease-in-out duration-200"
					>
						Reset Password
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPasswordForm;
