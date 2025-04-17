# app/controllers/appointment_controller.py
from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from app.services.observer.appointment_subject import AppointmentSubject
from app.services.observer.appointment_logger import AppointmentLogger
from bson import ObjectId

appointment_bp = Blueprint("appointment", __name__)

# Get database instance and use the "Appointments" collection
db_instance = DatabaseConnection().get_database()
appointments_collection = db_instance["Appointments"]

# Initialize the observer pattern
appointment_subject = AppointmentSubject()
appointment_logger = AppointmentLogger()
appointment_subject.attach(appointment_logger)

# --------------------------------------------------
# GET: Retrieve all appointments
# --------------------------------------------------
@appointment_bp.route("/", methods=["GET"])
@token_required
def get_all_appointments(decoded_token):
    try:
        appointments = list(appointments_collection.find({}, {"password": 0}))
        for appointment in appointments:
            if "_id" in appointment:
                appointment["_id"] = str(appointment["_id"])
        return jsonify({"appointments": appointments}), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve appointments", "details": str(e)}), 500

# --------------------------------------------------
# POST: Create a new appointment
# --------------------------------------------------
@appointment_bp.route("/", methods=["POST"])
@token_required
def create_appointment(decoded_token):
    data = request.json
    required_fields = ["patient_email", "patient_name", "doctor_email", "doctor_name", "date", "time", "status"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required appointment fields"}), 400

    try:
        result = appointments_collection.insert_one(data)
        new_appt = appointments_collection.find_one({"_id": result.inserted_id})
        new_appt["_id"] = str(new_appt["_id"])
        return jsonify({"message": "Appointment created successfully", "appointment": new_appt}), 201
    except Exception as e:
        return jsonify({"error": "Failed to create appointment", "details": str(e)}), 500

# --------------------------------------------------
# PUT: Update appointment status
# --------------------------------------------------
@appointment_bp.route("/<appointment_id>", methods=["PUT"])
@token_required
def update_appointment_status(decoded_token, appointment_id):
    try:
        data = request.json
        if "status" not in data:
            return jsonify({"error": "Status field is required"}), 400

        # Get the current appointment to check old status
        current_appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
        if not current_appointment:
            return jsonify({"error": "Appointment not found"}), 404

        old_status = current_appointment.get("status")
        new_status = data["status"]

        # Update the appointment status
        result = appointments_collection.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": {"status": new_status}}
        )

        if result.modified_count > 0:
            # Notify observers about the status change
            appointment_subject.set_status(appointment_id, old_status, new_status)
            return jsonify({"message": "Appointment status updated successfully"}), 200
        else:
            return jsonify({"error": "No changes made to appointment"}), 400

    except Exception as e:
        return jsonify({"error": "Failed to update appointment status", "details": str(e)}), 500

# --------------------------------------------------
# DELETE: Delete an appointment
# --------------------------------------------------
@appointment_bp.route("/<appointment_id>", methods=["DELETE"])
@token_required
def delete_appointment(decoded_token, appointment_id):
    try:
        result = appointments_collection.delete_one({"_id": ObjectId(appointment_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Appointment not found"}), 404
        return jsonify({"message": "Appointment deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete appointment", "details": str(e)}), 500
