from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# Register Blueprints
from app.controllers.auth_controller import auth_bp
from app.controllers.user_controller import user_bp
from app.controllers.appointment_controller import appointment_bp  # Import your appointments controller
from app.controllers.reports_controller import reports_bp
from app.controllers.billing_controller import billing_bp

app.register_blueprint(reports_bp, url_prefix="/api/reports")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(appointment_bp, url_prefix="/api/appointments")  # Register appointments endpoints
app.register_blueprint(billing_bp, url_prefix="/api/billing")

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Healthcare Management System API!"})

if __name__ == "__main__":
    app.run(debug=True)
