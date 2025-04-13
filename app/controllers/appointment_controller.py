# app/controllers/appointment_controller.py
from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection  # Singleton for MongoDB connection
from app.middleware.auth_middleware import token_required

appointment_bp = Blueprint("appointment", __name__)

# Get database instance and use the "Appointments" collection.
db_instance = DatabaseConnection().get_database()
appointments_collection = db_instance["Appointments"]

# --------------------------------------------------
# GET: Retrieve all appointments
# --------------------------------------------------
@appointment_bp.route("/", methods=["GET"])
@token_required
def get_all_appointments(decoded_token):
    try:
        # Retrieve all appointments, exclude _id if desired or format _id to string
        appointments = list(appointments_collection.find({}, {"password": 0}))
        # Optionally convert ObjectId to string if needed:
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
    required_fields = ["patient_email", "doctor_email", "date", "time", "status"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required appointment fields"}), 400

    # Insert the new appointment document
    result = appointments_collection.insert_one(data)
    # Retrieve the inserted document (optional)
    new_appt = appointments_collection.find_one({"_id": result.inserted_id})
    new_appt["_id"] = str(new_appt["_id"])
    return jsonify({"message": "Appointment created successfully", "appointment": new_appt}), 201

# --------------------------------------------------
# PUT: Update an existing appointment by ID
# --------------------------------------------------
@appointment_bp.route("/<appointment_id>", methods=["PUT"])
@token_required
def update_appointment(decoded_token, appointment_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    result = appointments_collection.update_one({"_id": appointment_id}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Appointment not found"}), 404

    return jsonify({"message": "Appointment updated successfully"}), 200

# --------------------------------------------------
# DELETE: Delete an appointment by ID
# --------------------------------------------------
@appointment_bp.route("/<appointment_id>", methods=["DELETE"])
@token_required
def delete_appointment(decoded_token, appointment_id):
    result = appointments_collection.delete_one({"_id": appointment_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Appointment not found"}), 404
    return jsonify({"message": "Appointment deleted successfully"}), 200
