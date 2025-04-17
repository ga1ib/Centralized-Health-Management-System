from flask import Blueprint
from app.controllers.billing_controller import process_payment, get_payment_history

billing_routes = Blueprint("billing_routes", __name__)

# Register routes
billing_routes.route("/", methods=["POST"])(process_payment)
billing_routes.route("/<email>", methods=["GET"])(get_payment_history)