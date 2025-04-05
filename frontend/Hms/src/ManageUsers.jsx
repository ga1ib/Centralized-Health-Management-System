import React from "react";
import Header from "./header";
import Footer from "./footer";

const ManageUsers = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
          Manage Users
        </h2>
        <p className="text-gray-100 text-center">
          Functionality to add, remove, and update doctors, patients, and staff.
        </p>
        {/* Insert additional manage users functionality here */}
      </main>
      <Footer />
    </div>
  );
};

export default ManageUsers;
