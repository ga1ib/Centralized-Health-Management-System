import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const ViewPatientAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch appointments from the backend
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/appointments/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const filteredAppointments = response.data.appointments.filter(appointment => appointment.patient_email === localStorage.getItem("email"));
            setAppointments(filteredAppointments);

        } catch (err) {
            setError(err.response?.data?.error || "Failed to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Delete an appointment (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAppointments(); // Refresh after deletion
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete appointment.");
        }
    };

    // Update an appointment's status (PUT)
    const handleUpdate = async (id) => {
        const newStatus = prompt("Enter new status (Scheduled, Completed, Cancelled):", "Scheduled");
        if (!newStatus) return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAppointments(); // Refresh after update
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update appointment.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    My Appointments
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <FaSpinner className="animate-spin text-white text-5xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-700">Doctor</th>
                                    <th className="px-6 py-3 text-left text-gray-700">Date</th>
                                    <th className="px-6 py-3 text-left text-gray-700">Time</th>
                                    <th className="px-6 py-3 text-left text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt) => (
                                    <motion.tr 
                                        key={apt._id}
                                        className="border-b hover:bg-gray-50"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{apt.doctor_name}</div>
                                            <div className="text-sm text-gray-500">{apt.doctor_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{apt.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{apt.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                ${apt.status?.toLowerCase() === 'scheduled' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : apt.status?.toLowerCase() === 'completed'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(apt._id)}
                                                className="p-2 bg-yellow-200 text-yellow-700 rounded-full hover:bg-yellow-300 transition"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(apt._id)}
                                                className="p-2 bg-red-200 text-red-700 rounded-full hover:bg-red-300 transition"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No appointments found.</p>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ViewPatientAppointment;