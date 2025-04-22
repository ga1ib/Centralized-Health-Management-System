import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaEdit, FaTrash, FaNotesMedical, FaHistory } from "react-icons/fa";
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const DoctorAppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/appointments/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const filteredAppointments = response.data.appointments.filter(
                appointment => appointment.doctor_email === localStorage.getItem("email")
            );
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

    const handleUpdate = async (id) => {
        const newStatus = prompt("Enter new status (Scheduled, Completed, Cancelled):", "Scheduled");
        if (!newStatus) return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/appointments/${id}`, 
                { status: newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAppointments();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update appointment.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl leading-normal font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Appointment Dashboard
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
                    <motion.div
                        className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Patient Email</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Time</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt, index) => (
                                    <motion.tr 
                                        key={apt._id}
                                        className="border-b hover:bg-gray-50"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{apt.patient_name}</div>
                                            <div className="text-sm text-gray-500">{apt.patient_email}</div>
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
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUpdate(apt._id)}
                                                    className="p-2 bg-yellow-200 text-yellow-700 rounded-full hover:bg-yellow-300 transition"
                                                    title="Edit Status"
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
                                                <button
                                                    onClick={() => window.location.href = `/doctor-add-prescription?patient_email=${encodeURIComponent(apt.patient_email)}&patient_name=${encodeURIComponent(apt.patient_name)}`}
                                                    className="p-2 bg-green-200 text-green-700 rounded-full hover:bg-green-300 transition"
                                                    title="Add Prescription"
                                                >
                                                    <FaNotesMedical />
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = `/doctor-patient-history?patient_email=${encodeURIComponent(apt.patient_email)}`}
                                                    className="p-2 bg-blue-200 text-blue-700 rounded-full hover:bg-blue-300 transition"
                                                    title="View History"
                                                >
                                                    <FaHistory />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No appointments found.</p>
                        )}
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DoctorAppointmentList;