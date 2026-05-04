import React, { useState } from "react";
import { auth } from "../../services/firebaseConfig";
import apiClient from "../../services/apiClient";
import familyImage from "./images/family.png";
import fostersourceImage from "./images/fostersource-logo.png";

const ChangePasswordNow: React.FC = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (newPassword.length < 8) {
			setError("Please use at least 8 characters for your new password.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		if (!auth.currentUser) {
			setError("Your session has expired. Please log in again.");
			window.location.href = "/login";
			return;
		}

		setIsLoading(true);

		try {
			await auth.currentUser.updatePassword(newPassword);
			const response = await apiClient.post(
				"/users/me/password-reset-complete"
			);

			if (response.data?.user) {
				const updatedUser = response.data.user;
				if (updatedUser.cart && typeof updatedUser.cart === "string") {
					updatedUser.cart = JSON.parse(updatedUser.cart);
				}
				localStorage.setItem("user", JSON.stringify(updatedUser));
			}

			setSuccess("Password changed successfully. Redirecting to catalog...");
			setTimeout(() => {
				window.location.href = "/catalog";
			}, 1200);
		} catch (err: any) {
			const firebaseCode = err?.code;
			if (firebaseCode === "auth/requires-recent-login") {
				setError(
					"For security reasons, please log in again and retry changing your password."
				);
				return;
			}

			setError(
				err?.response?.data?.message ||
					err?.message ||
					"Failed to update password. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-screen w-full bg-white">
			<div
				className="w-1/2 bg-cover"
				style={{
					backgroundImage: `url(${familyImage})`,
					backgroundPosition: "center 20%",
				}}
			/>
			<div className="w-1/2 flex items-center justify-center">
				<div className="w-full max-w-md p-8 space-y-6 bg-white">
					<img
						src={fostersourceImage}
						alt="Foster Source"
						className="w-full h-auto mb-4"
					/>
					<h2 className="text-4xl font-semibold text-center text-black">
						Change Password
					</h2>
					<p className="text-sm text-center text-gray-600">
						You are using a temporary password. Please set a new password to
						continue.
					</p>
					{error && <p className="text-red-500 text-center">{error}</p>}
					{success && <p className="text-green-600 text-center">{success}</p>}
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label className="block mb-1 text-sm font-medium text-black">
								New Password
							</label>
							<input
								type="password"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block mb-1 text-sm font-medium text-black">
								Confirm New Password
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
							type="submit"
							disabled={isLoading}
							className="w-full px-4 py-2 text-white bg-[#F79518] rounded-lg hover:bg-[#e58914] transition ease-in-out duration-200 disabled:opacity-60"
						>
							{isLoading ? "Updating..." : "Update Password"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ChangePasswordNow;
