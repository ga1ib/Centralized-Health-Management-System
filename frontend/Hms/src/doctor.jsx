// DoctorDashboard.jsx
import React from "react";
import Header from "./header";
import Footer from "./footer";

const DoctorDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Doctor Dashboard
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
            <p className="text-gray-600">Manage your scheduled patient visits.</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              View Schedule
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Patient Records</h3>
            <p className="text-gray-600">Access and update patient medical records.</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Manage Records
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Prescriptions</h3>
            <p className="text-gray-600">Create and update patient prescriptions.</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Manage Prescriptions
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
