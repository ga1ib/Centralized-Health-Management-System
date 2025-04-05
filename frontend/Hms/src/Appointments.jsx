import React from "react";
import Header from "./header";
import Footer from "./footer";

const Appointments = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
          Appointments
        </h2>
        <p className="text-gray-100 text-center">
          Functionality to monitor and manage hospital appointments.
        </p>
        {/* Insert appointments functionality here */}
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
