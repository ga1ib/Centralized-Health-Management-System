import React from "react";
import Header from "./header";
import Footer from "./footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center" >
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
          Welcome to the Hospital Management Dashboard
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-cyan-950">Appointments</h3>
            <p className="text-gray-600 mt-2">Manage patient bookings and schedules.</p>
            <button className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2">See more...</button>
          </div>
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-cyan-950">Patient Records</h3>
            <p className="text-gray-600 mt-2">Access and update patient medical history.</p>
         <button className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2">See more...</button>
          </div>
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center">
              
            <h3 className="text-xl font-semibold text-cyan-950">Billing</h3>
            <p className="text-gray-600 mt-2">Manage hospital billing and invoices.</p>
            <button className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2">See more...</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
