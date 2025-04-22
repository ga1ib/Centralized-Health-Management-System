import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const BookPatientAppointment = () => {
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [success, setSuccess] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/users/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data.users);
                const doctorsList = response.data.users.filter(user => user.role === "doctor");
                setDoctors(doctorsList);
            } catch (err) {
                setError("Failed to fetch doctors: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!doctor || !date || !time) {
            setError("All fields are required.");
            return;
        }

        try {
            const patient_email = localStorage.getItem("email");
            if (!patient_email) {
                setError("Patient email not found. Please login again.");
                return;
            }

            const patient = users.find(user => user.email === patient_email);
            if (!patient) {
                setError("Patient details not found.");
                return;
            }

            const selectedDoctor = doctors.find(doc => doc.name === doctor);
            if (!selectedDoctor) {
                setError("Doctor details not found.");
                return;
            }

            const appointmentData = {
                patient_email: patient.email,
                patient_name: patient.name,
                doctor_email: selectedDoctor.email,
                doctor_name: selectedDoctor.name,
                appointment_date: date,
                appointment_time: time
            };

            localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
            navigate('/patient-payment-processing');
        } catch (err) {
            setError("Error processing appointment: " + err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl leading-normal font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Book Appointment
                </motion.h2>

                <motion.div
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
                        {error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                {success}
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Select Doctor</label>
                            <select
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">-- Choose a Doctor --</option>
                                {doctors.map((doctor, index) => (
                                    <option key={index} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Select Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Select Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Book Appointment"}
                        </button>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default BookPatientAppointment;