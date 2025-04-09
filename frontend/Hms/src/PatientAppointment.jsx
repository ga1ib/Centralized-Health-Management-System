import React from "react";
import Header from "./header";
import Footer from "./footer";

const PatientAppointment = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
                    Appointment Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold">Book Appointments</h3>
                        <p className="text-gray-600">Book and manage your appointments.</p>
                        <a href="/book-patient-appointment">
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Book Appointment
                            </button>
                        </a>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold">My Appointment</h3>
                        <p className="text-gray-600">View your appointments.</p>
                        <a href="/patient-view-appointment">
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                View Appointments
                            </button>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PatientAppointment;