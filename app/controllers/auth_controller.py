from flask import Blueprint, request, jsonify
from app.models.user_model import users_collection
from app.utils.encryption import hash_password, check_password
from app.utils.jwt_auth import generate_jwt

auth_bp = Blueprint("auth", __name__)

# Signup Route
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = hash_password(password)
    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    token = generate_jwt(email)
    return jsonify({"message": "Signup successful", "token": token}), 201

# Login Route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or not check_password(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt(email)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    }), 200
