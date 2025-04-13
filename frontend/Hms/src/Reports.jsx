import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

const HospitalReports = () => {
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch hospital reports from the backend.
  // Optional query parameters for date filtering can be appended if provided.
  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5000/api/reports/hospital";
      if (dateRange.start && dateRange.end) {
        url += `?start=${dateRange.start}&end=${dateRange.end}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming the endpoint returns an object: { reports: [...] }
      setReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  // For handling change in date range inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Trigger fetching when form is submitted
  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // Optionally, fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6 text-white">
        <h2 className="text-4xl p-12 font-bold text-center mb-6">Hospital Reports</h2>
        
        {error && <p className="text-red-400">{error}</p>}
        
        {/* Date Range Filter */}
        <form onSubmit={handleGenerateReport} className="mb-8 bg-white p-6 rounded shadow-lg text-black">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium">Start Date:</label>
              <input
                type="date"
                id="start"
                name="start"
                value={dateRange.start}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium">End Date:</label>
              <input
                type="date"
                id="end"
                name="end"
                value={dateRange.end}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded self-end">
              Generate Report
            </button>
          </div>
        </form>
        
        {loading ? (
          <p>Loading report...</p>
        ) : (
          <div className="bg-white text-black p-6 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Report Data</h3>
            {reports.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left">Metric</th>
                    <th className="px-6 py-3 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index}>
                      <td className="px-6 py-2">{report.metric}</td>
                      <td className="px-6 py-2">{report.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No report data available.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HospitalReports;
