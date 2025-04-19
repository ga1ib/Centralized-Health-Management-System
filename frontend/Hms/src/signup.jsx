import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const Signup = () => {
  const [step, setStep] = useState("registration"); // or "verify_otp"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name: fullName, email, password, role }
      );

      setToast({ show: true, message: "✉️ Please check your email for verification code", type: "success" });
      setStep("verify_otp");

    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
      setToast({ show: true, message: "❌ Signup failed.", type: "error" });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        { email, otp }
      );

      setToast({ show: true, message: "🎉 Email verified! You can now login.", type: "success" });

      // Redirect to login page after successful verification
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
      setToast({ show: true, message: "❌ Verification failed", type: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('../image/bg-signup.jpg')] bg-fixed bg-cover bg-center">
      <Toast
        {...toast}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      <div className="bg-gray-50 bg-opacity-30 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-sky-950">Hospital Management System</h2>
        <p className="text-gray-600 text-center mt-2">
          {step === "registration" ? "Create your account" : "Verify your email"}
        </p>

        {step === "registration" ? (
          <form className="mt-6" onSubmit={handleSignup}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Sign up as</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={role === "patient"}
                    onChange={() => setRole("patient")}
                  />
                  <span className="ml-2">Patient</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={() => setRole("doctor")}
                  />
                  <span className="ml-2">Doctor</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form className="mt-6" onSubmit={handleVerifyOTP}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                placeholder="Enter the 6-digit code"
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
            >
              Verify Email
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
