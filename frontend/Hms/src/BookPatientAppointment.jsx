import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";

const BookPatientAppointment = () => {
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
                            <option value="Dr. Smith">Dr. Smith</option>
                            <option value="Dr. Johnson">Dr. Johnson</option>
                            <option value="Dr. Brown">Dr. Brown</option>
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