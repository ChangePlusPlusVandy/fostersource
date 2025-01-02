import React, { useState } from "react";
import { sendPasswordResetEmail, confirmPasswordReset } from "../services/firebaseAuthService";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
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
      await sendPasswordResetEmail(email);

      setSuccess(
        "A confirmation email has been sent. Please check your email to reset your password."
      );
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleConfirmReset = async () => {
    try {
      await confirmPasswordReset(email, newPassword);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (err: any) {
      setError(err.message || "Error confirming password reset.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-orange-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-black">Reset Password</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-black">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-black">New Password</label>
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
              Confirm New Password
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
            Send Confirmation Email
          </button>
        </form>

        {success && (
          <button
            onClick={handleConfirmReset}
            className="w-full mt-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition ease-in-out duration-200"
          >
            Confirm Password Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
