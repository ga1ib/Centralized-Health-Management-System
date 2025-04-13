import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "" });
  const [roleFilter, setRoleFilter] = useState(""); // for filtering users by role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET: Fetch all users from the database via the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:5000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes for adding a user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // For filtering users by role
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  // POST: Add a new user using the registration endpoint
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ email: "", password: "", role: "" });
      fetchUsers(); // Refresh the user list after adding
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add user");
    }
  };

  // PUT: Update an existing user (using the current email as the identifier)
  const handleUpdateUser = async (currentEmail) => {
    const newEmail = prompt("Enter new email:", currentEmail);
    if (newEmail === null) return; // Cancelled
    const newPassword = prompt("Enter new password (leave blank to keep unchanged):", "");
    const newRole = prompt("Enter new role (leave blank to keep unchanged):", "");
    const updateData = { email: newEmail };
    if (newPassword) {
      updateData.password = newPassword;
    }
    if (newRole) {
      updateData.role = newRole;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${currentEmail}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh after update
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  };

  // DELETE: Delete a user by email
  const handleDeleteUser = async (userEmail) => {
    if (!window.confirm(`Are you sure you want to delete ${userEmail}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh after deletion
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    }
  };

  // Filter users by the role field if roleFilter is not empty
  const filteredUsers = roleFilter 
    ? users.filter(user => user.role && user.role.toLowerCase().includes(roleFilter.toLowerCase()))
    : users;

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-4xl p-12 font-bold text-zinc-50 text-center mb-6">
          Manage Users
        </h2>
        <p className="text-gray-100 text-center">
          Functionality to add, update, and delete doctors, patients, and staff.
        </p>
        
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Role Filter */}
        <div className="mb-6">
          <label htmlFor="roleFilter" className="mr-2 text-gray-200">
            Filter by Role:
          </label>
          <input
            type="text"
            id="roleFilter"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            placeholder="Type a role..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg mt-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.role || "-"}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleUpdateUser(user.email)}
                      className="px-3 py-2 bg-yellow-400 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="px-3 py-2 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New User Form */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role:
              </label>
              <input
                type="text"
                name="role"
                id="role"
                value={newUser.role}
                onChange={handleInputChange}
                placeholder="e.g., doctor, patient, staff"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add User
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageUsers;
