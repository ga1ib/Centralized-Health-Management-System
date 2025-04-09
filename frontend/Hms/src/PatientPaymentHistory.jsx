import React from 'react';
import Header from './header';
import Footer from './footer';

const PatientPaymentHistory = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-02.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-cyan-950 mb-6">
                    Payment History Dashboard
                </h2>
            </main>
            <Footer />
        </div>
    );
};

export default PatientPaymentHistory;