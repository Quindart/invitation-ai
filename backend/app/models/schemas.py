from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ==================== Request/Response Models ====================

class ContactInfo(BaseModel):
    """Contact information for graduate"""
    email: EmailStr
    phone: str

class VenueInfo(BaseModel):
    """Venue information"""
    name: str
    address: str
    parking: Optional[str] = None

class CreateGraduateRequest(BaseModel):
    """Request to create a graduate"""
    name: str
    degree: str  # e.g., "Bachelor", "Master"
    department: str  # e.g., "Computer Science"
    graduation_datetime: datetime
    venue: VenueInfo
    invitation_template: Optional[str] = None  # HTML template or plain text
    contact: ContactInfo
    photo_urls: Optional[list[str]] = None  # List of photo URLs - optional

class GraduateResponse(BaseModel):
    """Response for graduate info"""
    graduate_id: str = Field(alias="_id")
    name: str
    degree: str
    department: str
    graduation_datetime: datetime
    venue: VenueInfo
    invitation_template: Optional[str]
    photo_urls: Optional[list[str]] = None
    contact: ContactInfo
    
    class Config:
        populate_by_name = True

class InvitationItem(BaseModel):
    """Single invitation item"""
    guest_name: str  # Name of invited person
    graduate_id: str

class CreateInvitationRequest(BaseModel):
    """Request to create invitation codes"""
    graduate_id: str
    guest_names: list[str]  # List of guest names for each invitation

class InvitationResponse(BaseModel):
    """Response for invitation"""
    invitation_code: str
    graduate_id: str
    guest_name: str

class VerifyInvitationRequest(BaseModel):
    """Request to verify invitation code"""
    invitation_code: str

class VerifyInvitationResponse(BaseModel):
    """Response when verification is successful"""
    graduate_id: str
    guest_name: str
    graduate_info: GraduateResponse

class ChatRequest(BaseModel):
    """Request to chat with graduate info chatbot"""
    message: str

class ChatResponse(BaseModel):
    """Response from chatbot"""
    response: str
