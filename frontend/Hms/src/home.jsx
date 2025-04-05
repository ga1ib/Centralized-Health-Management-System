import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
          Admin Dashboard
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Manage Users */}
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-cyan-950">Manage Users</h3>
            <p className="text-gray-600 mt-2">
              Add, remove, and update doctors, patients, and staff.
            </p>
            <Link
              to="/manage-users"
              className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
            >
              See more...
            </Link>
          </div>
          {/* Track Appointments */}
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-cyan-950">Appointments</h3>
            <p className="text-gray-600 mt-2">
              Monitor and manage hospital appointments.
            </p>
            <Link
              to="/appointments"
              className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
            >
              See more...
            </Link>
          </div>
          {/* Hospital Reports */}
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-cyan-950">Hospital Reports</h3>
            <p className="text-gray-600 mt-2">
              Generate reports on hospital performance and earnings.
            </p>
            <Link
              to="/reports"
              className="mt-4 px-4 py-2 text-black rounded hover:underline hover:underline-offset-2"
            >
              See more...
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
