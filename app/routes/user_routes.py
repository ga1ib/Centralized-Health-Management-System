from flask import Blueprint, request, jsonify
from app.services.db_connection import DatabaseConnection

user_blueprint = Blueprint("user", __name__)

# Get Database Instance
db_instance = DatabaseConnection().get_database()
users_collection = db_instance["Users"]

# Register a new user
@user_blueprint.route("/register", methods=["POST"])
def register_user():
    data = request.json
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 400

    users_collection.insert_one(data)
    return jsonify({"message": "User registered successfully!"}), 201

# Get all users
@user_blueprint.route("/", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))  # Exclude ObjectId from response
    return jsonify(users), 200
