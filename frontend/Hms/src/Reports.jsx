//reports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing. Please log in.");
      const { data } = await axios.get("http://localhost:5000/api/reports/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(data.reports);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusFilterChange = e => {
    setStatusFilter(e.target.value);
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = prompt(
      `Current status is "${currentStatus}". Enter new status ("Paid" or "Unpaid"):`,
      currentStatus
    );
    if (!newStatus || !["Paid", "Unpaid"].includes(newStatus)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/reports/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDeleteReport = async id => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete report");
    }
  };

  const filteredReports = statusFilter
    ? reports.filter(r => r.status?.toLowerCase() === statusFilter.toLowerCase())
    : reports;

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6">
        <motion.h2
          className="text-5xl leading-normal font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hospital Reports
        </motion.h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-white text-5xl" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center mb-6">{error}</p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center bg-white/30 backdrop-blur-lg rounded-full px-4 py-2">
                <FaFilter className="text-white mr-2" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="bg-transparent text-gray-600 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto bg-white/50 backdrop-blur-lg rounded-lg shadow-lg">
              <table className="min-w-full">
                <thead className="bg-white/70">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-indigo-800">Patient ID</th> */}
                    <th className="px-6 py-3 text-left text-indigo-800">Name</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Date</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Amount</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Service</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Status</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(r => (
                    <motion.tr
                      key={r._id || `${r.patient_id}-${r.date}`}
                      className="border-b hover:bg-white/40"
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* <td className="px-6 py-3 text-black">{r.patient_id}</td> */}
                      <td className="px-6 py-3 text-black">{r.patient_name}</td>
                      <td className="px-6 py-3 text-black">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-black font-semibold">{r.amount}</td>
                      <td className="px-6 py-3 text-black">{r.service}</td>
                      <td className="px-6 py-3 text-black">{r.status}</td>
                      <td className="px-6 py-3 flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(r._id, r.status)}
                          className="p-2 bg-yellow-200 rounded-full shadow hover:bg-yellow-300 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(r._id)}
                          className="p-2 bg-red-600 rounded-full shadow hover:bg-red-700 transition"
                        >
                          <FaTrash className="text-white" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
