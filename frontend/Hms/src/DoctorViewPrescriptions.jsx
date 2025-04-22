import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaNotesMedical, FaUserMd, FaFileMedical } from "react-icons/fa";
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
      <main className="flex-grow container mx-auto py-16 px-6">
        <motion.h2
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-500 text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Patient Prescriptions
        </motion.h2>

        <motion.div
          className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center">
            <FaUserMd className="text-blue-500 text-2xl mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              {patientName || patientEmail}
            </h3>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-white text-5xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center">
            <FaNotesMedical className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No prescriptions found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((presc, index) => (
              <motion.div
                key={presc._id || index}
                className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <FaFileMedical className="text-blue-500 text-xl mr-2" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    {presc.date ? new Date(presc.date).toLocaleDateString() : 
                     presc.createdAt ? new Date(presc.createdAt).toLocaleDateString() : "-"}
                  </h4>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Patient Information</h5>
                    <ul className="space-y-2">
                      {presc.bloodPressure && (
                        <li className="text-gray-600">
                          <span className="font-medium">Blood Pressure:</span> {presc.bloodPressure}
                        </li>
                      )}
                      {presc.heartRate && (
                        <li className="text-gray-600">
                          <span className="font-medium">Heart Rate:</span> {presc.heartRate}
                        </li>
                      )}
                      {presc.temperature && (
                        <li className="text-gray-600">
                          <span className="font-medium">Temperature:</span> {presc.temperature}
                        </li>
                      )}
                      {presc.symptoms && (
                        <li className="text-gray-600">
                          <span className="font-medium">Symptoms:</span> {presc.symptoms}
                        </li>
                      )}
                      {presc.disease && (
                        <li className="text-gray-600">
                          <span className="font-medium">Disease:</span> {presc.disease}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <div className="space-y-4">
                      {Array.isArray(presc.medicines) && presc.medicines.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Prescribed Medicines</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {presc.medicines.map((med, i) => (
                              <li key={i} className="text-gray-600">
                                {med.medicine} {med.timetable && `- ${med.timetable}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(presc.tests) && presc.tests.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Recommended Tests</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {presc.tests.map((test, i) => (
                              <li key={i} className="text-gray-600">
                                {test.testName} {test.price ? `- ${test.price} BDT` : ""}
                              </li>
                            ))}
                          </ul>
                          {presc.tests_total && (
                            <p className="mt-2 text-gray-800 font-semibold">
                              Total Test Cost: {presc.tests_total} BDT
                            </p>
                          )}
                        </div>
                      )}

                      {presc.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-gray-700 mb-2">Additional Notes</h5>
                          <p className="text-gray-600">{presc.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorViewPrescriptions;
