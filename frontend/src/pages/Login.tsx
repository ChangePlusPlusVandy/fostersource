import React, { useState } from "react";
import { signIn, register } from "../services/firebaseAuthService";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		try {
			if (isSignUp) {
				const user = await register(email, password);
				console.log("User registered:", user);
			} else {
				const user = await signIn(email, password);
				console.log("User signed in:", user);
			}
		} catch (error: any) {
			setError(error.message);
		}
	};

	// design later when designs are in
	return <div>Login</div>;
}
