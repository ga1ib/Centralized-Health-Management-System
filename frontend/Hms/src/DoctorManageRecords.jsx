import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const DoctorManageRecords = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorEmail = localStorage.getItem("email");
        const response = await axios.get("http://localhost:5000/api/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = (response.data.appointments || []).filter(
          a =>
            a.doctor_email === doctorEmail &&
            (a.status?.toLowerCase() === "visited" || a.status?.toLowerCase() === "completed")
        );
        setAppointments(filtered);
      } catch (err) {
        setError("Failed to fetch records");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Manage Patient Records</h2>
        {appointments.length === 0 ? (
          <div className="text-white">No records found.</div>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Patient Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td className="py-2 px-4 border-b">{appt.patient_name}</td>
                  <td className="py-2 px-4 border-b">{new Date(appt.date).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{appt.status}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button className="px-4 py-1 bg-blue-600 text-white rounded inline-block">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorManageRecords;
