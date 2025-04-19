//BillingHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import { FaSpinner } from 'react-icons/fa';

const BillingHistory = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/billing/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBillings(res.data.payments || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load billing history.');
      } finally {
        setLoading(false);
      }
    };
    fetchBillings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      {/* Header */}
      <Header />

      {/* Hero Card */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto bg-black bg-opacity-50 backdrop-blur-md rounded-2xl p-12 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">Billing History</h1>
          <p className="text-lg text-gray-200">
            Overview of all patient payments and transactions.
          </p>
        </div>
      </section>

      {/* Main Table */}
      <main className="flex-grow container mx-auto px-6 pb-12">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : billings.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No billing records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-500 sticky top-0">
                  <tr>
                    {['Patient', 'Doctor', 'Amount', 'Card', 'Date', 'Time', 'Status', 'Txn ID'].map(col => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-white text-sm font-medium uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billings.map((b, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800">{b.patient_name}</td>
                      <td className="px-6 py-4 text-gray-800">{b.doctor_name}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">${b.amount}</td>
                      <td className="px-6 py-4 text-gray-600">{b.card_number}</td>
                      <td className="px-6 py-4 text-gray-800">{b.payment_date}</td>
                      <td className="px-6 py-4 text-gray-800">{b.payment_time}</td>
                      <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                          b.payment_status?.trim().toLowerCase() === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.payment_status}
                      </span>


                      </td>
                      <td className="px-6 py-4 text-gray-800">{b.transaction_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BillingHistory;
