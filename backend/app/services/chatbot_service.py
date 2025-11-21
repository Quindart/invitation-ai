from openai import AzureOpenAI
from app.config import settings
from typing import Optional

class ChatbotService:
    """Service for chatbot interactions using Azure OpenAI GPT"""
    
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint
        )
        self.model = settings.azure_openai_deployment_name
    
    def generate_response(self, graduate_info: dict, user_message: str) -> str:
        """Generate chatbot response based on graduate info and user message"""
        
        # Prepare graduate info context
        graduate_context = self._prepare_graduate_context(graduate_info)
        
        # System prompt to ensure chatbot only answers about the graduate's event
        system_prompt = f"""Bạn là một trợ lý thông tin về lễ tốt nghiệp của {graduate_info['name']}.
        
Thông tin sự kiện:
{graduate_context}

Bạn chỉ được trả lời các câu hỏi về lễ tốt nghiệp này. Nếu người dùng hỏi về thứ gì khác, 
hãy lịch sự từ chối và yêu cầu họ hỏi về lễ tốt nghiệp.

Hãy trả lời bằng tiếng Việt một cách thân thiện và chuyên nghiệp."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn."
    
    @staticmethod
    def _prepare_graduate_context(graduate_info: dict) -> str:
        """Prepare graduate info as context for chatbot"""
        
        venue = graduate_info.get("venue", {})
        graduation_datetime = graduate_info.get("graduation_datetime", "")
        
        context = f"""
- Người tốt nghiệp: {graduate_info.get('name', 'N/A')}
- Bằng cấp: {graduate_info.get('degree', 'N/A')}
- Ngành: {graduate_info.get('department', 'N/A')}
- Thời gian: {graduation_datetime}
- Địa điểm: {venue.get('name', 'N/A')}
- Địa chỉ: {venue.get('address', 'N/A')}
- Chỗ đậu xe: {venue.get('parking', 'N/A') or 'Chưa cập nhật'}
- Email liên hệ: {graduate_info.get('contact', {}).get('email', 'N/A')}
- Điện thoại: {graduate_info.get('contact', {}).get('phone', 'N/A')}
"""
        return context
