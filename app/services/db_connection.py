from pymongo import MongoClient

# MongoDB Atlas connection string
client = MongoClient("your_mongodb_connection_uri")

# Access the database
db = client["HMS_Database"]

# Collections
users_collection = db["Users"]
appointments_collection = db["Appointments"]
prescriptions_collection = db["Prescriptions"]
billing_collection = db["Billing"]

# Example: Insert a user
users_collection.insert_one({
    "role": "patient",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashed_password",
    "contact": "0123456789",
    "medical_history": [],
    "created_at": "2025-03-17"
})
