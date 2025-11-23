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
        system_prompt = f"""Bạn là trợ lý AI cho lễ tốt nghiệp của {graduate_info['name']}.

THÔNG TIN SỰ KIỆN:
{graduate_context}

QUY TẮC TRẢ LỜI:
1. Chỉ trả lời về lễ tốt nghiệp này
2. Trả lời NGẮN GỌN, SÚCÍCH (2-4 câu)
3. Đi THẲNG VÀO TRỌNG TÂM câu hỏi
4. Sử dụng Markdown để format:
   - **in đậm** cho thông tin quan trọng
   - Xuống dòng khi cần
   - Dấu đầu dòng cho danh sách
5. Thân thiện nhưng chuyên nghiệp
6. Nếu hỏi ngoài phạm vi, từ chối lịch sự

VÍ DỤ TRẢ LỜI TốT:
- "Lễ tốt nghiệp diễn ra vào **10:00, ngày 29/11/2025** tại Đại học KHTN."
- "Bạn có thể gửi xe tại:\n- Bãi giữa xe trường ĐH KHTN\n- TTTM Nowzone"
- "Liên hệ qua email **thaiquang@gmail.com** hoặc điện thoại **0359069669**."
"""
        
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
