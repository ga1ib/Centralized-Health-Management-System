from flask import Blueprint, jsonify
from app.models.user_model import users_collection
from app.middleware.auth_middleware import token_required

user_bp = Blueprint("user", __name__)

# Protected Route: Get user profile
@user_bp.route("/profile", methods=["GET"])
@token_required
def get_user_profile(decoded_token):
    email = decoded_token.get("email")
    user = users_collection.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user}), 200
