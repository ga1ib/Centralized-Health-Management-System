from pymongo import MongoClient
import os
from dotenv import load_dotenv
from threading import Lock

load_dotenv()  # Load environment variables from .env

class DatabaseConnection:
    _instance = None
    _lock = Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(DatabaseConnection, cls).__new__(cls)
                # Move initialization to __init__
                cls._instance._initialized = False
            return cls._instance
    
    def __init__(self):
        if not self._initialized:
            with self._lock:
                if not self._initialized:
                    self.client = MongoClient(os.getenv("MONGO_URI"))
                    self.db = self.client["HMS_Database"]
                    self._initialized = True
    
    def get_database(self):
        return self.db
    
    def close_connection(self):
        if hasattr(self, 'client'):
            self.client.close()
    
    def __del__(self):
        self.close_connection()
