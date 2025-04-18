# app/routes/billing_routes.py

from flask import Blueprint
from app.controllers.billing_controller import get_all_billings, process_payment, get_payment_history

billing_routes = Blueprint("billing_routes", __name__)

# GET all billings
billing_routes.route("/", methods=["GET"])(get_all_billings)

# POST a new payment
billing_routes.route("/", methods=["POST"])(process_payment)

# GET payments for a single patient
billing_routes.route("/<email>", methods=["GET"])(get_payment_history)
