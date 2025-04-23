# app/controllers/appointment_controller.py
from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from app.services.observer.appointment_subject import AppointmentSubject
from app.services.observer.appointment_logger import AppointmentLogger
from app.services.appointment_factory import AppointmentFactory
from bson import ObjectId
from datetime import datetime

appointment_bp = Blueprint("appointment", __name__)

# Get database instance and use the "Appointments" and "Billing" collections
db_instance = DatabaseConnection().get_database()
appointments_collection = db_instance["Appointments"]
billing_collection = db_instance["Billing"]

# Initialize the observer pattern and factory
appointment_subject = AppointmentSubject()
appointment_logger = AppointmentLogger()
appointment_subject.attach(appointment_logger)
appointment_factory = AppointmentFactory()


# GET: Retrieve all appointments

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


# POST: Create a new appointment

@appointment_bp.route("/", methods=["POST"])
@token_required
def create_appointment(decoded_token):
    try:
        data = request.json
        print(f"Received appointment data: {data}")
        
        required_fields = [
            "patient_email", "patient_name", "doctor_email", 
            "doctor_name", "date", "time", "status", "payment_id"
        ]
        
        # Validate required fields
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "error": f"Missing required appointment fields: {', '.join(missing_fields)}",
                "success": False
            }), 400

        # Verify payment exists
        payment = billing_collection.find_one({"transaction_id": data["payment_id"]})
        if not payment:
            return jsonify({
                "error": "Invalid payment reference",
                "success": False
            }), 400
            
        if payment["patient_email"] != data["patient_email"]:
            return jsonify({
                "error": "Payment reference does not match patient",
                "success": False
            }), 400

        # Check for duplicate appointments
        existing_appointment = appointments_collection.find_one({
            "doctor_email": data["doctor_email"],
            "date": data["date"],
            "time": data["time"],
            "status": {"$ne": "Cancelled"}
        })
        
        if existing_appointment:
            return jsonify({
                "error": "This time slot is already booked",
                "success": False
            }), 400
        
        # Create appointment using factory
        appointment = appointment_factory.create_appointment(data)
        appointment_data = appointment.to_dict()
        appointment_data.update({
            "patient_name": data["patient_name"],
            "doctor_name": data["doctor_name"],
            "payment_id": data["payment_id"],
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        
        # Insert into database
        result = appointments_collection.insert_one(appointment_data)
        
        # Get the created appointment
        new_appt = appointments_collection.find_one({"_id": result.inserted_id})
        if not new_appt:
            return jsonify({
                "error": "Failed to retrieve created appointment",
                "success": False
            }), 500
            
        # Convert ObjectId to string for JSON serialization
        new_appt["_id"] = str(new_appt["_id"])
        
        # Notify observers
        appointment_subject.notify_creation(new_appt)
        
        print(f"Successfully created appointment: {new_appt}")
        
        return jsonify({
            "message": "Appointment created successfully",
            "appointment": new_appt,
            "success": True
        }), 201

    except Exception as e:
        print(f"Error creating appointment: {str(e)}")
        return jsonify({
            "error": f"Failed to create appointment: {str(e)}",
            "success": False
        }), 500


# PUT: Update appointment status

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


# DELETE: Delete an appointment

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
