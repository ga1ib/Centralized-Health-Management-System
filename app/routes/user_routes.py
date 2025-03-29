from flask import Blueprint, request, jsonify
from app.services.db_connection import DatabaseConnection
from app.utils.encryption import hash_password, check_password
from app.utils.jwt_auth import generate_jwt
from app.middleware.auth_middleware import token_required

user_blueprint = Blueprint("user", __name__)

# Get Database Instance
db_instance = DatabaseConnection().get_database()
users_collection = db_instance["Users"]

# Register a new user
@user_blueprint.route("/register", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = hash_password(password)  # Hash password before storing it
    users_collection.insert_one({"email": email, "password": hashed_password})

    token = generate_jwt(email)  # Generate JWT token for the registered user
    return jsonify({"message": "User registered successfully!", "token": token}), 201

# Login a user
@user_blueprint.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})

    if not user or not check_password(user["password"], password):  # Check hashed password
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt(email)  # Generate JWT token for successful login
    return jsonify({"message": "Login successful", "token": token, "user": {"email": email}}), 200

# Protected Route (Example: Get user profile)
@user_blueprint.route("/profile", methods=["GET"])
@token_required  # Protect this route with token authentication
def get_user_profile(decoded_token):
    email = decoded_token["email"]
    user = users_collection.find_one({"email": email}, {"_id": 0, "password": 0})  # Exclude password

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": user}), 200
