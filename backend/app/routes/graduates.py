from fastapi import APIRouter, HTTPException, status, UploadFile, File
from app.models.schemas import (
    CreateGraduateRequest, 
    GraduateResponse,
)
from app.services.graduate_service import GraduateService
from app.services.storage_service import get_storage_service

router = APIRouter(prefix="/api/graduates", tags=["graduates"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_graduate(request: CreateGraduateRequest):
    """
    Create a new graduate record
    
    - **name**: Full name of the graduate
    - **degree**: Degree type (Bachelor, Master, etc.)
    - **department**: Department/Major
    - **graduation_datetime**: Date and time of graduation (ISO format)
    - **venue**: Venue information (name, address, parking)
    - **invitation_template**: Optional HTML template for invitation
    - **contact**: Contact information (email, phone)
    - **photo_urls**: Optional list of photo URLs for the graduate
    
    Example:
    ```json
    {
      "name": "Thái Quang",
      "degree": "Bachelor of Science",
      "department": "Computer Science",
      "graduation_datetime": "2025-12-20T10:00:00Z",
      "venue": {
        "name": "University Auditorium",
        "address": "123 Main St",
        "parking": "Lot B"
      },
      "contact": {
        "email": "thai@example.com",
        "phone": "+84912345678"
      },
      "photo_urls": [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg"
      ]
    }
    ```
    """
    try:
        graduate_id = GraduateService.create_graduate(request)
        return {
            "message": "Graduate created successfully",
            "graduate_id": graduate_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{graduate_id}", response_model=dict)
async def get_graduate(graduate_id: str):
    """
    Get graduate information by ID
    
    - **graduate_id**: MongoDB ObjectId of the graduate
    """
    graduate = GraduateService.get_graduate(graduate_id)
    
    if not graduate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Graduate not found"
        )
    
    return graduate

@router.put("/{graduate_id}", response_model=dict)
async def update_graduate(graduate_id: str, request: dict):
    """
    Update graduate information (e.g., add photos)
    
    - **graduate_id**: MongoDB ObjectId of the graduate
    - **request**: Fields to update (e.g., {"photo_urls": [...]})
    """
    try:
        updated = GraduateService.update_graduate(graduate_id, request)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Graduate not found"
            )
        return {"message": "Graduate updated successfully", "graduate_id": graduate_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("", response_model=list)
async def get_all_graduates():
    """Get all graduates"""
    graduates = GraduateService.get_all_graduates()
    return graduates

@router.post("/{graduate_id}/photos", response_model=dict)
async def upload_photo(graduate_id: str, file: UploadFile = File(...)):
    """
    Upload a photo for a graduate to Azure Storage
    
    - **graduate_id**: MongoDB ObjectId of the graduate
    - **file**: Image file (jpg, png, etc.)
    
    Returns:
    ```json
    {
      "photo_url": "https://storage.azure.com/...",
      "file_name": "photo.jpg"
    }
    ```
    """
    try:
        # Validate graduate exists
        graduate = GraduateService.get_graduate(graduate_id)
        if not graduate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Graduate not found"
            )
        
        # Validate file type
        allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File type not allowed. Accept: JPG, PNG, GIF, WebP"
            )
        
        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024
        file_content = await file.read()
        if len(file_content) > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size too large (max 5MB)"
            )
        
        # Upload to Azure Storage
        storage_service = get_storage_service()
        photo_url = storage_service.upload_file(
            file_content=file_content,
            file_name=file.filename,
            graduate_id=graduate_id
        )
        
        return {
            "photo_url": photo_url,
            "file_name": file.filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload photo: {str(e)}"
        )
