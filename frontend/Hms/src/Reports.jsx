// HospitalReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

const HospitalReports = () => {
  const [reports, setReports] = useState([]);
  const [range, setRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5000/api/reports/hospital";
      if (range.start && range.end) url += `?start=${range.start}&end=${range.end}`;
      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setReports(data.reports);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);
  const handleChange = e => setRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); fetchReports(); };

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6 text-black">
        <motion.h2
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500 text-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >Hospital Reports</motion.h2>

        {loading ? (
          <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-white text-5xl" /></div>
        ) : error ? (
          <p className="text-red-400 text-center mb-6">{error}</p>
        ) : (
          <>
            <motion.form
              onSubmit={handleSubmit}
              className="mb-8 bg-white/80 backdrop-blur-lg rounded-xl p-8 max-w-2xl mx-auto shadow-2xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="inline mr-1 text-teal-600" /> Start Date
                  </label>
                  <input
                    type="date"
                    id="start"
                    name="start"
                    value={range.start}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
                </div>
                <div className="flex-1">
                  <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="inline mr-1 text-teal-600" /> End Date
                  </label>
                  <input
                    type="date"
                    id="end"
                    name="end"
                    value={range.end}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="self-end bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
                >
                  <FaFileAlt className="inline mr-2" /> Generate
                </button>
              </div>
            </motion.form>

            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >
              {reports.length > 0 ? (
                <table className="min-w-full">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-indigo-700">Metric</th>
                      <th className="px-6 py-3 text-left text-indigo-700">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <motion.tr key={i} className="border-b" whileHover={{ scale: 1.02 }}>
                        <td className="px-6 py-3 text-gray-800">{r.metric}</td>
                        <td className="px-6 py-3 font-semibold text-gray-900">{r.value}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-600">No data available for selected range.</p>
              )}
            </motion.div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HospitalReports;

