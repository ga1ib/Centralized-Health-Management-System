import React from 'react';
import Footer from './footer';
import Header from './header';

const BillingHistory = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
                    Billing History
                </h2>
                {/* admin can see all the payment history */}
            </main>
            <Footer />
        </div>
    );
};

export default BillingHistory;