import React from "react";
import Header from "./header";
import Footer from "./footer";

const Reports = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
          Hospital Reports
        </h2>
        <p className="text-gray-100 text-center">
          Functionality to generate reports on hospital performance and earnings.
        </p>
        {/* Insert reports functionality here */}
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
