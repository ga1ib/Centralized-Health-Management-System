import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-email", {
        email,
        otp,
      });

      setToast({ show: true, message: "✅ Email verified successfully!", type: "success" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.error || "Verification failed";
      setError(message);
      setToast({ show: true, message: `❌ ${message}`, type: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('../image/bg_verify.jpg')] bg-cover bg-center">
      <Toast {...toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

      <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-sky-950">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Enter the OTP sent to your email address
        </p>

        <form className="mt-6" onSubmit={handleVerification}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your registered email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the 6-digit OTP"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
          >
            Verify Email
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already verified?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
