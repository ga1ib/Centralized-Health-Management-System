// signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: fullName,
        email,
        password,
      });
      // Save token after signup
      localStorage.setItem("token", response.data.token);
      // Redirect to dashboard (Home)
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('../image/bg-signup.jpg')] bg-fixed bg-cover bg-center">
      <div className="bg-gray-50 bg-opacity-30 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-sky-950">
          Hospital Management System
        </h2>
        <p className="text-gray-600 text-center mt-2">Create your account</p>

        <form className="mt-6" onSubmit={handleSignup}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
