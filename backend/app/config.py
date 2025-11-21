from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    mongodb_connection_string: str
    
    # Azure OpenAI Configuration
    azure_openai_api_key: str
    azure_openai_endpoint: str
    azure_openai_api_version: str = "2024-02-15-preview"
    azure_openai_deployment_name: str
    
    # Azure Storage Configuration (Optional - only needed for photo uploads)
    azure_storage_connection_string: Optional[str] = None
    azure_storage_container_name: str = "graduation-photos"
    
    secret_key: str = "your-secret-key"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
