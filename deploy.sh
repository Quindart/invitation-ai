#!/bin/bash

# Azure Container Apps Deployment Script
# Author: Invitation AI Team
# Description: Deploy backend + frontend to Azure Container Apps

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="rg-invitation-ai"
LOCATION="southeastasia"
ACR_NAME="invitationaicr"
ENV_NAME="env-invitation-ai"
BACKEND_APP="invitation-backend"
FRONTEND_APP="graduation-invite"

echo -e "${GREEN}=== Azure Container Apps Deployment ===${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Function to print step
print_step() {
    echo -e "\n${YELLOW}>>> $1${NC}\n"
}

# Function to check if resource group exists
check_resource_group() {
    if az group show --name $RESOURCE_GROUP &> /dev/null; then
        echo -e "${GREEN}Resource group exists.${NC}"
        return 0
    else
        echo -e "${YELLOW}Resource group does not exist.${NC}"
        return 1
    fi
}

# Prompt for secrets
prompt_secrets() {
    echo -e "${YELLOW}Please provide the following secrets:${NC}"
    read -sp "MongoDB URI: " MONGODB_URI
    echo
    read -sp "Azure Storage Connection String: " STORAGE_CONNECTION
    echo
    read -sp "Azure OpenAI Endpoint: " OPENAI_ENDPOINT
    echo
    read -sp "Azure OpenAI API Key: " OPENAI_KEY
    echo
    read -p "Azure OpenAI Deployment Name [gpt-4]: " OPENAI_DEPLOYMENT
    OPENAI_DEPLOYMENT=${OPENAI_DEPLOYMENT:-gpt-4}
}

# Step 1: Login to Azure
print_step "Step 1: Checking Azure login"
if ! az account show &> /dev/null; then
    echo "Please login to Azure..."
    az login
fi

SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo -e "${GREEN}Using subscription: $SUBSCRIPTION_NAME${NC}"

# Step 2: Create or check Resource Group
print_step "Step 2: Setting up Resource Group"
if ! check_resource_group; then
    echo "Creating resource group..."
    az group create \
        --name $RESOURCE_GROUP \
        --location $LOCATION
fi

# Step 3: Create or check Container Registry
print_step "Step 3: Setting up Container Registry"
if ! az acr show --name $ACR_NAME &> /dev/null; then
    echo "Creating Container Registry..."
    az acr create \
        --resource-group $RESOURCE_GROUP \
        --name $ACR_NAME \
        --sku Basic \
        --admin-enabled true
fi

# Login to ACR
echo "Logging into ACR..."
az acr login --name $ACR_NAME

# Get ACR credentials
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)
ACR_SERVER="${ACR_NAME}.azurecr.io"

# Step 4: Build and Push Backend
print_step "Step 4: Building and Pushing Backend Image"
cd backend
echo "Building backend image..."
docker build -t ${ACR_SERVER}/invitation-backend:latest .
echo "Pushing backend image..."
docker push ${ACR_SERVER}/invitation-backend:latest
cd ..

# Step 5: Build and Push Frontend
print_step "Step 5: Building and Pushing Frontend Image"
cd frontend-next
echo "Building frontend image..."
docker build -t ${ACR_SERVER}/invitation-frontend:latest .
echo "Pushing frontend image..."
docker push ${ACR_SERVER}/invitation-frontend:latest
cd ..

# Step 6: Create Container Apps Environment
print_step "Step 6: Setting up Container Apps Environment"
if ! az containerapp env show --name $ENV_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "Installing Container Apps extension..."
    az extension add --name containerapp --upgrade --yes
    
    echo "Registering providers..."
    az provider register --namespace Microsoft.App --wait
    az provider register --namespace Microsoft.OperationalInsights --wait
    
    echo "Creating Container Apps Environment..."
    az containerapp env create \
        --name $ENV_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
fi

# Step 7: Get secrets
print_step "Step 7: Configuring Secrets"
prompt_secrets

# Step 8: Deploy Backend
print_step "Step 8: Deploying Backend Container App"
if az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "Updating existing backend..."
    az containerapp update \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --image ${ACR_SERVER}/invitation-backend:latest
else
    echo "Creating backend container app..."
    az containerapp create \
        --name $BACKEND_APP \
        --resource-group $RESOURCE_GROUP \
        --environment $ENV_NAME \
        --image ${ACR_SERVER}/invitation-backend:latest \
        --registry-server $ACR_SERVER \
        --registry-username $ACR_NAME \
        --registry-password "$ACR_PASSWORD" \
        --target-port 8000 \
        --ingress 'external' \
        --env-vars \
            "MONGODB_CONNECTION_STRING=secretref:mongodb-uri" \
            "AZURE_STORAGE_CONNECTION_STRING=secretref:storage-connection" \
            "AZURE_OPENAI_ENDPOINT=secretref:openai-endpoint" \
            "AZURE_OPENAI_API_KEY=secretref:openai-key" \
            "AZURE_OPENAI_DEPLOYMENT_NAME=$OPENAI_DEPLOYMENT" \
            "AZURE_OPENAI_API_VERSION=2024-10-21" \
        --secrets \
            "mongodb-uri=$MONGODB_URI" \
            "storage-connection=$STORAGE_CONNECTION" \
            "openai-endpoint=$OPENAI_ENDPOINT" \
            "openai-key=$OPENAI_KEY" \
        --cpu 0.5 \
        --memory 1.0Gi \
        --min-replicas 1 \
        --max-replicas 3
fi

# Get Backend URL
BACKEND_URL=$(az containerapp show \
    --name $BACKEND_APP \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn -o tsv)

echo -e "${GREEN}Backend URL: https://$BACKEND_URL${NC}"

# Step 9: Deploy Frontend
print_step "Step 9: Deploying Frontend Container App"
if az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "Updating existing frontend..."
    az containerapp update \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --image ${ACR_SERVER}/invitation-frontend:latest \
        --set-env-vars "NEXT_PUBLIC_API_URL=https://$BACKEND_URL/api"
else
    echo "Creating frontend container app..."
    az containerapp create \
        --name $FRONTEND_APP \
        --resource-group $RESOURCE_GROUP \
        --environment $ENV_NAME \
        --image ${ACR_SERVER}/invitation-frontend:latest \
        --registry-server $ACR_SERVER \
        --registry-username $ACR_NAME \
        --registry-password "$ACR_PASSWORD" \
        --target-port 3000 \
        --ingress 'external' \
        --env-vars \
            "NEXT_PUBLIC_API_URL=https://$BACKEND_URL/api" \
        --cpu 0.5 \
        --memory 1.0Gi \
        --min-replicas 1 \
        --max-replicas 3
fi

# Get Frontend URL
FRONTEND_URL=$(az containerapp show \
    --name $FRONTEND_APP \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn -o tsv)

# Step 10: Summary
print_step "Deployment Complete!"
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Deployment URLs                           ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║ Frontend: https://$FRONTEND_URL"
echo -e "${GREEN}║ Backend:  https://$BACKEND_URL"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Update CORS in backend/app/main.py to include: https://$FRONTEND_URL"
echo "2. Test the application at: https://$FRONTEND_URL"
echo "3. Check logs: az containerapp logs show --name $BACKEND_APP -g $RESOURCE_GROUP --follow"

echo -e "\n${GREEN}Deployment script completed successfully!${NC}"
