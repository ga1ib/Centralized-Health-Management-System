import React, { useState } from 'react';
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
        amount: '500' // Fixed amount for appointment
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
            const token = localStorage.getItem('token');

            // Process payment first through the payment strategy
            const paymentData = {
                patient_email: parsedAppointmentData.patient_email,
                patient_name: parsedAppointmentData.patient_name,
                doctor_email: parsedAppointmentData.doctor_email,
                doctor_name: parsedAppointmentData.doctor_name,
                amount: paymentDetails.amount,
                card_number: paymentDetails.cardNumber,
                card_holder: paymentDetails.cardHolder,
                expiry_date: paymentDetails.expiryDate,
                schedule_date: parsedAppointmentData.appointment_date,
                schedule_time: parsedAppointmentData.appointment_time
            };

            // Process payment
            const paymentResponse = await axios.post(
                'http://localhost:5000/api/billing/',
                paymentData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // If payment successful, create appointment
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
            alert('Appointment booked and payment processed successfully!');
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
            <main className="flex-grow container mx-auto py-10 px-6">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Payment Details
                    </h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Amount (BDT)
                            </label>
                            <input
                                type="text"
                                value={paymentDetails.amount}
                                disabled
                                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Card Number
                            </label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                maxLength="16"
                                pattern="[0-9]{16}"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Card Holder Name
                            </label>
                            <input
                                type="text"
                                name="cardHolder"
                                value={paymentDetails.cardHolder}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={paymentDetails.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    maxLength="5"
                                    pattern="[0-9]{2}/[0-9]{2}"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    CVV
                                </label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={paymentDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    maxLength="3"
                                    pattern="[0-9]{3}"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-3 rounded-md font-semibold hover:bg-teal-700 transition disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Pay Now'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>This is a secure SSL encrypted payment</p>
                        <p className="mt-2">Your card details are protected</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PatientPayment;