import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSpinner,
  FaFilter,
  FaEdit,
  FaTrash,
  FaUpload
} from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

const Reports = () => {
  const [reports, setReports]           = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [uploadForm, setUploadForm]     = useState({
    file:          null,
    patient_name:  "",
    service:       "",
    amount:        "",
    report_date:   "",   // ← new
    report_time:   ""    // ← new
  });
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing.");
      const { data } = await axios.get(
        "http://localhost:5000/api/reports/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(data.reports || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleStatusFilterChange = e => setStatusFilter(e.target.value);

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = prompt(
      `Current status is "${currentStatus}". Enter new status ("Paid" or "Unpaid"):`,
      currentStatus
    );
    if (!newStatus || !["Paid","Unpaid"].includes(newStatus)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/reports/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDeleteReport = async id => {
    if (!window.confirm("Delete this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/reports/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch {
      setError("Failed to delete report");
    }
  };

  const handleFileChange = e =>
    setUploadForm(prev => ({ ...prev, file: e.target.files[0] }));

  const handleUploadInputChange = e => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadForm.file);
    formData.append("patient_name", uploadForm.patient_name);
    formData.append("service", uploadForm.service);
    formData.append("amount", uploadForm.amount);
    formData.append("report_date", uploadForm.report_date);  // ← new
    formData.append("report_time", uploadForm.report_time);  // ← new

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/reports/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setUploadForm({
        file:         null,
        patient_name: "",
        service:      "",
        amount:       "",
        report_date:  "",
        report_time:  ""
      });
      setShowUploadForm(false);
      fetchReports();
    } catch {
      setError("Failed to upload report");
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
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-8"
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

              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
              >
                <FaUpload /> Upload Report
              </button>
            </div>

            {showUploadForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Upload New Report
                </h3>
                <form
                  onSubmit={handleUpload}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2">Patient Name</label>
                    <input
                      type="text"
                      name="patient_name"
                      value={uploadForm.patient_name}
                      onChange={handleUploadInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Service</label>
                    <input
                      type="text"
                      name="service"
                      value={uploadForm.service}
                      onChange={handleUploadInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={uploadForm.amount}
                      onChange={handleUploadInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="report_date"
                      value={uploadForm.report_date}
                      onChange={handleUploadInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      name="report_time"
                      value={uploadForm.report_time}
                      onChange={handleUploadInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Report File</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="overflow-x-auto bg-white/50 backdrop-blur-lg rounded-lg shadow-lg">
              <table className="min-w-full">
                <thead className="bg-white/70">
                  <tr>
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
                      key={r._id || `${r.patient_name}-${r.upload_date}`}
                      className="border-b hover:bg-white/40"
                      whileHover={{ scale: 1.02 }}
                    >
                      <td className="px-6 py-3 text-black">{r.patient_name}</td>
                      <td className="px-6 py-3 text-black">
                        {new Date(r.upload_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-black font-semibold">
                        ${r.amount}
                      </td>
                      <td className="px-6 py-3 text-black">{r.service}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                            r.status.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
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
