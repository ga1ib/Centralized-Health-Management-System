import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaSearch, FaEye } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const DoctorManageRecords = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorEmail = localStorage.getItem("email");
        const response = await axios.get("http://localhost:5000/api/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = (response.data.appointments || []).filter(
          a =>
            (a.doctor_email === doctorEmail || a.doctorEmail === doctorEmail) &&
            (a.status?.toLowerCase() === "visited" || a.status?.toLowerCase() === "completed")
        );
        setAppointments(filtered);
      } catch (err) {
        setError("Failed to fetch records: " + (err?.message || err));
        console.error("Fetch appointments error:", err);
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
          Patient Records
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
            <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No patient records found.</p>
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
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Patient</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <motion.tr
                    key={appt._id || appt.id}
                    className="border-b hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appt.patient_name || appt.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appt.patient_email || appt.patientEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appt.date ? new Date(appt.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${appt.status?.toLowerCase() === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'}`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/doctor-view-prescriptions?patient_email=${encodeURIComponent(appt.patient_email || appt.patientEmail)}&patient_name=${encodeURIComponent(appt.patient_name || appt.patientName || "")}`
                          )
                        }
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
                      >
                        <FaEye className="mr-2" />
                        View Records
                      </button>
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

export default DoctorManageRecords;
