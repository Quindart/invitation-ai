"""
Azure Storage Service for managing photo uploads
"""

import os
import uuid
from typing import Optional
from io import BytesIO
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from app.config import settings

class StorageService:
    """Service for Azure Blob Storage operations"""
    
    def __init__(self):
        """Initialize Azure Storage connection"""
        if not settings.azure_storage_connection_string:
            raise ValueError(
                "Azure Storage not configured. "
                "Please set AZURE_STORAGE_CONNECTION_STRING in .env"
            )
        
        self.connection_string = settings.azure_storage_connection_string
        self.container_name = settings.azure_storage_container_name
        self.blob_service_client = BlobServiceClient.from_connection_string(
            self.connection_string
        )
    
    def upload_file(self, file_content: bytes, file_name: str, graduate_id: str) -> str:
        """
        Upload file to Azure Storage and return URL
        
        Args:
            file_content: File bytes
            file_name: Original filename
            graduate_id: Graduate ID for organizing storage
        
        Returns:
            Public URL of uploaded file
        """
        try:
            # Create container if not exists
            container_client = self.blob_service_client.get_container_client(
                self.container_name
            )
            
            try:
                container_client.get_container_properties()
            except:
                container_client.create_container(public_access="blob")
            
            # Generate unique blob name
            file_ext = os.path.splitext(file_name)[1]
            blob_name = f"{graduate_id}/{uuid.uuid4()}{file_ext}"
            
            # Upload file
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            blob_client.upload_blob(file_content, overwrite=True)
            
            # Return public URL
            blob_url = blob_client.url
            return blob_url
            
        except Exception as e:
            print(f"Error uploading file to Azure Storage: {e}")
            raise
    
    def delete_file(self, blob_url: str) -> bool:
        """
        Delete file from Azure Storage by URL
        
        Args:
            blob_url: Full URL of the blob
        
        Returns:
            True if deleted, False otherwise
        """
        try:
            # Extract blob name from URL
            blob_name = blob_url.split(f"{self.container_name}/")[1]
            
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            blob_client.delete_blob()
            return True
            
        except Exception as e:
            print(f"Error deleting file from Azure Storage: {e}")
            return False
    
    def get_blob_client(self, blob_name: str) -> BlobClient:
        """Get blob client for specific blob"""
        return self.blob_service_client.get_blob_client(
            container=self.container_name,
            blob=blob_name
        )


# Singleton instance
_storage_service: Optional[StorageService] = None

def get_storage_service() -> StorageService:
    """Get or create storage service instance"""
    global _storage_service
    
    if _storage_service is None:
        _storage_service = StorageService()
    
    return _storage_service
