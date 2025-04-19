import React, { useEffect, useState } from 'react';
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
                // Fetch prescriptions (doctor-patient common email)
                const res = await axios.get(`http://localhost:5000/api/prescriptions?patient_email=${encodeURIComponent(patientEmail)}&doctor_email=${encodeURIComponent(doctorEmail)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data.prescriptions || []);
                // Fetch reports (doctor-patient common email)
                const rep = await axios.get(`http://localhost:5000/api/reports/doctor-patient-history?patient_email=${encodeURIComponent(patientEmail)}&doctor_email=${encodeURIComponent(doctorEmail)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(rep.data.reports || []);
            } catch (err) {
                setError('Failed to fetch history. Please check that both patient and doctor emails are present in the prescription and report records.');
            } finally {
                setLoading(false);
            }
        };
        if (patientEmail && doctorEmail) fetchHistory();
    }, [patientEmail, doctorEmail]);

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    Patient Prescription & Test History
                </h2>
                {loading && <p>Loading history...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && history.length === 0 && reports.length === 0 && (
                    <p className="text-center text-gray-700">No history found for this patient.</p>
                )}
                {/* Prescriptions Table */}
                {!loading && history.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4 mb-8">
                        <h3 className="text-xl font-bold mb-2">Prescriptions</h3>
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-2 py-1">Date</th>
                                    <th className="px-2 py-1">Symptoms</th>
                                    <th className="px-2 py-1">Disease</th>
                                    <th className="px-2 py-1">Medicines</th>
                                    <th className="px-2 py-1">Tests</th>
                                    <th className="px-2 py-1">Total Test Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-2 py-1">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</td>
                                        <td className="px-2 py-1">{item.symptoms}</td>
                                        <td className="px-2 py-1">{item.disease}</td>
                                        <td className="px-2 py-1">
                                            <ul className="list-disc ml-4">
                                                {(item.medicines || []).map((med, i) => (
                                                    <li key={i}>{med.medicine} ({med.timetable})</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-2 py-1">
                                            <ul className="list-disc ml-4">
                                                {(item.tests || []).map((test, i) => (
                                                    <li key={i}>{test.testName} - {test.price} BDT</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-2 py-1 font-bold">{item.tests_total || 0} BDT</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Reports Table */}
                {!loading && reports.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
                        <h3 className="text-xl font-bold mb-2">Reports</h3>
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-2 py-1">Upload Date</th>
                                    <th className="px-2 py-1">Patient Name</th>
                                    <th className="px-2 py-1">Service</th>
                                    <th className="px-2 py-1">Amount</th>
                                    <th className="px-2 py-1">Status</th>
                                    <th className="px-2 py-1">File</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((rep, idx) => (
                                    <tr key={idx}>
                                        <td className="px-2 py-1">{rep.upload_date ? new Date(rep.upload_date).toLocaleString() : ''}</td>
                                        <td className="px-2 py-1">{rep.patient_name}</td>
                                        <td className="px-2 py-1">{rep.service}</td>
                                        <td className="px-2 py-1">{rep.amount} BDT</td>
                                        <td className="px-2 py-1">{rep.status}</td>
                                        <td className="px-2 py-1">
                                            {rep.filename ? (
                                                <a href={`http://localhost:5000/uploads/reports/${rep.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                                            ) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DoctorPatientHistory;
