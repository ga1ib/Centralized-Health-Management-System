import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DoctorViewPrescriptions = () => {
  const query = useQuery();
  const patientEmail = query.get("patient_email");
  const patientName = query.get("patient_name");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const doctorEmail = localStorage.getItem("email");
        const response = await axios.get("http://localhost:5000/api/prescriptions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter prescriptions for this doctor and patient
        const filtered = (response.data.prescriptions || []).filter(
          p =>
            p.doctor_email === doctorEmail &&
            p.patient_email === patientEmail
        );
        setPrescriptions(filtered);
      } catch (err) {
        setError("Failed to fetch prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientEmail]);

  return (
    <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Prescriptions for {patientName || patientEmail}
        </h2>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : prescriptions.length === 0 ? (
          <div className="text-white">No prescriptions found.</div>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((presc, index) => (
                <tr key={presc._id || presc.id || index}>
                  <td className="py-2 px-4 border-b">{presc.date ? new Date(presc.date).toLocaleString() : (presc.createdAt ? new Date(presc.createdAt).toLocaleString() : "-")}</td>
                  <td className="py-2 px-4 border-b">
                    <ul className="list-disc pl-4 text-left">
                      {presc.patient_name && <li><b>Patient Name:</b> {presc.patient_name}</li>}
                      {presc.patient_email && <li><b>Patient Email:</b> {presc.patient_email}</li>}
                      {presc.doctor_email && <li><b>Doctor Email:</b> {presc.doctor_email}</li>}
                      {presc.bloodPressure && <li><b>Blood Pressure:</b> {presc.bloodPressure}</li>}
                      {presc.heartRate && <li><b>Heart Rate:</b> {presc.heartRate}</li>}
                      {presc.temperature && <li><b>Temperature:</b> {presc.temperature}</li>}
                      {presc.symptoms && <li><b>Symptoms:</b> {presc.symptoms}</li>}
                      {presc.disease && <li><b>Disease Name:</b> {presc.disease}</li>}
                      {Array.isArray(presc.medicines) && presc.medicines.length > 0 && (
                        <li>
                          <b>Medicine:</b>
                          <ul className="list-disc pl-4">
                            {presc.medicines.map((med, i) => (
                              <li key={i}>
                                {med.medicine} {med.timetable && `- ${med.timetable}`}
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                      {Array.isArray(presc.tests) && presc.tests.length > 0 && (
                        <li>
                          <b>Tests:</b>
                          <ul className="list-disc pl-4">
                            {presc.tests.map((test, i) => (
                              <li key={i}>
                                {test.testName} {test.price ? `- ${test.price} BDT` : ""}
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                      {presc.tests_total && <li><b>Total Test Amount:</b> {presc.tests_total} BDT</li>}
                      {presc.notes && <li><b>Notes:</b> {presc.notes}</li>}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorViewPrescriptions;
