// PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import Header from "./header";
import Footer from "./footer";

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6">
        {loading ? (
          <div className="flex justify-center py-40">
            <FaSpinner className="animate-spin text-white text-6xl" />
          </div>
        ) : (
          <>
            <motion.h2
              className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-black text-center mb-12"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Patient Dashboard
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">My Appointments</h3>
                <p className="text-gray-700 mb-4">
                  View and manage your appointments with doctors.
                </p>
                <Link
                  to="/patient-appointments"
                  className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
                >
                  See more...
                </Link>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">Medical Records</h3>
                <p className="text-gray-700 mb-4">
                  Access your complete medical history and prescriptions.
                </p>
                <Link
                  to="/patient-medical-reports"
                  className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
                >
                  See more...
                </Link>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">Billing & Payments</h3>
                <p className="text-gray-700 mb-4">
                  View payment history and manage medical bills.
                </p>
                <Link
                  to="/patient-payment-history"
                  className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
                >
                  See more...
                </Link>
              </motion.div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PatientDashboard;