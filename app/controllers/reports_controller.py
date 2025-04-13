# app/controllers/reports_controller.py
from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from datetime import datetime

reports_bp = Blueprint("reports", __name__)
db_instance = DatabaseConnection().get_database()
billing_collection = db_instance["Billing"]  # Example: using your Billing schema

@reports_bp.route("/hospital", methods=["GET"])
@token_required
def get_hospital_reports(decoded_token):
    # Optional date filtering from query parameters
    start_date = request.args.get("start")
    end_date = request.args.get("end")
    query = {}
    if start_date and end_date:
        # Assuming your billing documents have a 'date' field (stored as a string or datetime)
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            query["date"] = {"$gte": start, "$lte": end}
        except Exception as e:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD.", "details": str(e)}), 400

    # Example aggregation to calculate total earnings
    pipeline = [
        {"$match": query},
        {"$group": {"_id": None, "totalEarnings": {"$sum": "$amount"}}}
    ]
    result = list(billing_collection.aggregate(pipeline))
    totalEarnings = result[0]["totalEarnings"] if result else 0

    # You can also add other performance metrics as needed.
    report_data = [
        {"metric": "Total Earnings", "value": totalEarnings},
        # Add further metrics here...
    ]
    return jsonify({"reports": report_data}), 200
