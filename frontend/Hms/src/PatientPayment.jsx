import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaCreditCard, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

const PatientPayment = () => {
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        amount: '500'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const storedAppointmentData = localStorage.getItem('appointmentData');
            if (!storedAppointmentData) {
                navigate('/book-patient-appointment');
                return;
            }

            const parsedAppointmentData = JSON.parse(storedAppointmentData);
            const token = localStorage.getItem("token");

            // Process payment
            const paymentResponse = await axios.post('http://localhost:5000/api/payments/process', {
                ...paymentDetails,
                patient_email: parsedAppointmentData.patient_email,
                doctor_email: parsedAppointmentData.doctor_email,
                doctor_name: parsedAppointmentData.doctor_name
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Create appointment
            const appointmentData = {
                patient_email: parsedAppointmentData.patient_email,
                patient_name: parsedAppointmentData.patient_name,
                doctor_email: parsedAppointmentData.doctor_email,
                doctor_name: parsedAppointmentData.doctor_name,
                date: parsedAppointmentData.appointment_date,
                time: parsedAppointmentData.appointment_time,
                status: "Scheduled",
                payment_id: paymentResponse.data.transaction_id
            };

            await axios.post('http://localhost:5000/api/appointments/', appointmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem('appointmentData');
            navigate('/patient-payment-history');
        } catch (err) {
            setError(err.response?.data?.error || 'Payment and appointment booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    Payment Processing
                </motion.h2>

                <motion.div
                    className="max-w-md mx-auto"
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

                        <div className="mb-6">
                            <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
                                <FaCreditCard className="mr-2" />
                                Amount (BDT)
                            </label>
                            <input
                                type="text"
                                value={paymentDetails.amount}
                                disabled
                                className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-50"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
                                <FaCreditCard className="mr-2" />
                                Card Number
                            </label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                maxLength="16"
                                pattern="[0-9]{16}"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
                                <FaCreditCard className="mr-2" />
                                Card Holder Name
                            </label>
                            <input
                                type="text"
                                name="cardHolder"
                                value={paymentDetails.cardHolder}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
                                    <FaCreditCard className="mr-2" />
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={paymentDetails.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    maxLength="5"
                                    pattern="[0-9]{2}/[0-9]{2}"
                                />
                            </div>
                            <div>
                                <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
                                    <FaLock className="mr-2" />
                                    CVV
                                </label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={paymentDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    maxLength="3"
                                    pattern="[0-9]{3}"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                'Pay Now'
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 flex items-center justify-center">
                                <FaLock className="mr-2" />
                                This is a secure SSL encrypted payment
                            </p>
                        </div>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PatientPayment;