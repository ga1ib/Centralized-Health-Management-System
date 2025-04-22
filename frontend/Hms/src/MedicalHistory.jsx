import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaFileMedical, FaNotesMedical, FaUserMd, FaFileAlt, FaEye } from "react-icons/fa";
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const MedicalHistory = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("prescriptions");

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const userEmail = localStorage.getItem("email");

                // Fetch prescriptions
                const prescriptionsRes = await axios.get("http://localhost:5000/api/prescriptions/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userPrescriptions = prescriptionsRes.data.prescriptions.filter(
                    prescription => prescription.patient_email === userEmail
                );
                setPrescriptions(userPrescriptions);

                // Fetch reports
                const reportsRes = await axios.get(`http://localhost:5000/api/reports/${userEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(reportsRes.data.reports || []);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load medical history");
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalHistory();
    }, []);

    const handleViewFile = (filename) => {
        window.open(`http://localhost:5000/uploads/reports/${filename}`, '_blank');
    };

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
                ) : prescriptions.length === 0 && reports.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
                        <FaFileMedical className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">No medical records found.</p>
                    </div>
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white/90 backdrop-blur-lg rounded-full p-1 inline-flex">
                                <button
                                    onClick={() => setActiveTab("prescriptions")}
                                    className={`px-6 py-2 rounded-full transition ${
                                        activeTab === "prescriptions"
                                            ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <FaNotesMedical className="inline mr-2" />
                                    Prescriptions
                                </button>
                                <button
                                    onClick={() => setActiveTab("reports")}
                                    className={`px-6 py-2 rounded-full transition ${
                                        activeTab === "reports"
                                            ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <FaFileAlt className="inline mr-2" />
                                    Medical Reports
                                </button>
                            </div>
                        </div>

                        {/* Prescriptions Tab */}
                        {activeTab === "prescriptions" && (
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
                                                
                                                <div className="space-y-3">
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Doctor:</span> 
                                                        {prescription.doctor_email}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Blood Pressure:</span>
                                                        {prescription.blood_pressure}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Heart Rate:</span>
                                                        {prescription.heart_rate}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Temperature:</span>
                                                        {prescription.temperature}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Symptoms:</span>
                                                        {prescription.symptoms}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Disease:</span>
                                                        {prescription.disease}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="mb-6">
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
                                                </div>

                                                {prescription.tests && prescription.tests.length > 0 && (
                                                    <div className="mb-6">
                                                        <div className="flex items-center mb-4">
                                                            <FaFileMedical className="text-blue-500 mr-2" />
                                                            <h4 className="text-lg font-semibold text-gray-800">
                                                                Recommended Tests
                                                            </h4>
                                                        </div>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            {prescription.tests.map((test, idx) => (
                                                                <li key={idx} className="text-gray-700">
                                                                    {test.testName} - {test.price} BDT
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {prescription.tests_total && (
                                                            <p className="mt-4 text-gray-800 font-semibold">
                                                                Total Test Cost: {prescription.tests_total} BDT
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {prescription.notes && (
                                                    <div className="p-3 bg-blue-50 rounded-lg">
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

                        {/* Reports Tab */}
                        {activeTab === "reports" && (
                            <motion.div
                                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Date</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Service</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Amount</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report, idx) => (
                                                <motion.tr
                                                    key={idx}
                                                    className="border-b hover:bg-gray-50"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                >
                                                    <td className="px-4 py-3">
                                                        {report.upload_date ? new Date(report.upload_date).toLocaleString() : ''}
                                                    </td>
                                                    <td className="px-4 py-3">{report.service}</td>
                                                    <td className="px-4 py-3">{report.amount} BDT</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                            ${report.status?.toLowerCase() === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {report.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {report.filename && (
                                                            <button
                                                                onClick={() => handleViewFile(report.filename)}
                                                                className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
                                                            >
                                                                <FaEye className="mr-2" />
                                                                View
                                                            </button>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MedicalHistory;