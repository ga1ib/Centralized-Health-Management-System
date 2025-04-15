import React, { useEffect, useState } from 'react';
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
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
                    My Appointment Dashboard
                </h2>

                {loading && <p>Loading appointments...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {/* Appointments Table */}
                <div className="overflow-x-auto bg-white rounded-lg mt-8 text-black mb-8">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left">Doctor Email</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Time</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((apt) => (
                                <tr key={apt._id}>
                                    <td className="px-6 py-2">{apt.doctor_email}</td>
                                    <td className="px-6 py-2">{apt.date}</td>
                                    <td className="px-6 py-2">{apt.time}</td>
                                    <td className="px-6 py-2">{apt.status}</td>
                                    <td className="px-6 py-2">
                                        <button
                                            onClick={() => handleUpdate(apt._id)}
                                            className="bg-yellow-400 px-3 py-1 rounded mr-2 text-white"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(apt._id)}
                                            className="bg-red-600 px-3 py-1 rounded text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default ViewPatientAppointment;