// ManageUsers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaUserPlus, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "", name: "" });
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing. Please log in.");
      const { data } = await axios.get("http://localhost:5000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInputChange = e => setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRoleFilterChange = e => setRoleFilter(e.target.value);

  const handleAddUser = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ email: "", password: "", role: "", name: "" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add user");
    }
  };

  const handleUpdateUser = async email => {
    const newEmail = prompt("Enter new email:", email);
    if (!newEmail) return;
    const updateData = { email: newEmail };
    const newName = prompt("Enter new name (leave blank to keep unchanged):", "");
    if (newName) updateData.name = newName;
    const newRole = prompt("Enter new role (leave blank to keep unchanged):", "");
    if (newRole) updateData.role = newRole;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${email}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  };

  const handleDeleteUser = async email => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    }
  };

  const filteredUsers = roleFilter
    ? users.filter(u => u.role?.toLowerCase().includes(roleFilter.toLowerCase()))
    : users;

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-6">
        <motion.h2
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >Manage Users</motion.h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-white text-5xl" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center bg-white/30 backdrop-blur-lg rounded-full px-4 py-2">
                <FaFilter className="text-white mr-2" />
                <input
                  type="text"
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  placeholder="Filter by role..."
                  className="bg-transparent placeholder-white text-black focus:outline-none"
                />
              </div>
              <button
                onClick={() => document.getElementById('addUserForm').scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center bg-gradient-to-r from-teal-500 to-purple-400 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transform transition"
              >
                <FaUserPlus className="mr-2" /> Add New User
              </button>
            </div>

            <div className="overflow-x-auto bg-white/50 backdrop-blur-lg rounded-lg shadow-lg">
              <table className="min-w-full">
                <thead className="bg-white/70">
                  <tr>
                    <th className="px-6 py-3 text-left text-indigo-800">Name</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Email</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Role</th>
                    <th className="px-6 py-3 text-left text-indigo-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <motion.tr key={u.email} className="border-b hover:bg-white/40" whileHover={{ scale: 1.02 }}>
                      <td className="px-6 py-3 text-black">{u.name || '-'}</td>
                      <td className="px-6 py-3 text-black">{u.email}</td>
                      <td className="px-6 py-3 text-black">{u.role || '-'}</td>
                      <td className="px-6 py-3 flex gap-2">
                        <button onClick={() => handleUpdateUser(u.email)} className="p-2 bg-yellow-400 rounded-full shadow hover:bg-yellow-500 transition">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteUser(u.email)} className="p-2 bg-red-600 rounded-full shadow hover:bg-red-700 transition">
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              id="addUserForm"
              className="mt-12 bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-xl mx-auto"
            >
              <h3 className="text-3xl font-bold text-indigo-600 mb-6">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-indigo-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-indigo-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-indigo-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-indigo-700">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition"
                >Create User</button>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageUsers;