import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorEmail = localStorage.getItem("email");
        const { data } = await axios.get("http://localhost:5000/api/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Debug: log doctorEmail and appointments
        console.log("Doctor Email:", doctorEmail);
        console.log("Fetched Appointments:", data.appointments);
        // Filter for scheduled appointments for this doctor (case-insensitive)
        const scheduled = data.appointments.filter(
          (a) => a.status?.toLowerCase() === "scheduled" && a.doctor_email === doctorEmail
        );
        setAppointments(scheduled);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6 text-black">
        <h2 className="text-4xl font-bold text-center text-white mb-8">My Schedule</h2>
        {error && (
          <div className="mb-6 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg text-center font-semibold">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-20 text-white text-xl">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-white text-lg">No scheduled appointments.</div>
        ) : (
          <div className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-12">
            <table className="min-w-full text-black">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">Patient Name</th>
                  <th className="px-6 py-3 text-left">Patient Email</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="border-b">
                    <td className="px-6 py-2">{a.patient_name}</td>
                    <td className="px-6 py-2">{a.patient_email}</td>
                    <td className="px-6 py-2">{a.date}</td>
                    <td className="px-6 py-2">{a.time}</td>
                    <td className="px-6 py-2 font-semibold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorSchedule;
