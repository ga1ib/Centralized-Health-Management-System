import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

const BookPatientAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: '',
    date: '',
    time: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/users/doctors')
      .then(res => {
        const responseDoctors = Array.isArray(res.data) ? res.data : res.data.doctors || [];
        setDoctors(responseDoctors);
      })
      .catch(err => {
        console.error('Failed to load doctors:', err);
        setDoctors([]);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientId = localStorage.getItem("userId");
    if (!patientId) {
      setMessage("Please log in to book an appointment.");
      return;
    }

    try {
      const res = await axios.post('/api/appointments/book', {
        patientId,
        ...form,
      });

      setMessage('Appointment booked successfully!');
      setForm({ doctorId: '', date: '', time: '' });
    } catch (err) {
      console.error(err);
      setMessage('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6 rounded shadow-md">
        <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
          Book Your Appointment
        </h2>

        {message && (
          <p className="text-center text-sm text-red-700 font-semibold mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="doctorId" className="block font-bold mb-2">Select Doctor</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Choose a doctor --</option>
              {Array.isArray(doctors) && doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block font-bold mb-2">Appointment Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="time" className="block font-bold mb-2">Time Slot</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="bg-cyan-800 text-white px-6 py-2 rounded hover:bg-cyan-700">
              Book Appointment
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BookPatientAppointment;
