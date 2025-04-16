// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <p className="text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Centralized Hospital Management System
        </p>
        <ul className="flex space-x-6 text-sm">
          <li>
            <Link to="/privacy-policy" className="hover:text-gray-400 transition">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms-and-conditions" className="hover:text-gray-400 transition">
              Terms &amp; Conditions
            </Link>
          </li>
          <li>
            <Link to="/support" className="hover:text-gray-400 transition">
              Support
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
