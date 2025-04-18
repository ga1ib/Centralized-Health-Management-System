from flask import Blueprint
from app.controllers.prescription_controller import prescription_bp

prescription_routes = Blueprint("prescription_routes", __name__)

# Register the POST endpoint
prescription_routes.register_blueprint(prescription_bp, url_prefix="/api/prescriptions")
