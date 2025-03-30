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
    role = data.get("role", "patient")  # Default role is patient if not provided

    if not name or not email or not password or not role:
        return jsonify({"error": "All fields are required"}), 400

    # Check if email already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    # Hash the password
    hashed_password = hash_password(password)

    # Insert user into database
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role  # Store the role in the database
    }
    users_collection.insert_one(user_data)

    # Generate JWT token with role
    token = generate_jwt({"email": email, "role": role})

    return jsonify({
        "message": "Signup successful",
        "token": token,
        "user": {
            "name": name,
            "email": email,
            "role": role
        }
    }), 201

# Login Route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user in the database
    user = users_collection.find_one({"email": email})
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check if password matches
    if not check_password(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate JWT token with role
    token = generate_jwt({"email": email, "role": user["role"]})

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200
