import React, { useState, useEffect } from "react";
import axios from "axios";
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

            // Find patient details from users array
            const patient = users.find(user => user.email === patient_email);
            if (!patient) {
                setError("Patient details not found.");
                return;
            }

            // Find doctor details from users array using selected doctor name
            const selectedDoctor = doctors.find(doc => doc.name === doctor);
            if (!selectedDoctor) {
                setError("Doctor details not found.");
                return;
            }

            // console.log({
            //     patient_email: patient.email,
            //     patient_name: patient.name,
            //     doctor_email: selectedDoctor.email,
            //     doctor_name: selectedDoctor.name,
            //     appointment_date: date,
            //     appointment_time: time
            // });

            // Simulate API call
            setTimeout(() => {
                alert("For booking you need to pay 500 taka.Press 'OK' to complete the process.");
                alert("Appointment booked successfully!");
                setSuccess("Appointment booked successfully!");
                window.location.href = "/patient"; // Redirect to PatientDashboard
            }, 1000);
        } catch (err) {
            setError("Error processing appointment: " + err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
                    Book a Doctor's Appointment
                </h2>

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
                                <option key={index} value={doctor.name}>
                                    {doctor.name}
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