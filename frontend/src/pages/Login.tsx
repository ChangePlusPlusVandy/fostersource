import React, {useState} from "react";
import {signIn, register} from "../services/firebaseAuthService"; // Import your auth service

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between sign-up and sign-in
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

  return (
    <div>Login</div>
  );
}
