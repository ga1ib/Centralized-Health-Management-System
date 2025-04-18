import React, { useState } from 'react';
import Header from './header';
import Footer from './footer';
import { prescriptionFactory } from './PrescriptionFactory';

const AddPrescription = () => {
    // Form state
    const [form, setForm] = useState({
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        symptoms: '',
        disease: '',
    });
    // Medicine table state
    const [medicines, setMedicines] = useState([
        { medicine: '', timetable: '' }
    ]);

    // Handle form field change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle medicine table change
    const handleMedicineChange = (index, field, value) => {
        setMedicines((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    // Add new medicine row
    const addMedicineRow = () => {
        setMedicines((prev) => [...prev, { medicine: '', timetable: '' }]);
    };

    // Remove medicine row
    const removeMedicineRow = (index) => {
        setMedicines((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== index));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Prepare prescription data
            const prescriptionData = {
                bloodPressure: form.bloodPressure,
                heartRate: form.heartRate,
                temperature: form.temperature,
                symptoms: form.symptoms,
                disease: form.disease,
                medicines: medicines,
                doctor_email: localStorage.getItem('email'), // assuming doctor is logged in
                createdAt: new Date().toISOString()
            };
            // Send to backend
            await fetch('http://localhost:5000/api/prescriptions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(prescriptionData)
            });
            // Refresh the page
            window.location.reload();
        } catch (err) {
            alert('Failed to save prescription.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('../image/bg-01.jpg')] bg-fixed bg-cover bg-center">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    Prescription Dashboard
                </h2>
                <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {prescriptionFactory.createInputField({
                            label: 'Blood Pressure',
                            name: 'bloodPressure',
                            value: form.bloodPressure,
                            onChange: handleFormChange,
                            placeholder: 'e.g. 120/80',
                        })}
                        {prescriptionFactory.createInputField({
                            label: 'Heart Rate',
                            name: 'heartRate',
                            value: form.heartRate,
                            onChange: handleFormChange,
                            placeholder: 'e.g. 72',
                        })}
                        {prescriptionFactory.createInputField({
                            label: 'Temperature',
                            name: 'temperature',
                            value: form.temperature,
                            onChange: handleFormChange,
                            placeholder: 'e.g. 98.6',
                        })}
                    </div>
                    {prescriptionFactory.createTextArea({
                        label: 'Symptoms',
                        name: 'symptoms',
                        value: form.symptoms,
                        onChange: handleFormChange,
                        rows: 2,
                        placeholder: 'Describe symptoms...'
                    })}
                    {prescriptionFactory.createInputField({
                        label: 'Disease Name',
                        name: 'disease',
                        value: form.disease,
                        onChange: handleFormChange,
                        placeholder: 'e.g. Flu, Diabetes',
                    })}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Medicines</label>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-2 py-1">SL</th>
                                        <th className="px-2 py-1">Medicine</th>
                                        <th className="px-2 py-1">Timetable</th>
                                        <th className="px-2 py-1">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.map((row, idx) =>
                                        prescriptionFactory.createTableRow({
                                            sl: idx + 1,
                                            medicine: row.medicine,
                                            timetable: row.timetable,
                                            onChange: handleMedicineChange,
                                            onRemove: removeMedicineRow,
                                            index: idx
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button
                            type="button"
                            onClick={addMedicineRow}
                            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-800"
                        >
                            + Add Medicine
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                        Submit Prescription
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default AddPrescription;