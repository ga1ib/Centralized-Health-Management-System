import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaPlusCircle, FaFileMedical, FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

const DoctorAddPrescription = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const patientEmail = query.get('patient_email');
    const patientName = query.get('patient_name');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [prescription, setPrescription] = useState({
        patient_email: patientEmail,
        patient_name: patientName,
        doctor_email: localStorage.getItem('email'),
        symptoms: '',
        disease: '',
        medicines: [{ medicine: '', timetable: '' }],
        tests: [{ testName: '', price: '' }],
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        setPrescription({
            ...prescription,
            [e.target.name]: e.target.value
        });
    };

    const handleMedicineChange = (index, e) => {
        const newMedicines = [...prescription.medicines];
        newMedicines[index][e.target.name] = e.target.value;
        setPrescription({ ...prescription, medicines: newMedicines });
    };

    const handleTestChange = (index, e) => {
        const newTests = [...prescription.tests];
        newTests[index][e.target.name] = e.target.value;
        setPrescription({ ...prescription, tests: newTests });
    };

    const addMedicine = () => {
        setPrescription({
            ...prescription,
            medicines: [...prescription.medicines, { medicine: '', timetable: '' }]
        });
    };

    const removeMedicine = (index) => {
        const newMedicines = prescription.medicines.filter((_, i) => i !== index);
        setPrescription({ ...prescription, medicines: newMedicines });
    };

    const addTest = () => {
        setPrescription({
            ...prescription,
            tests: [...prescription.tests, { testName: '', price: '' }]
        });
    };

    const removeTest = (index) => {
        const newTests = prescription.tests.filter((_, i) => i !== index);
        setPrescription({ ...prescription, tests: newTests });
    };

    const calculateTotalTestCost = () => {
        return prescription.tests.reduce((total, test) => total + (Number(test.price) || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/prescriptions/', 
                { ...prescription, tests_total: calculateTotalTestCost() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/doctor-appointment-dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create prescription');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-16 px-6">
                <motion.h2
                    className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Add Prescription
                </motion.h2>

                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
                        {error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaFileMedical className="mr-2 text-blue-500" />
                                    Patient Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                                        <input
                                            type="text"
                                            name="blood_pressure"
                                            value={prescription.blood_pressure}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="120/80 mmHg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                                        <input
                                            type="text"
                                            name="heart_rate"
                                            value={prescription.heart_rate}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="72 bpm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                                        <input
                                            type="text"
                                            name="temperature"
                                            value={prescription.temperature}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="98.6 °F"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                                        <textarea
                                            name="symptoms"
                                            value={prescription.symptoms}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="3"
                                            placeholder="Patient symptoms"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
                                        <input
                                            type="text"
                                            name="disease"
                                            value={prescription.disease}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Diagnosed disease"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <FaFileMedical className="mr-2 text-green-500" />
                                            Prescribed Medicines
                                        </span>
                                        <button
                                            type="button"
                                            onClick={addMedicine}
                                            className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <FaPlusCircle className="mr-1" /> Add Medicine
                                        </button>
                                    </h3>
                                    {prescription.medicines.map((medicine, index) => (
                                        <div key={index} className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                name="medicine"
                                                value={medicine.medicine}
                                                onChange={(e) => handleMedicineChange(index, e)}
                                                placeholder="Medicine name"
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                name="timetable"
                                                value={medicine.timetable}
                                                onChange={(e) => handleMedicineChange(index, e)}
                                                placeholder="Schedule"
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedicine(index)}
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <FaFileMedical className="mr-2 text-yellow-500" />
                                            Recommended Tests
                                        </span>
                                        <button
                                            type="button"
                                            onClick={addTest}
                                            className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <FaPlusCircle className="mr-1" /> Add Test
                                        </button>
                                    </h3>
                                    {prescription.tests.map((test, index) => (
                                        <div key={index} className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                name="testName"
                                                value={test.testName}
                                                onChange={(e) => handleTestChange(index, e)}
                                                placeholder="Test name"
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="number"
                                                name="price"
                                                value={test.price}
                                                onChange={(e) => handleTestChange(index, e)}
                                                placeholder="Price"
                                                className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTest(index)}
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {prescription.tests.length > 0 && (
                                        <div className="mt-2 text-right">
                                            <span className="font-semibold text-gray-700">
                                                Total Test Cost: ৳{calculateTotalTestCost()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                    <textarea
                                        name="notes"
                                        value={prescription.notes}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="Any additional notes..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Prescription'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default DoctorAddPrescription;