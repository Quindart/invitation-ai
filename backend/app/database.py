from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from app.config import settings
from typing import Optional

class MongoDB:
    """MongoDB connection handler"""
    
    _client: Optional[MongoClient] = None
    _db: Optional[Database] = None
    
    @classmethod
    def connect(cls) -> None:
        """Connect to MongoDB"""
        if cls._client is None:
            cls._client = MongoClient(settings.mongodb_connection_string)
            cls._db = cls._client["graduation_invitations"]
            print("Connected to MongoDB")
    
    @classmethod
    def disconnect(cls) -> None:
        """Disconnect from MongoDB"""
        if cls._client is not None:
            cls._client.close()
            cls._client = None
            cls._db = None
            print("Disconnected from MongoDB")
    
    @classmethod
    def get_database(cls) -> Database:
        """Get database instance"""
        if cls._db is None:
            cls.connect()
        return cls._db
    
    @classmethod
    def get_graduates_collection(cls) -> Collection:
        """Get graduates collection"""
        db = cls.get_database()
        return db["graduates"]
    
    @classmethod
    def get_invitations_collection(cls) -> Collection:
        """Get invitations collection"""
        db = cls.get_database()
        return db["invitations"]

# Initialize MongoDB
mongo_db = MongoDB()
