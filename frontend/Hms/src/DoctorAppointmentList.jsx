import React from 'react';
import Footer from './footer';
import Header from './header';

const DoctorAppointmentList = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    Appointment Dashboard
                </h2>
                {/* doctor can see his appointment from here */}
            </main>
            <Footer />
        </div>
    );
};

export default DoctorAppointmentList;