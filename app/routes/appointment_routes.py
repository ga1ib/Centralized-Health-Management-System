# app/routes/appointment_routes.py
from flask import Blueprint
from app.controllers.appointment_controller import appointment_bp

appointment_routes = Blueprint("appointment_routes", __name__)

# You can either register the blueprint directly here or simply use `appointment_bp`
# In your main app.py, you would register like:
#    app.register_blueprint(appointment_bp, url_prefix="/api/appointments")
