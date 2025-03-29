from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance.client = MongoClient(os.getenv("MONGO_URI"))
            cls._instance.db = cls._instance.client["HMS_Database"]  # Database Name
        return cls._instance

    def get_database(self):
        return self.db
