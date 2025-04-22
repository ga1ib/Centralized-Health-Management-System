import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaUpload, FaFile } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

const UploadReport = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [report, setReport] = useState({
        patient_email: localStorage.getItem('email'),
        service: '',
        amount: '',
        file: null
    });
    const [fileName, setFileName] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReport(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReport(prev => ({
                ...prev,
                file: file
            }));
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('patient_email', report.patient_email);
            formData.append('service', report.service);
            formData.append('amount', report.amount);
            formData.append('report', report.file);

            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/reports/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Report uploaded successfully!');
            setTimeout(() => {
                navigate('/patient-medical-history');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload report');
        } finally {
            setLoading(false);
        }
    };

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
                    Upload Medical Report
                </motion.h2>

                <motion.div
                    className="max-w-xl mx-auto"
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
                        {success && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                {success}
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                            <input
                                type="text"
                                name="service"
                                value={report.service}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Blood Test, X-Ray, etc."
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (BDT)</label>
                            <input
                                type="number"
                                name="amount"
                                value={report.amount}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Report</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                required
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                                    {fileName && (
                                        <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
                                            <FaFile className="mr-2" />
                                            {fileName}
                                        </div>
                                    )}
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
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload Report'
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

export default UploadReport;