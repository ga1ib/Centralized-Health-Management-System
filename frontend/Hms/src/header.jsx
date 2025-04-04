import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <header className="bg-white bg-opacity-35 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-sky-950">Hospital Management System</h1>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-sky-950 hover:text-sky-900 focus:outline-none"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.3 5.71a1 1 0 00-1.42-1.42L12 9.17 7.12 4.29A1 1 0 105.7 5.71L10.59 10.6 5.71 15.49a1 1 0 101.42 1.42L12 12.83l4.88 4.88a1 1 0 001.42-1.42L13.41 10.6l4.89-4.89z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Navigation Menu */}
        <nav className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 text-lg items-center text-[#606975]">
            <li className="py-2 md:py-0">
              <Link to="/" className="block hover:text-sky-900 transition">
                Dashboard
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link to="/appointments" className="block hover:text-sky-900 transition">
                Appointments
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link to="/patients" className="block hover:text-sky-900 transition">
                Patients
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link to="/billing" className="block hover:text-sky-900 transition">
                Billing
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded hover:text-sky-900 transition"
              >
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
