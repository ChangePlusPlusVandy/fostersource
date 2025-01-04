import React, { useState } from "react";
import { signIn } from "../services/firebaseAuthService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const token = await signIn(email, password);
      if (!token) throw new Error("No token received");
      localStorage.setItem("jwt", token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-orange-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-black">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
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
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-black">Password</label>
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
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-black">Remember me</span>
            </label>
            <a href="/reset-password" className="text-sm text-orange-600 hover:underline">
              Forgot Password?
            </a>

          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition ease-in-out duration-200"
          >
            Log In
          </button>

        </form>
        <p className="text-center text-sm text-black">
          Don’t have an account?{" "}
          <a href="/register" className="text-orange-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
