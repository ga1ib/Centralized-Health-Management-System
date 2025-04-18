// Factory and Abstract Factory for Prescription Page
import React from 'react';

// Abstract Factory
class PrescriptionComponentFactory {
    createInputField(props) {
        throw new Error('This method should be overridden!');
    }
    createTextArea(props) {
        throw new Error('This method should be overridden!');
    }
    createTableRow(props) {
        throw new Error('This method should be overridden!');
    }
}

// Concrete Factory
class ConcretePrescriptionFactory extends PrescriptionComponentFactory {
    createInputField({ label, value, onChange, name, type = 'text', ...rest }) {
        return (
            <div className="mb-4" key={name}>
                <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...rest}
                />
            </div>
        );
    }
    createTextArea({ label, value, onChange, name, rows = 3, ...rest }) {
        return (
            <div className="mb-4" key={name}>
                <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...rest}
                />
            </div>
        );
    }
    createTableRow({ sl, medicine, timetable, onChange, onRemove, index }) {
        return (
            <tr key={sl}>
                <td className="px-2 py-1 text-center">{sl}</td>
                <td className="px-2 py-1">
                    <input
                        type="text"
                        name="medicine"
                        value={medicine}
                        onChange={e => onChange(index, 'medicine', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Medicine name"
                    />
                </td>
                <td className="px-2 py-1">
                    <input
                        type="text"
                        name="timetable"
                        value={timetable}
                        onChange={e => onChange(index, 'timetable', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Rules & time"
                    />
                </td>
                <td className="px-2 py-1 text-center">
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                        Remove
                    </button>
                </td>
            </tr>
        );
    }
}

// Export a singleton factory instance
export const prescriptionFactory = new ConcretePrescriptionFactory();
