import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patient_email: "",
    doctor_email: "",
    date: "",
    time: "",
    status: "Scheduled",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch appointments from the backend
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Handle input changes for appointment form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new appointment (POST)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/appointments/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        patient_email: "",
        doctor_email: "",
        date: "",
        time: "",
        status: "Scheduled",
      });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create appointment.");
    }
  };

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
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6 text-white">
        <h2 className="text-4xl p-12 font-bold text-center mb-6">Appointments</h2>
        {loading && <p>Loading appointments...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Appointments Table */}
        <div className="overflow-x-auto bg-white rounded-lg mt-8 text-black">
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

        {/* Add New Appointment Form */}
        <div className="mt-10 bg-white p-6 rounded shadow-lg text-black">
          <h3 className="text-xl font-bold mb-4">Add New Appointment</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              type="email"
              name="patient_email"
              value={form.patient_email}
              onChange={handleInputChange}
              required
              placeholder="Patient Email"
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="doctor_email"
              value={form.doctor_email}
              onChange={handleInputChange}
              required
              placeholder="Doctor Email"
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleInputChange}
              required
              className="w-full border p-2 rounded"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Appointment
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
