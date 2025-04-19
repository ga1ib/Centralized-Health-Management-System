from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from datetime import datetime
from abc import ABC, abstractmethod
from werkzeug.utils import secure_filename
import os

# Report Adapter Interface
class ReportAdapter(ABC):
    @abstractmethod
    def get_data(self, query_params=None):
        pass

    @abstractmethod
    def format_response(self, data):
        pass

# Concrete Adapter for All Reports
class AllReportsAdapter(ReportAdapter):
    def __init__(self, collection):
        self.collection = collection

    def get_data(self, query_params=None):
        return list(self.collection.find({}, {"_id": 0}))

    def format_response(self, data):
        # Convert datetime objects to ISO format strings
        for d in data:
            for k, v in d.items():
                if isinstance(v, datetime):
                    d[k] = v.isoformat()
        return {"reports": data}

# Concrete Adapter for Hospital Reports
class HospitalReportsAdapter(ReportAdapter):
    def __init__(self, collection):
        self.collection = collection

    def get_data(self, query_params=None):
        query = {}
        if query_params and 'start' in query_params and 'end' in query_params:
            try:
                start = datetime.strptime(query_params['start'], "%Y-%m-%d")
                end   = datetime.strptime(query_params['end'],   "%Y-%m-%d")
                query["date"] = {"$gte": start, "$lte": end}
            except Exception:
                return None

        pipeline = [
            {"$match": query},
            {"$group": {"_id": None, "totalEarnings": {"$sum": "$amount"}}}
        ]
        return list(self.collection.aggregate(pipeline))

    def format_response(self, data):
        totalEarnings = data[0]["totalEarnings"] if data else 0
        report_data = [
            {"metric": "Total Earnings", "value": totalEarnings}
        ]
        return {"reports": report_data}

reports_bp         = Blueprint("reports", __name__)
db_instance       = DatabaseConnection().get_database()
billing_collection= db_instance["Billing"]
reports_collection= db_instance["Reports"]

# instantiate adapters
all_reports_adapter      = AllReportsAdapter(reports_collection)
hospital_reports_adapter = HospitalReportsAdapter(billing_collection)

# Upload config
UPLOAD_FOLDER    = 'uploads/reports'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@reports_bp.route("/all", methods=["GET"])
@token_required
def get_all_reports(decoded_token):
    try:
        data     = all_reports_adapter.get_data()
        response = all_reports_adapter.format_response(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({
            "error":   "Failed to fetch reports.",
            "details": str(e)
        }), 500

@reports_bp.route("/hospital", methods=["GET"])
@token_required
def get_hospital_reports(decoded_token):
    query_params = request.args.to_dict()
    try:
        data = hospital_reports_adapter.get_data(query_params)
        if data is None:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
        response = hospital_reports_adapter.format_response(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({
            "error":   "Failed to fetch hospital reports.",
            "details": str(e)
        }), 500

@reports_bp.route("/upload", methods=["POST"])
@token_required
def upload_report(decoded_token):
    try:
        # file presence
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        # save file
        filename  = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # parse date & time fields
        date_str = request.form.get("report_date")
        time_str = request.form.get("report_time")
        upload_dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")

        # build metadata
        report_data = {
            "filename":     filename,
            "file_path":    file_path,
            "upload_date":  upload_dt,
            "uploaded_by":  decoded_token["email"],
            "patient_name": request.form.get("patient_name", ""),
            "service":      request.form.get("service", ""),
            "amount":       float(request.form.get("amount", 0)),
            "status":       "Unpaid"
        }

        # insert into DB
        reports_collection.insert_one(report_data)

        return jsonify({
            "message":  "Report uploaded successfully",
            "filename": filename
        }), 201

    except Exception as e:
        return jsonify({
            "error":   "Failed to upload report",
            "details": str(e)
        }), 500
