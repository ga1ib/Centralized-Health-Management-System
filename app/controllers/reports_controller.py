from flask import Blueprint, jsonify, request, send_from_directory, Response, make_response, send_file
from app.services.db_connection import DatabaseConnection
from app.middleware.auth_middleware import token_required
from datetime import datetime
from abc import ABC, abstractmethod
from werkzeug.utils import secure_filename
from werkzeug.wsgi import FileWrapper
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import json
from bson import ObjectId
import mimetypes
import logging
import PyPDF2
import io

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

# File Format Adapter Interface
class FileFormatAdapter(ABC):
    @abstractmethod
    def convert_to_format(self, data, output_path):
        """Convert data to specific format and save to output path"""
        pass
    
    @abstractmethod
    def convert_from_format(self, input_path):
        """Convert from the format back to data dictionary"""
        pass

# PDF Adapter Implementation
class PDFAdapter(FileFormatAdapter):
    def convert_to_format(self, data, output_path):
        try:
            # Create a new PDF with ReportLab (more suitable for text content)
            c = canvas.Canvas(output_path, pagesize=letter)
            y = 750  # Starting y position from top
            
            # Add title
            c.setFont("Helvetica-Bold", 16)
            c.drawString(50, y, "Hospital Report")
            y -= 30
            
            # Add report details
            c.setFont("Helvetica", 12)
            for key, value in data.items():
                if key not in ['file', '_id'] and value is not None:  # Skip file and id fields
                    # Format the key name
                    key_name = key.replace('_', ' ').title()
                    content = f"{key_name}: {str(value)}"
                    
                    # Handle long lines
                    if len(content) > 70:  # If content is too long
                        words = content.split()
                        line = ""
                        for word in words:
                            if len(line + " " + word) < 70:
                                line += " " + word
                            else:
                                c.drawString(50, y, line.strip())
                                y -= 20
                                line = word
                        if line:  # Draw any remaining text
                            c.drawString(50, y, line.strip())
                    else:
                        c.drawString(50, y, content)
                    
                    y -= 20
                    
                    # Add a new page if we're running out of space
                    if y < 50:
                        c.showPage()
                        y = 750
                        c.setFont("Helvetica", 12)
            
            c.save()
            return True
        except Exception as e:
            logger.error(f"Error converting to PDF: {str(e)}")
            return False

    def convert_from_format(self, input_path):
        try:
            with open(input_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                return {"content": text}
        except Exception as e:
            logger.error(f"Error reading PDF: {str(e)}")
            return None

# JSON Adapter Implementation
class JSONAdapter(FileFormatAdapter):
    def convert_to_format(self, data, output_path):
        try:
            with open(output_path, 'w') as f:
                json.dump(data, f, indent=4)
            return True
        except Exception as e:
            logger.error(f"Error converting to JSON: {str(e)}")
            return False
            
    def convert_from_format(self, input_path):
        try:
            with open(input_path, 'r') as f:
                data = json.load(f)
            return data
        except Exception as e:
            logger.error(f"Error converting from JSON: {str(e)}")
            return None

reports_bp         = Blueprint("reports", __name__)
db_instance       = DatabaseConnection().get_database()
billing_collection= db_instance["Billing"]
reports_collection= db_instance["Reports"]

# instantiate adapters
all_reports_adapter      = AllReportsAdapter(reports_collection)
hospital_reports_adapter = HospitalReportsAdapter(billing_collection)
pdf_adapter              = PDFAdapter()
json_adapter             = JSONAdapter()

# Upload config
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'uploads', 'reports'))
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'json'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@reports_bp.route("/all", methods=["GET"])
@token_required
def get_all_reports(decoded_token):
    try:
        reports = list(reports_collection.find())
        # Convert ObjectId to string for each report
        for report in reports:
            report['_id'] = str(report['_id'])
            if isinstance(report.get('upload_date'), datetime):
                report['upload_date'] = report['upload_date'].isoformat()
                
        response = {"reports": reports}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({
            "error": "Failed to fetch reports.",
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
        # Create upload folder if it doesn't exist
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Parse date and time if provided
        report_date = request.form.get("report_date", "")
        report_time = request.form.get("report_time", "")
        
        # Combine date and time if both are provided
        try:
            if report_date and report_time:
                report_datetime = datetime.strptime(f"{report_date} {report_time}", "%Y-%m-%d %H:%M")
            elif report_date:
                report_datetime = datetime.strptime(report_date, "%Y-%m-%d")
            else:
                report_datetime = datetime.now()
        except ValueError as e:
            return jsonify({"error": "Invalid date or time format"}), 400

        report_data = {
            "upload_date": report_datetime,
            "uploaded_by": decoded_token["email"],
            "patient_name": request.form.get("patient_name", ""),
            "patient_email": request.form.get("patient_email", ""),
            "doctor_email": request.form.get("doctor_email", ""),
            "service": request.form.get("service", ""),
            "amount": float(request.form.get("amount", 0)),
            "status": "Unpaid",
            "report_date": report_date,
            "report_time": report_time
        }

        # Handle file upload if provided
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400
        
        # Save original file
        orig_filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, orig_filename)
        file.save(file_path)
        report_data["original_file"] = orig_filename

        # Generate PDF version
        pdf_filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
        if pdf_adapter.convert_to_format(report_data, pdf_path):
            report_data["pdf_file"] = pdf_filename

        # Generate JSON version
        json_filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        json_path = os.path.join(UPLOAD_FOLDER, json_filename)
        if json_adapter.convert_to_format(report_data, json_path):
            report_data["json_file"] = json_filename

        # Insert into DB
        result = reports_collection.insert_one(report_data)
        if not result.inserted_id:
            raise Exception("Failed to insert report into database")

        return jsonify({
            "message": "Report uploaded and converted successfully",
            "report": {
                "pdf": pdf_filename if "pdf_file" in report_data else None,
                "json": json_filename if "json_file" in report_data else None,
                "original": report_data.get("original_file")
            }
        }), 201

    except Exception as e:
        return jsonify({
            "error": "Failed to upload and convert report",
            "details": str(e)
        }), 500

@reports_bp.route("/doctor-patient-history", methods=["GET"])
@token_required
def get_doctor_patient_reports(decoded_token):
    patient_email = request.args.get("patient_email")
    doctor_email = request.args.get("doctor_email")
    query = {}
    if patient_email:
        query["patient_email"] = patient_email
    if doctor_email:
        query["doctor_email"] = doctor_email
    # Assuming reports_collection contains doctor_email and patient_email fields
    reports = list(reports_collection.find(query, {"_id": 0}))
    return jsonify({"reports": reports}), 200

# Add new download endpoint
@reports_bp.route("/download/<path:filename>", methods=["GET", "OPTIONS"])
@token_required
def download_file(decoded_token, filename):
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
            'Access-Control-Max-Age': '3600'
        })
        return response, 200  # Important: return 200 status for OPTIONS

    try:
        safe_filename = secure_filename(filename)
        file_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return jsonify({"error": f"File {filename} not found"}), 404

        # Get file size and type
        file_size = os.path.getsize(file_path)
        mime_type = mimetypes.guess_type(file_path)[0] or 'application/octet-stream'

        try:
            response = send_file(
                file_path,
                mimetype=mime_type,
                as_attachment=False,
                download_name=safe_filename,
                max_age=0
            )

            # Add CORS headers
            response.headers.update({
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
                'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length, Content-Type',
                'Content-Length': str(file_size),
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            })

            return response

        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            return jsonify({
                "error": "Failed to read file",
                "details": str(e)
            }), 500

    except Exception as e:
        logger.error(f"Error serving file: {str(e)}")
        return jsonify({
            "error": "Failed to serve file",
            "details": str(e)
        }), 500

def handle_preflight():
    response = make_response()
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '3600'
    })
    return response

@reports_bp.route("/convert/<report_id>", methods=["GET"])
@token_required
def convert_report(decoded_token, report_id):
    try:
        # Get desired output format from query param
        output_format = request.args.get('format', 'pdf').lower()
        if output_format not in ['pdf', 'text', 'json']:
            return jsonify({"error": "Invalid format. Supported formats: pdf, text, json"}), 400

        # Fetch report from database
        try:
            report = reports_collection.find_one({"_id": ObjectId(report_id)})
        except Exception as e:
            return jsonify({"error": "Invalid report ID"}), 400

        if not report:
            return jsonify({"error": "Report not found"}), 404

        # If JSON file doesn't exist, return error
        if 'json_file' not in report:
            return jsonify({"error": "No JSON file available for this report"}), 404

        json_path = os.path.join(UPLOAD_FOLDER, report['json_file'])
        
        # Use JSON adapter to get data
        data = json_adapter.convert_from_format(json_path)
        if not data:
            return jsonify({"error": "Failed to read JSON data"}), 500

        if output_format == 'json':
            return send_file(
                json_path,
                mimetype='application/json',
                as_attachment=True,
                download_name=f"report_{report_id}.json"
            )
        
        elif output_format == 'pdf':
            # Generate new PDF file
            pdf_filename = f"converted_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
            
            if pdf_adapter.convert_to_format(data, pdf_path):
                return send_file(
                    pdf_path,
                    mimetype='application/pdf',
                    as_attachment=True,
                    download_name=f"report_{report_id}.pdf"
                )
            else:
                return jsonify({"error": "Failed to convert to PDF"}), 500
                
        elif output_format == 'text':
            # Convert to simple text format
            text_content = []
            for key, value in data.items():
                if key != 'file' and value is not None:
                    text_content.append(f"{key.replace('_', ' ').title()}: {str(value)}")
            
            response = Response(
                "\n".join(text_content),
                mimetype='text/plain',
                headers={
                    "Content-Disposition": f"attachment;filename=report_{report_id}.txt"
                }
            )
            return response

    except Exception as e:
        print(f"Error converting report: {str(e)}")
        return jsonify({
            "error": "Failed to convert report",
            "details": str(e)
        }), 500

@reports_bp.route("/<report_id>", methods=["PUT", "DELETE"])
@token_required
def update_or_delete_report(decoded_token, report_id):
    if request.method == "DELETE":
        try:
            # Convert string ID to ObjectId
            try:
                report_obj_id = ObjectId(report_id)
            except Exception:
                return jsonify({"error": "Invalid report ID format"}), 400

            # Check if report exists
            report = reports_collection.find_one({"_id": report_obj_id})
            if not report:
                return jsonify({"error": "Report not found"}), 404

            # Delete associated files if they exist
            for file_key in ['original_file', 'pdf_file', 'json_file']:
                if file_key in report:
                    file_path = os.path.join(UPLOAD_FOLDER, report[file_key])
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                    except Exception as e:
                        logger.error(f"Error deleting file {file_path}: {str(e)}")

            # Delete the report from database
            result = reports_collection.delete_one({"_id": report_obj_id})
            
            if result.deleted_count > 0:
                return jsonify({"message": "Report deleted successfully"}), 200
            else:
                return jsonify({"error": "Failed to delete report"}), 500

        except Exception as e:
            logger.error(f"Error deleting report: {str(e)}")
            return jsonify({
                "error": "Failed to delete report",
                "details": str(e)
            }), 500

    # If method is PUT, handle update
    elif request.method == "PUT":
        try:
            data = request.json
            if "status" not in data:
                return jsonify({"error": "Status field is required"}), 400

            try:
                report_obj_id = ObjectId(report_id)
            except Exception:
                return jsonify({"error": "Invalid report ID format"}), 400

            # Check if report exists
            report = reports_collection.find_one({"_id": report_obj_id})
            if not report:
                return jsonify({"error": "Report not found"}), 404

            # Update the report status
            result = reports_collection.update_one(
                {"_id": report_obj_id},
                {"$set": {"status": data["status"]}}
            )

            if result.modified_count > 0:
                return jsonify({"message": "Report status updated successfully"}), 200
            else:
                return jsonify({"error": "No changes made to report"}), 400

        except Exception as e:
            logger.error(f"Error updating report status: {str(e)}")
            return jsonify({
                "error": "Failed to update report status",
                "details": str(e)
            }), 500
