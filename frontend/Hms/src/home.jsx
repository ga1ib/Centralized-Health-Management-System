import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import Header from "./header";
import Footer from "./footer";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading effect (e.g., data fetch or visual delay)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2s delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6 text-white">
        {loading ? (
          <div className="flex justify-center py-40">
            <FaSpinner className="animate-spin text-white text-6xl" />
          </div>
        ) : (
          <>
            <motion.h2
              className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Admin Dashboard
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Manage Users */}
              <motion.div
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">Manage Users</h3>
                <p className="text-gray-700 mb-4">
                  Add, remove, and update doctors, patients, and staff.
                </p>
                  <Link
              to="/manage-users"
              className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
            >
              See more...
            </Link>
              </motion.div>

              {/* Appointments */}
              <motion.div
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">Appointments</h3>
                <p className="text-gray-700 mb-4">
                  Monitor and manage hospital appointments.
                </p>
               <Link
              to="/appointments"
              className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
            >
              See more...
            </Link>
              </motion.div>

              {/* Hospital Reports */}
              <motion.div
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold text-cyan-900 mb-2">Hospital Reports</h3>
                <p className="text-gray-700 mb-4">
                  Generate reports on hospital performance and earnings.
                </p>
                  <Link
              to="/reports"
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

export default Home;
