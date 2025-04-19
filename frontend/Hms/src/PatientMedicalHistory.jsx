import React, { useEffect, useState } from 'react';
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const PatientMedicalHistory = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    // fetch medical history data from the server
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const userEmail = localStorage.getItem("email");
            const { data } = await axios.get("http://localhost:5000/api/prescriptions/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Check if user email matches with prescription data's email
            data.prescriptions.forEach(prescription => {
                if (prescription.patient_email === userEmail) {
                    setPrescriptions(prev => [...prev, prescription]);
                }
            });
            console.log(data.prescriptions);

        } catch (err) {
            console.error("Failed to load prescriptions:", err);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
                    Medical History Dashboard
                </h2>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {prescriptions.length === 0 ? (
                        <p className="text-center text-gray-600">No prescription records found.</p>
                    ) : (
                        <div className="space-y-4">
                            {prescriptions.map((prescription, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-cyan-900">
                                                Date: {new Date(prescription.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Doctor's Email:</span> {prescription.doctor_email}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">
                                                Blood Pressure:</span> {prescription.blood_pressure}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">
                                                Heat Rate:</span> {prescription.heart_rate}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">
                                                Temperature:</span> {prescription.temperature}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">
                                                Symptoms:</span> {prescription.symptoms}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">
                                                Disease:</span> {prescription.disease}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-cyan-800">Prescribed Medications:</h4>
                                            <ul className="list-disc pl-5 text-gray-700">
                                                {prescription.medicines.map((medicine, idx) => (
                                                    ((idx + 1) == prescription.medicines.length) && <li key={idx}>
                                                        {medicine.medicine} - {medicine.timetable}
                                                    </li>
                                                ))}
                                            </ul>
                                            {prescription.notes && (
                                                <p className="mt-2 text-gray-600">
                                                    <span className="font-medium">Notes:</span> {prescription.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PatientMedicalHistory;
