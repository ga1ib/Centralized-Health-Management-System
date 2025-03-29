import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <header className="bg-white bg-opacity-35 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-10 px-6">
        <h1 className="text-2xl font-bold text-sky-950">Hospital Management System</h1>
        <nav>
          <ul className="flex space-x-6 text-lg items-center">
            <li><Link to="/" className="hover:text-sky-900 transition">Dashboard</Link></li>
            <li><Link to="/appointments" className="hover:text-sky-900 transition">Appointments</Link></li>
            <li><Link to="/patients" className="hover:text-sky-900 transition">Patients</Link></li>
            <li><Link to="/billing" className="hover:text-sky-900 transition">Billing</Link></li>
            <li>
              <button onClick={handleSignOut} className="px-4 py-2 text-white rounded hover:text-sky-900 transition">
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
