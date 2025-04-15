# app/routes/appointment_routes.py
from flask import Blueprint
from app.controllers.appointment_controller import (
    get_all_appointments,
    create_appointment,
    update_appointment_status,
    delete_appointment
)

appointment_routes = Blueprint("appointment_routes", __name__)

# Register routes
appointment_routes.route("/", methods=["GET"])(get_all_appointments)
appointment_routes.route("/", methods=["POST"])(create_appointment)
appointment_routes.route("/<appointment_id>", methods=["PUT"])(update_appointment_status)
appointment_routes.route("/<appointment_id>", methods=["DELETE"])(delete_appointment)
