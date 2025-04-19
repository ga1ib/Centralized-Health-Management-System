from flask import Flask, jsonify
from flask_cors import CORS
from flask_mail import Mail
import os
from dotenv import load_dotenv
import logging

# Import observer components
from app.controllers.auth_controller import auth_bp, email_notifier
from app.utils.mailer import send_otp_email

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Basic Configuration
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    # Email Configuration
    app.config.update(
        MAIL_SERVER=os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
        MAIL_PORT=int(os.getenv('MAIL_PORT', 587)),
        MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
        MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
        MAIL_USE_TLS=os.getenv('MAIL_USE_TLS', 'True').lower() == 'true',
        MAIL_USE_SSL=False,
        MAIL_DEFAULT_SENDER=os.getenv('MAIL_USERNAME'),
        MAIL_DEBUG=True,
        MAIL_SUPPRESS_SEND=False
    )

    # Log email configuration (excluding sensitive data)
    logger.info(f"Email Configuration:")
    logger.info(f"MAIL_SERVER: {app.config['MAIL_SERVER']}")
    logger.info(f"MAIL_PORT: {app.config['MAIL_PORT']}")
    logger.info(f"MAIL_USERNAME: {app.config['MAIL_USERNAME']}")
    logger.info(f"MAIL_USE_TLS: {app.config['MAIL_USE_TLS']}")

    # Configure email notifier
    email_notifier.set_mailer(send_otp_email)

    # Register Blueprints
    from app.controllers.user_controller import user_bp
    from app.controllers.appointment_controller import appointment_bp
    from app.controllers.reports_controller import reports_bp
    from app.controllers.billing_controller import billing_bp
    from app.controllers.prescription_controller import prescription_bp

    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(appointment_bp, url_prefix="/api/appointments")
    app.register_blueprint(billing_bp, url_prefix="/api/billing")
    app.register_blueprint(prescription_bp, url_prefix="/api/prescriptions")

    return app

app = create_app()

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Healthcare Management System API!"})

if __name__ == "__main__":
    app.run(debug=True)
