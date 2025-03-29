import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} Centralized Hospital Management System</p>
        <ul className="flex space-x-6 text-sm">
          <li><Link to="/privacy Policy" className="hover:text-gray-400 transition">Privacy Policy</Link></li>
          <li><Link to="/terms & condition" className="hover:text-gray-400 transition">Terms & Conditions</Link></li>
          <li><Link to="/" className="hover:text-gray-400 transition">Support</Link></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
