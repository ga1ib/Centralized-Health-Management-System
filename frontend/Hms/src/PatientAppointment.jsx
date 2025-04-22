import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

const PatientAppointment = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Appointment Management
                </motion.h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                        whileHover={{ y: -5 }}
                    >
                        <h3 className="text-2xl font-bold text-cyan-900 mb-2">Book Appointments</h3>
                        <p className="text-gray-700 mb-4">Schedule new appointments with doctors</p>
                        <Link
                            to="/book-patient-appointment"
                            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition"
                        >
                            Book Now
                        </Link>
                    </motion.div>

                    <motion.div
                        className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition"
                        whileHover={{ y: -5 }}
                    >
                        <h3 className="text-2xl font-bold text-cyan-900 mb-2">My Appointments</h3>
                        <p className="text-gray-700 mb-4">View and manage your existing appointments</p>
                        <Link
                            to="/patient-view-appointment"
                            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition"
                        >
                            View All
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PatientAppointment;