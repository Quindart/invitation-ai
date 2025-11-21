from fastapi import APIRouter, HTTPException, status, Query
from app.models.schemas import (
    CreateInvitationRequest,
    InvitationResponse,
    VerifyInvitationRequest,
    VerifyInvitationResponse,
)
from app.services.invitation_service import InvitationService
from app.services.graduate_service import GraduateService

router = APIRouter(prefix="/api/invitations", tags=["invitations"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_invitations(request: CreateInvitationRequest):
    """
    Create invitation codes for a graduate with guest names
    
    - **graduate_id**: MongoDB ObjectId of the graduate
    - **guest_names**: List of names of people being invited
    
    Example:
    {
        "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "guest_names": ["Nguyễn Văn A", "Trần Thị B", "Hoàng Văn C"]
    }
    """
    # Verify that graduate exists
    graduate = GraduateService.get_graduate(request.graduate_id)
    if not graduate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Graduate not found"
        )
    
    if not request.guest_names or len(request.guest_names) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one guest name is required"
        )
    
    try:
        invitations = InvitationService.create_invitations(
            request.graduate_id,
            request.guest_names
        )
        return {
            "message": f"{len(invitations)} invitation(s) created successfully",
            "invitations": invitations
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/verify", response_model=dict)
async def verify_invitation(request: VerifyInvitationRequest):
    """
    Verify invitation code and get associated graduate information
    
    - **invitation_code**: 6-digit invitation code
    
    Returns graduate information and guest name if valid code, otherwise returns error
    """
    # Verify invitation code
    result = InvitationService.verify_invitation_code(request.invitation_code)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid invitation code"
        )
    
    graduate_id = result["graduate_id"]
    guest_name = result["guest_name"]
    
    # Get graduate information
    graduate = GraduateService.get_graduate(graduate_id)
    if not graduate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Graduate information not found"
        )
    
    return {
        "graduate_id": graduate_id,
        "guest_name": guest_name,
        "graduate_info": graduate
    }

@router.get("", response_model=list)
async def get_all_invitations(graduate_id: str = Query(None)):
    """
    Get all invitations
    
    - **graduate_id** (optional): Filter by graduate_id to get invitations for specific graduate
    
    Examples:
    - GET /api/invitations - Get all invitations
    - GET /api/invitations?graduate_id=65a1b2c3d4e5f6g7h8i9j0k1 - Get invitations for specific graduate
    """
    try:
        if graduate_id:
            # Get invitations for specific graduate
            invitations = InvitationService.get_invitations_by_graduate(graduate_id)
        else:
            # Get all invitations
            invitations = InvitationService.get_all_invitations()
        
        return invitations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )