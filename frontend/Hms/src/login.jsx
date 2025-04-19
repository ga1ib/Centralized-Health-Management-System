import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const Login = () => {
  const [step, setStep]       = useState("credentials"); // or "otp"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]         = useState("");
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState({ show: false, message: "", type: "success" });
  const navigate              = useNavigate();

  // Step 1: submit email+password
  const handleCredentials = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email, password
      });
      if (res.data.step === "verify_otp") {
        setToast({ show: true, message: "🔒 OTP sent to your email", type: "success" });
        setStep("otp");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setToast({ show: true, message: "❌ Login failed", type: "error" });
    }
  };

  // Step 2: submit OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-login-otp", {
        email, otp
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("role", res.data.user.role);
      setToast({ show: true, message: "✅ Login successful!", type: "success" });

      setTimeout(() => {
        const { role } = res.data.user;
        navigate(role === "admin" ? "/" : role === "doctor" ? "/doctor" : "/patient");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
      setToast({ show: true, message: "❌ Invalid OTP", type: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('../image/bg_login.jpg')] bg-fixed bg-cover bg-center">
      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, show: false }))} />

      <div className="bg-white bg-opacity-65 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-sky-950">
          Hospital Management System
        </h2>
        <p className="text-gray-600 text-center mt-2">
          {step === "credentials" ? "Login to your account" : "Enter the OTP"}
        </p>

        {step === "credentials" ? (
          <form className="mt-6" onSubmit={handleCredentials}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form className="mt-6" onSubmit={handleOtpVerify}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the 6‑digit code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
            >
              Verify & Login
            </button>
          </form>
        )}

        {step === "credentials" && (
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
