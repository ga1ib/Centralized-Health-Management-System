// PatientDashboard.jsx
import React from "react";
import Header from "./header";
import Footer from "./footer";

const PatientDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
          Patient Dashboard
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">My Appointments</h3>
            <p className="text-gray-600">View and manage your appointments.</p>
            <a href="/patient-appointments">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Appointments
              </button>
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Medical Records</h3>
            <p className="text-gray-600">View your medical history and prescriptions.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Records
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Billing & Payments</h3>
            <p className="text-gray-600">Check invoices and make payments.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Manage Payments
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientDashboard;