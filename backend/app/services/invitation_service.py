import random
import string
from typing import Optional
from bson import ObjectId
from app.database import mongo_db

class InvitationService:
    """Service for managing invitations"""
    
    @staticmethod
    def generate_invitation_codes(count: int = 1) -> list:
        """Generate unique 6-digit invitation codes"""
        collection = mongo_db.get_invitations_collection()
        codes = []
        
        for _ in range(count):
            while True:
                # Generate 6-digit code
                code = ''.join(random.choices(string.digits, k=6))
                
                # Check if code already exists
                existing = collection.find_one({"invitation_code": code})
                if not existing:
                    codes.append(code)
                    break
        
        return codes
    
    @staticmethod
    def create_invitations(graduate_id: str, guest_names: list) -> list:
        """Create invitation records in database with guest names"""
        collection = mongo_db.get_invitations_collection()
        codes = InvitationService.generate_invitation_codes(len(guest_names))
        
        invitations = []
        for code, guest_name in zip(codes, guest_names):
            doc = {
                "invitation_code": code,
                "graduate_id": graduate_id,
                "guest_name": guest_name,
            }
            collection.insert_one(doc)
            invitations.append({
                "invitation_code": code,
                "graduate_id": graduate_id,
                "guest_name": guest_name,
            })
        
        return invitations
    
    @staticmethod
    def verify_invitation_code(invitation_code: str) -> Optional[dict]:
        """Verify invitation code and return graduate_id and guest_name"""
        collection = mongo_db.get_invitations_collection()
        
        invitation = collection.find_one({"invitation_code": invitation_code})
        if invitation:
            return {
                "graduate_id": invitation["graduate_id"],
                "guest_name": invitation.get("guest_name", "Guest")
            }
        
        return None
    
    @staticmethod
    def get_invitation_by_code(invitation_code: str) -> Optional[dict]:
        """Get invitation record by code"""
        collection = mongo_db.get_invitations_collection()
        invitation = collection.find_one({"invitation_code": invitation_code})
        return invitation
    
    @staticmethod
    def get_all_invitations() -> list:
        """Get all invitations"""
        collection = mongo_db.get_invitations_collection()
        invitations = []
        
        for doc in collection.find():
            doc["_id"] = str(doc["_id"])
            invitations.append(doc)
        
        return invitations
    
    @staticmethod
    def get_invitations_by_graduate(graduate_id: str) -> list:
        """Get all invitations for a specific graduate"""
        collection = mongo_db.get_invitations_collection()
        invitations = []
        
        for doc in collection.find({"graduate_id": graduate_id}):
            doc["_id"] = str(doc["_id"])
            invitations.append(doc)
        
        return invitations
