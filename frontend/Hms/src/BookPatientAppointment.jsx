import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const BookPatientAppointment = () => {
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/users/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data.users);
                // Filter doctors from users
                const doctorsList = response.data.users.filter(user => user.role === "doctor");
                setDoctors(doctorsList);

            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };

        fetchUsers();
    }, []);


    // Fetch appointments from the backend
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/appointments/", {
                headers: { Authorization: `Bearer ${token}` },
            });

           
            
            // setAppointments(filteredAppointments);
            setAppointments(response.data.appointments);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!doctor || !date || !time) {
            setError("All fields are required.");
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSuccess("Appointment booked successfully!");
            alert("Appointment booked successfully!");
            window.location.href = "/patient"; // Redirect to PatientDashboard
        }, 1000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
                    Book a Doctor's Appointment
                </h2>

                {loading && <p>Loading appointments...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {/* Appointments Table */}
                <div className="overflow-x-auto bg-white rounded-lg mt-8 text-black mb-8">
                    <table className="min-w-full">
                        <thead>
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
                            {appointments.map((apt) => (
                                <tr key={apt._id}>
                                    <td className="px-6 py-2">{apt.patient_email}</td>
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

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Select Doctor</label>
                        <select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Choose a Doctor --</option>
                            {doctors.map((doctor, index) => (
                                <option key={index} value={doctor.email}>
                                    {doctor.name || doctor.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Select Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
                    >
                        Book Appointment
                    </button>
                </form>

            </main>
            <Footer />
        </div>
    );
};

export default BookPatientAppointment;