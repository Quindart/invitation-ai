from fastapi import APIRouter, HTTPException, status
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chatbot_service import ChatbotService
from app.services.graduate_service import GraduateService

router = APIRouter(prefix="/api/graduates", tags=["chatbot"])

# Lazy load chatbot service
_chatbot_service = None

def get_chatbot_service():
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service

@router.post("/{graduate_id}/chat", response_model=ChatResponse)
async def chat(graduate_id: str, request: ChatRequest):
    """
    Chat with graduate information chatbot
    
    - **graduate_id**: MongoDB ObjectId of the graduate
    - **message**: User's question about the graduation event
    
    The chatbot can answer questions about:
    - Time and date of graduation
    - Venue location and address
    - Parking information
    - Contact information
    - Other details about the event
    """
    # Verify that graduate exists
    graduate = GraduateService.get_graduate(graduate_id)
    if not graduate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Graduate not found"
        )
    
    try:
        chatbot_service = get_chatbot_service()
        response = chatbot_service.generate_response(graduate, request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chatbot error: {str(e)}"
        )
