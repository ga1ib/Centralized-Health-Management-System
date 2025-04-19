from flask import Blueprint, request, jsonify
from app.models.user_model import users_collection
from app.utils.encryption import hash_password, check_password
from app.utils.jwt_auth import generate_jwt
from app.utils.mailer import send_otp_email
from app.services.observer.auth_observer import AuthSubject, AuthLogger, EmailNotifier
from random import randint
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Initialize auth subject and observers
auth_subject = AuthSubject()
auth_logger = AuthLogger()
email_notifier = EmailNotifier()
email_notifier.set_mailer(send_otp_email)
auth_subject.attach(auth_logger)
auth_subject.attach(email_notifier)

def gen_otp():
    return f"{randint(100000, 999999)}"

# ─── SIGNUP ────────────────────────────────────────────────────────────────
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name     = data.get("name")
    email    = data.get("email")
    password = data.get("password")
    role     = data.get("role", "patient")

    if not all([name, email, password, role]):
        return jsonify({"error": "All fields are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    try:
        # Hash & store user with is_verified=False
        hashed_pw = hash_password(password)
        signup_otp = gen_otp()
        otp_expires = datetime.utcnow() + timedelta(minutes=10)
        
        users_collection.insert_one({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": role,
            "is_verified": False,
            "otp": signup_otp,
            "otp_expiry": otp_expires
        })

        # Notify observers about OTP generation
        auth_subject.notify(
            "OTP_GENERATED",
            email,
            {"otp": signup_otp, "type": "signup"}
        )

        return jsonify({
            "message": "Signup successful. Please verify your email with the OTP sent."
        }), 201
    except Exception as e:
        return jsonify({"error": f"Failed to complete signup: {str(e)}"}), 500

# ─── VERIFY EMAIL OTP ─────────────────────────────────────────────────────
@auth_bp.route("/verify-email", methods=["POST"])
def verify_email():
    data = request.json
    email = data.get("email")
    otp   = data.get("otp")

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("otp") == otp and datetime.utcnow() < user.get("otp_expiry"):
        users_collection.update_one(
            {"email": email},
            {"$set": {"is_verified": True},
             "$unset": {"otp": "", "otp_expiry": ""}}
        )
        return jsonify({"message": "Email verified successfully"}), 200

    return jsonify({"error": "Invalid or expired OTP"}), 400

# ─── LOGIN STEP 1: CREDENTIALS ─────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or not check_password(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.get("is_verified", False):
        return jsonify({"error": "Please verify your email first"}), 401

    try:
        # Generate and store login OTP
        login_otp = gen_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        result = users_collection.update_one(
            {"email": email},
            {"$set": {
                "otp": login_otp,
                "otp_expiry": expires_at
            }}
        )

        if result.modified_count > 0:
            # Notify observers about OTP generation
            auth_subject.notify(
                "OTP_GENERATED",
                email,
                {"otp": login_otp, "type": "login"}
            )
            return jsonify({
                "message": "OTP sent to your email",
                "step": "verify_otp"
            }), 200
        else:
            auth_subject.notify(
                "OTP_FAILED",
                email,
                {"error": "Failed to update user record"}
            )
            return jsonify({"error": "Failed to generate OTP"}), 500

    except Exception as e:
        auth_subject.notify(
            "OTP_FAILED",
            email,
            {"error": str(e)}
        )
        return jsonify({"error": f"Failed to process login: {str(e)}"}), 500

# ─── LOGIN STEP 2: OTP VERIFICATION ────────────────────────────────────────
@auth_bp.route("/verify-login-otp", methods=["POST"])
def verify_login_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if not all([email, otp]):
        return jsonify({"error": "Email and OTP are required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if not user:
            auth_subject.notify("VERIFICATION_FAILED", email, {"error": "User not found"})
            return jsonify({"error": "User not found"}), 404

        stored_otp = user.get("otp")
        otp_expiry = user.get("otp_expiry")

        if not stored_otp or not otp_expiry:
            auth_subject.notify("VERIFICATION_FAILED", email, {"error": "No OTP request found"})
            return jsonify({"error": "No OTP request found"}), 400

        if datetime.utcnow() > otp_expiry:
            # Clear expired OTP
            users_collection.update_one(
                {"email": email},
                {"$unset": {"otp": "", "otp_expiry": ""}}
            )
            auth_subject.notify("VERIFICATION_FAILED", email, {"error": "OTP expired"})
            return jsonify({"error": "OTP has expired"}), 400

        if stored_otp != otp:
            auth_subject.notify("VERIFICATION_FAILED", email, {"error": "Invalid OTP"})
            return jsonify({"error": "Invalid OTP"}), 400

        # Clear OTP fields after successful verification
        users_collection.update_one(
            {"email": email},
            {"$unset": {"otp": "", "otp_expiry": ""}}
        )

        # Generate JWT with complete user info
        token = generate_jwt({
            "email": user["email"],
            "role": user["role"],
            "name": user["name"]
        })

        auth_subject.notify("LOGIN_SUCCESS", email, None)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        auth_subject.notify("VERIFICATION_FAILED", email, {"error": str(e)})
        return jsonify({"error": f"Failed to verify OTP: {str(e)}"}), 500
