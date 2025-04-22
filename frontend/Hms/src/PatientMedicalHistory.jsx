import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaFileMedical, FaNotesMedical, FaUserMd } from "react-icons/fa";
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const PatientMedicalHistory = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const userEmail = localStorage.getItem("email");
            const { data } = await axios.get("http://localhost:5000/api/prescriptions/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Filter prescriptions for current user
            const userPrescriptions = data.prescriptions.filter(
                prescription => prescription.patient_email === userEmail
            );
            setPrescriptions(userPrescriptions);
        } catch (err) {
            setError("Failed to load prescriptions: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl leading-normal font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Medical History
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <FaSpinner className="animate-spin text-white text-5xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        {error}
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
                        <FaFileMedical className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">No prescription records found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {prescriptions.map((prescription, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <FaUserMd className="text-blue-500 mr-2" />
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {new Date(prescription.createdAt).toLocaleDateString()}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-gray-700 flex items-center">
                                            <span className="font-medium w-32">Doctor:</span> 
                                            {prescription.doctor_email}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="font-medium w-32">Blood Pressure:</span>
                                            {prescription.blood_pressure}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="font-medium w-32">Heart Rate:</span>
                                            {prescription.heart_rate}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="font-medium w-32">Temperature:</span>
                                            {prescription.temperature}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="font-medium w-32">Symptoms:</span>
                                            {prescription.symptoms}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="font-medium w-32">Disease:</span>
                                            {prescription.disease}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <FaNotesMedical className="text-green-500 mr-2" />
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                Prescribed Medications
                                            </h4>
                                        </div>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {prescription.medicines.map((medicine, idx) => (
                                                <li key={idx} className="text-gray-700">
                                                    {medicine.medicine} - {medicine.timetable}
                                                </li>
                                            ))}
                                        </ul>
                                        {prescription.notes && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Notes:</span> {prescription.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PatientMedicalHistory;
