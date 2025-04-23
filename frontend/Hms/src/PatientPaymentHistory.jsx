import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaSpinner, FaMoneyBill, FaCreditCard } from "react-icons/fa";
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const PatientPaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found');
                }
                const userEmail = localStorage.getItem('email');
                if (!userEmail) {
                    throw new Error('User email not found');
                }

                const response = await axios.get(`http://localhost:5000/api/billing/${userEmail}`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.data || !Array.isArray(response.data.payments)) {
                    throw new Error('Invalid response format from server');
                }

                setPayments(response.data.payments);
                setError('');
            } catch (err) {
                console.error('Payment history error:', err);
                setError(
                    err.response?.data?.error || 
                    err.message || 
                    'Failed to fetch payment history'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const getTotalAmount = () => {
        return payments.reduce((total, payment) => total + Number(payment.amount), 0);
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
                    Payment History
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <FaSpinner className="animate-spin text-white text-5xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        {error}
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
                        <FaMoneyBill className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">No payment history found.</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl mb-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-center">
                                <FaCreditCard className="text-green-500 text-2xl mr-3" />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Total Payments: ৳{getTotalAmount()}
                                </h3>
                            </div>
                        </motion.div>

                        <motion.div
                            className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Doctor</th>
                                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Amount</th>
                                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment, index) => (
                                        <motion.tr
                                            key={index}
                                            className="border-b hover:bg-gray-50"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{payment.transaction_id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{payment.doctor_name}</div>
                                                <div className="text-sm text-gray-500">{payment.doctor_email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">৳{payment.amount}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{payment.payment_date}</div>
                                                <div className="text-sm text-gray-500">{payment.payment_time}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                    ${payment.payment_status === 'paid' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {payment.payment_status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PatientPaymentHistory;