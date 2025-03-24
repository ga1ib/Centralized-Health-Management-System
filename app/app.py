import flask 

from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.user_routes import user_blueprint
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend interaction

# Configuration
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# Register Blueprints (API routes)
app.register_blueprint(user_blueprint, url_prefix="/api/users")

# Test Route
@app.route("/")
def home():
    return jsonify({"message": "Welcome to Healthcare Management System API!"})

if __name__ == "__main__":
    app.run(debug=True)
