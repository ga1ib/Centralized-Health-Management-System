from flask import Blueprint, request, jsonify
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from app.models.prescription_model import PrescriptionModel

prescription_bp = Blueprint("prescription", __name__)
db_instance = DatabaseConnection().get_database()
prescription_collection = db_instance["Prescriptions"]

@prescription_bp.route("/", methods=["POST"])
@token_required
def create_prescription(decoded_token):
    data = request.json
    try:
        # Save all prescription fields, including tests
        prescription_doc = {
            "blood_pressure": data.get("bloodPressure"),
            "heart_rate": data.get("heartRate"),
            "temperature": data.get("temperature"),
            "symptoms": data.get("symptoms"),
            "disease": data.get("disease"),
            "medicines": data.get("medicines", []),
            "doctor_email": data.get("doctor_email"),
            "patient_email": data.get("patient_email"),
            "patient_name": data.get("patient_name"),
            "tests": data.get("tests", []),
            "tests_total": data.get("tests_total", 0),
            "createdAt": data.get("createdAt")
        }
        prescription_collection.insert_one(prescription_doc)
        # Update appointment status to 'visited' for this patient and doctor
        db_instance["Appointments"].update_many(
            {
                "patient_email": data.get("patient_email"),
                "doctor_email": data.get("doctor_email"),
                "status": {"$ne": "visited"}
            },
            {"$set": {"status": "visited"}}
        )
        return jsonify({"message": "Prescription (with tests) saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to save prescription: {str(e)}"}), 500

@prescription_bp.route("/", methods=["GET"])
@token_required
def get_prescriptions(decoded_token):
    patient_email = request.args.get("patient_email")
    doctor_email = request.args.get("doctor_email")
    query = {}
    if patient_email:
        query["patient_email"] = patient_email
    if doctor_email:
        query["doctor_email"] = doctor_email
    prescriptions = list(prescription_collection.find(query, {"_id": 0}))
    return jsonify({"prescriptions": prescriptions}), 200
