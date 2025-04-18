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
        prescription = PrescriptionModel(
            blood_pressure=data.get("bloodPressure"),
            heart_rate=data.get("heartRate"),
            temperature=data.get("temperature"),
            symptoms=data.get("symptoms"),
            disease=data.get("disease"),
            medicines=data.get("medicines", []),
            doctor_email=data.get("doctor_email"),
            created_at=data.get("createdAt")
        )
        prescription_collection.insert_one(prescription.to_dict())
        return jsonify({"message": "Prescription saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to save prescription: {str(e)}"}), 500
