import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaHistory, FaNotesMedical, FaFileAlt } from "react-icons/fa";
import Header from './header';
import Footer from './footer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const DoctorPatientHistory = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const patientEmail = query.get('patient_email') || '';
    const doctorEmail = localStorage.getItem('email');
    const [history, setHistory] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch prescriptions
                const res = await axios.get(`http://localhost:5000/api/prescriptions?patient_email=${encodeURIComponent(patientEmail)}&doctor_email=${encodeURIComponent(doctorEmail)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data.prescriptions || []);

                // Fetch reports
                const reportsRes = await axios.get(`http://localhost:5000/api/reports/${patientEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(reportsRes.data.reports || []);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch patient history');
            } finally {
                setLoading(false);
            }
        };

        if (patientEmail) {
            fetchHistory();
        }
    }, [patientEmail, doctorEmail]);

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl leading-normal font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Patient History
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <FaSpinner className="animate-spin text-white text-5xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        {error}
                    </div>
                ) : history.length === 0 && reports.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
                        <FaHistory className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">No history found for this patient.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Prescriptions Section */}
                        {history.length > 0 && (
                            <motion.div
                                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center mb-6">
                                    <FaNotesMedical className="text-blue-500 text-2xl mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-800">Prescriptions</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Date</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Symptoms</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Disease</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Medicines</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Tests</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((item, idx) => (
                                                <motion.tr 
                                                    key={idx}
                                                    className="border-b hover:bg-gray-50"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                >
                                                    <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3">{item.symptoms}</td>
                                                    <td className="px-4 py-3">{item.disease}</td>
                                                    <td className="px-4 py-3">
                                                        <ul className="list-disc pl-4">
                                                            {item.medicines?.map((med, i) => (
                                                                <li key={i}>{med.medicine} - {med.timetable}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <ul className="list-disc pl-4">
                                                            {item.tests?.map((test, i) => (
                                                                <li key={i}>{test.testName} ({test.price} BDT)</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold">{item.tests_total || 0} BDT</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* Reports Section */}
                        {reports.length > 0 && (
                            <motion.div
                                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="flex items-center mb-6">
                                    <FaFileAlt className="text-green-500 text-2xl mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-800">Reports</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Upload Date</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Service</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Amount</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">File</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((rep, idx) => (
                                                <motion.tr
                                                    key={idx}
                                                    className="border-b hover:bg-gray-50"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                >
                                                    <td className="px-4 py-3">
                                                        {rep.upload_date ? new Date(rep.upload_date).toLocaleString() : ''}
                                                    </td>
                                                    <td className="px-4 py-3">{rep.service}</td>
                                                    <td className="px-4 py-3">{rep.amount} BDT</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                            ${rep.status?.toLowerCase() === 'completed' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {rep.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {rep.filename ? (
                                                            <a 
                                                                href={`http://localhost:5000/uploads/reports/${rep.filename}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 underline"
                                                            >
                                                                View
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DoctorPatientHistory;
