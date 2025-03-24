from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class DatabaseConnection:
    _instance = None  # Singleton instance

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance.client = MongoClient(os.getenv("MONGO_URI"))  # Connect to MongoDB
            cls._instance.db = cls._instance.client["HMS_Database"]  # Database Name
        return cls._instance

    def get_database(self):
        return self.db  # Return the database object

# Usage example
db_instance = DatabaseConnection().get_database()
users_collection = db_instance["Users"]
