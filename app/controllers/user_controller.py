# app/controllers/user_controller.py
from flask import Blueprint, jsonify, request
from app.services.db_connection import DatabaseConnection  # Ensure correct path
from app.middleware.auth_middleware import token_required
from app.utils.encryption import hash_password  # For hashing the password on update/register
from app.utils.jwt_auth import generate_jwt

user_bp = Blueprint("user", __name__)

# Get a database instance and the Users collection from your MongoDB
db_instance = DatabaseConnection().get_database()
users_collection = db_instance["Users"]

# --------------------------------------------------
# GET: Retrieve all users (excluding passwords)
# --------------------------------------------------
@user_bp.route("/", methods=["GET"])
@token_required
def get_all_users(decoded_token):
    try:
        # Exclude the _id and password fields from the response
        # (the user record should include email and role)
        users = list(users_collection.find({}, {"_id": 0, "password": 0}))
        return jsonify({"users": users}), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve users", "details": str(e)}), 500

# --------------------------------------------------
# POST: Register a new user (for adding via ManageUsers)
# --------------------------------------------------
@user_bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    # Accept role from the request, default to "user" if not provided.
    role = data.get("role", "user")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = hash_password(password)
    # Store the role with the user data.
    users_collection.insert_one({"email": email, "password": hashed_password, "role": role})
    token = generate_jwt(email)
    return jsonify({"message": "User registered successfully!", "token": token}), 201

# --------------------------------------------------
# PUT: Update an existing user (by email)
# --------------------------------------------------
@user_bp.route("/<email>", methods=["PUT"])
@token_required
def update_user(decoded_token, email):
    data = request.json
    update_data = {}

    # Allow updating email, password, and role if provided
    if "email" in data:
        update_data["email"] = data["email"]
    if "password" in data:
        update_data["password"] = hash_password(data["password"])
    if "role" in data:
        update_data["role"] = data["role"]

    if not update_data:
        return jsonify({"error": "No update fields provided"}), 400

    result = users_collection.update_one({"email": email}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User updated successfully"}), 200

# --------------------------------------------------
# DELETE: Delete a user by email
# --------------------------------------------------
@user_bp.route("/<email>", methods=["DELETE"])
@token_required
def delete_user(decoded_token, email):
    result = users_collection.delete_one({"email": email})
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted successfully"}), 200
