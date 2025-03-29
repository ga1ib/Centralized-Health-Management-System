from app.services.db_connection import DatabaseConnection

# Get database instance and assign the Users collection
db_instance = DatabaseConnection().get_database()
users_collection = db_instance["Users"]
