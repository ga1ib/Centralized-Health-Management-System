// Appointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patient_email: "", doctor_email: "", date: "", time: "", status: "Scheduled" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/appointments/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ patient_email: "", doctor_email: "", date: "", time: "", status: "Scheduled" });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create appointment.");
    }
  };

  const handleUpdate = async (id) => {
    const newStatus = prompt("Enter new status (Scheduled, Completed, Cancelled):", "Scheduled");
    if (!newStatus) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update appointment.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete appointment.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6 text-white">
        <motion.h2
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Appointments
        </motion.h2>

        {error && (
          <div className="mb-6 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg text-center font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-white text-5xl" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-12">
              <table className="min-w-full text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Patient Email</th>
                    <th className="px-6 py-3 text-left">Doctor Email</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Time</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <motion.tr key={a._id} className="border-b" whileHover={{ scale: 1.01 }}>
                      <td className="px-6 py-2">{a.patient_email}</td>
                      <td className="px-6 py-2">{a.doctor_email}</td>
                      <td className="px-6 py-2">{a.date}</td>
                      <td className="px-6 py-2">{a.time}</td>
                      <td className="px-6 py-2 font-semibold">{a.status}</td>
                      <td className="px-6 py-2 flex gap-2">
                        <button onClick={() => handleUpdate(a._id)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(a._id)} className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition">
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 max-w-lg mx-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <FaPlus className="mr-2" /> New Appointment
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <input
                  type="email"
                  name="patient_email"
                  value={form.patient_email}
                  onChange={handleInputChange}
                  required
                  placeholder="Patient Email"
                  className="w-full p-3 rounded-lg border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  name="doctor_email"
                  value={form.doctor_email}
                  onChange={handleInputChange}
                  required
                  placeholder="Doctor Email"
                  className="w-full p-3 rounded-lg border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleInputChange}
                    required
                    className="flex-1 p-3 rounded-lg border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleInputChange}
                    required
                    className="flex-1 p-3 rounded-lg border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition"
                >
                  Add Appointment
                </button>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
