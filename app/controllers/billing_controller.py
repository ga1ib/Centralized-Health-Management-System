# app/controllers/billing_controller.py

from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from app.models.billing_model import BillingModel
from app.services.payment_service import CardPaymentStrategy, PaymentProcessor

billing_bp = Blueprint("billing", __name__)
db_instance = DatabaseConnection().get_database()
billing_collection = db_instance["Billing"]


# GET: Retrieve all billing records (admin)

@billing_bp.route("/", methods=["GET"])
@token_required
def get_all_billings(decoded_token):
    try:
        # Retrieve every billing document, exclude _id
        payments = list(billing_collection.find({}, {"_id": 0}))
        return jsonify({"payments": payments}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch billing data: {str(e)}"}), 500


# POST: process_payment (unchanged)



@billing_bp.route("/", methods=["POST"])
@token_required
def process_payment(decoded_token):
    try:
        data = request.json
        required_fields = [
            "patient_email", "patient_name", "doctor_email", "doctor_name",
            "amount", "card_number", "card_holder", "expiry_date",
            "schedule_date", "schedule_time"
        ]
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required payment fields"}), 400
    # Strategy Pattern implementation
        # Use the card payment strategy
        payment_strategy = CardPaymentStrategy()
        payment_processor = PaymentProcessor(payment_strategy)
        
        # Process the payment
        payment_result = payment_processor.process_payment(data)
        
        if payment_result["success"]:
            # Create billing record
            billing = BillingModel(
                patient_email=data["patient_email"],
                patient_name=data["patient_name"],
                doctor_email=data["doctor_email"],
                doctor_name=data["doctor_name"],
                amount=data["amount"],
                card_number=data["card_number"],
                card_holder=data["card_holder"],
                expiry_date=data["expiry_date"],
                schedule_date=data["schedule_date"],
                schedule_time=data["schedule_time"],
                payment_date=payment_result["payment_date"],
                payment_time=payment_result["payment_time"].strftime("%H:%M:%S"),
                payment_status="paid",
                transaction_id=payment_result["transaction_id"]
            )
            
            # Save to database
            billing_collection.insert_one(billing.to_dict())
            
            return jsonify({
                "message": "Payment processed successfully",
                "transaction_id": payment_result["transaction_id"]
            }), 201
            
        return jsonify({"error": "Payment processing failed"}), 400
        
    except Exception as e:
        return jsonify({"error": f"Failed to process payment: {str(e)}"}), 500

@billing_bp.route("/<email>", methods=["GET"])
@token_required
def get_payment_history(decoded_token, email):
    try:
        # Find all payments for the given email (as patient)
        payments = list(billing_collection.find(
            {"patient_email": email},
            {"_id": 0}  # Exclude MongoDB _id
        ))
        
        return jsonify({"payments": payments}), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch payment history: {str(e)}"}), 500