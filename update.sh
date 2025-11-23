#!/bin/bash

# Quick Update Script for Azure Container Apps
# Use this script when you just need to update the code (not full deployment)

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
RESOURCE_GROUP="rg-invitation-ai"
ACR_NAME="invitationaicr"
BACKEND_APP="invitation-backend"
FRONTEND_APP="graduation-invite"
ACR_SERVER="${ACR_NAME}.azurecr.io"

# Parse arguments
UPDATE_BACKEND=false
UPDATE_FRONTEND=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend|-b)
            UPDATE_BACKEND=true
            shift
            ;;
        --frontend|-f)
            UPDATE_FRONTEND=true
            shift
            ;;
        --all|-a)
            UPDATE_BACKEND=true
            UPDATE_FRONTEND=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--backend|-b] [--frontend|-f] [--all|-a]"
            exit 1
            ;;
    esac
done

# Default to updating both if no option specified
if [ "$UPDATE_BACKEND" = false ] && [ "$UPDATE_FRONTEND" = false ]; then
    UPDATE_BACKEND=true
    UPDATE_FRONTEND=true
fi

echo -e "${GREEN}=== Quick Update Script ===${NC}\n"

# Login to ACR
echo "Logging into ACR..."
az acr login --name $ACR_NAME

# Update Backend
if [ "$UPDATE_BACKEND" = true ]; then
    echo -e "\n${YELLOW}>>> Updating Backend${NC}"
    
    cd backend
    echo "Building backend image..."
    docker build -t ${ACR_SERVER}/invitation-backend:latest .
    
    echo "Pushing backend image..."
    docker push ${ACR_SERVER}/invitation-backend:latest
    
    echo "Updating container app..."
    az containerapp update \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --image ${ACR_SERVER}/invitation-backend:latest
    
    cd ..
    echo -e "${GREEN}Backend updated successfully!${NC}"
fi

# Update Frontend
if [ "$UPDATE_FRONTEND" = true ]; then
    echo -e "\n${YELLOW}>>> Updating Frontend${NC}"
    
    cd frontend-next
    echo "Building frontend image..."
    docker build -t ${ACR_SERVER}/invitation-frontend:latest .
    
    echo "Pushing frontend image..."
    docker push ${ACR_SERVER}/invitation-frontend:latest
    
    echo "Updating container app..."
    az containerapp update \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --image ${ACR_SERVER}/invitation-frontend:latest
    
    cd ..
    echo -e "${GREEN}Frontend updated successfully!${NC}"
fi

# Get URLs
echo -e "\n${YELLOW}>>> Deployment URLs${NC}"
BACKEND_URL=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo -e "${GREEN}Frontend: https://$FRONTEND_URL${NC}"
echo -e "${GREEN}Backend:  https://$BACKEND_URL${NC}"

echo -e "\n${GREEN}Update completed!${NC}"
