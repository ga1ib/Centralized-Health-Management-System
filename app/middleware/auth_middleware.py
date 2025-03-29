from flask import request, jsonify
from app.utils.jwt_auth import decode_jwt

def token_required(f):
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing!"}), 401

        # Expected format: "Bearer <token>"
        parts = token.split(" ")
        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({"error": "Invalid token format!"}), 401

        decoded_token = decode_jwt(parts[1])
        if not decoded_token:
            return jsonify({"error": "Invalid or expired token!"}), 401

        return f(decoded_token, *args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function
