import random
import string
from typing import Optional
from bson import ObjectId
from app.database import mongo_db
from app.models.schemas import CreateGraduateRequest, GraduateResponse

class GraduateService:
    """Service for managing graduates"""
    
    @staticmethod
    def create_graduate(graduate_data: CreateGraduateRequest) -> str:
        """Create a new graduate record with optional photos"""
        collection = mongo_db.get_graduates_collection()
        
        document = {
            "name": graduate_data.name,
            "degree": graduate_data.degree,
            "department": graduate_data.department,
            "graduation_datetime": graduate_data.graduation_datetime,
            "venue": {
                "name": graduate_data.venue.name,
                "address": graduate_data.venue.address,
                "parking": graduate_data.venue.parking,
            },
            "invitation_template": graduate_data.invitation_template,
            "contact": {
                "email": graduate_data.contact.email,
                "phone": graduate_data.contact.phone,
            },
            "photo_urls": graduate_data.photo_urls or []  # Add photo URLs
        }
        
        result = collection.insert_one(document)
        return str(result.inserted_id)
    
    @staticmethod
    def get_graduate(graduate_id: str) -> Optional[dict]:
        """Get graduate by ID"""
        collection = mongo_db.get_graduates_collection()
        
        try:
            graduate = collection.find_one({"_id": ObjectId(graduate_id)})
            if graduate:
                graduate["_id"] = str(graduate["_id"])
            return graduate
        except Exception as e:
            print(f"Error getting graduate: {e}")
            return None
    
    @staticmethod
    def get_all_graduates() -> list:
        """Get all graduates"""
        collection = mongo_db.get_graduates_collection()
        graduates = []
        
        for doc in collection.find():
            doc["_id"] = str(doc["_id"])
            graduates.append(doc)
        
        return graduates
    
    @staticmethod
    def update_graduate(graduate_id: str, update_data: dict) -> bool:
        """Update graduate record"""
        collection = mongo_db.get_graduates_collection()
        
        try:
            result = collection.update_one(
                {"_id": ObjectId(graduate_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0 or result.matched_count > 0
        except Exception as e:
            print(f"Error updating graduate: {e}")
            return False
