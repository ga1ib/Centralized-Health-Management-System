import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorEmail = localStorage.getItem("email");
        const { data } = await axios.get("http://localhost:5000/api/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const scheduled = data.appointments.filter(
          (a) => a.status?.toLowerCase() === "scheduled" && a.doctor_email === doctorEmail
        );
        setAppointments(scheduled);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6">
        <motion.h2
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Schedule
        </motion.h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-white text-5xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No scheduled appointments found.</p>
          </div>
        ) : (
          <motion.div 
            className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Patient Name</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Patient Email</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Time</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, index) => (
                  <motion.tr 
                    key={a._id || index}
                    className="border-b hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 text-gray-900">{a.patient_name}</td>
                    <td className="px-6 py-4 text-gray-900">{a.patient_email}</td>
                    <td className="px-6 py-4 text-gray-900">{a.date}</td>
                    <td className="px-6 py-4 text-gray-900">{a.time}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {a.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorSchedule;
