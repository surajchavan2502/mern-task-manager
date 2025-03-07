import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import API from "../utils/API";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      const res = await API.post("/api/public/auth/signin", {
        email,
        password,
      });
      console.log("API Response:", res.data);

      if (res.data.status === 200 && res.data.data?.accessToken) {
        setMessage("Sign In Successful! 🎉");
      } else {
        setMessage("Sign In Failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Sign In Failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign In
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Email Input */}
        <div className="relative mt-4">
          <FaUser className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="relative mt-4">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition mt-6"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Signup Link */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
