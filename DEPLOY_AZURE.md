# Deploy lên Azure Container Apps

## Tổng quan
Hướng dẫn này sẽ giúp bạn deploy ứng dụng Graduation Invitation (Backend + Frontend) lên Azure Container Apps.

## Kiến trúc triển khai
- **Backend**: FastAPI container trên port 8000
- **Frontend**: Next.js container trên port 3000
- **Database**: MongoDB Atlas (đã có)
- **Storage**: Azure Blob Storage (đã có)

## Bước 1: Chuẩn bị

### 1.1. Cài đặt Azure CLI (nếu chưa có)
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 1.2. Đăng nhập Azure
```bash
az login
```

### 1.3. Thiết lập subscription
```bash
# Xem danh sách subscriptions
az account list --output table

# Set subscription mặc định
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

## Bước 2: Tạo Azure Container Registry (ACR)

### 2.1. Tạo Resource Group
```bash
# Tạo resource group
az group create \
  --name invitation-ai-rg \
  --location southeastasia
```

### 2.2. Tạo Container Registry
```bash
# Tạo ACR
az acr create \
  --resource-group invitation-ai-rg \
  --name invitationaicr \
  --sku Basic \
  --admin-enabled true

# Lấy credentials
az acr credential show --name invitationaicr
```

### 2.3. Login vào ACR
```bash
az acr login --name invitationaicr
```

## Bước 3: Build và Push Docker Images

### 3.1. Backend
```bash
cd backend

# Build image
docker build -t invitationaicr.azurecr.io/invitation-backend:latest .

# Push to ACR
docker push invitationaicr.azurecr.io/invitation-backend:latest
```

### 3.2. Frontend
```bash
cd ../frontend-next

# Build image
docker build -t invitationaicr.azurecr.io/invitation-frontend:latest .

# Push to ACR
docker push invitationaicr.azurecr.io/invitation-frontend:latest
```

## Bước 4: Tạo Container Apps Environment

```bash
# Cài extension (nếu chưa có)
az extension add --name containerapp --upgrade

# Đăng ký provider
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights

# Tạo Container Apps Environment
az containerapp env create \
  --name invitation-ai-env \
  --resource-group invitation-ai-rg \
  --location southeastasia
```

## Bước 5: Deploy Backend Container App

```bash
# Lấy ACR password
ACR_PASSWORD=$(az acr credential show --name invitationaicr --query "passwords[0].value" -o tsv)

# Tạo backend container app
az containerapp create \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --environment invitation-ai-env \
  --image invitationaicr.azurecr.io/invitation-backend:latest \
  --registry-server invitationaicr.azurecr.io \
  --registry-username invitationaicr \
  --registry-password "$ACR_PASSWORD" \
  --target-port 8000 \
  --ingress 'external' \
  --env-vars \
    "MONGODB_URI=secretref:mongodb-uri" \
    "AZURE_STORAGE_CONNECTION_STRING=secretref:storage-connection" \
    "AZURE_OPENAI_ENDPOINT=secretref:openai-endpoint" \
    "AZURE_OPENAI_API_KEY=secretref:openai-key" \
    "AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4" \
  --secrets \
    "mongodb-uri=YOUR_MONGODB_CONNECTION_STRING" \
    "storage-connection=YOUR_AZURE_STORAGE_CONNECTION_STRING" \
    "openai-endpoint=YOUR_AZURE_OPENAI_ENDPOINT" \
    "openai-key=YOUR_AZURE_OPENAI_API_KEY" \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3
```

### Lấy Backend URL
```bash
BACKEND_URL=$(az containerapp show \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Backend URL: https://$BACKEND_URL"
```

## Bước 6: Deploy Frontend Container App

```bash
# Tạo frontend container app
az containerapp create \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --environment invitation-ai-env \
  --image invitationaicr.azurecr.io/invitation-frontend:latest \
  --registry-server invitationaicr.azurecr.io \
  --registry-username invitationaicr \
  --registry-password "$ACR_PASSWORD" \
  --target-port 3000 \
  --ingress 'external' \
  --env-vars \
    "NEXT_PUBLIC_API_URL=https://$BACKEND_URL/api" \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3
```

### Lấy Frontend URL
```bash
FRONTEND_URL=$(az containerapp show \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Frontend URL: https://$FRONTEND_URL"
```

## Bước 7: Cấu hình CORS (Backend)

Cập nhật file `backend/app/main.py` để cho phép frontend domain:

```python
# Thêm frontend URL vào CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        f"https://{FRONTEND_URL}",  # Thêm dòng này
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Sau đó rebuild và redeploy backend.

## Bước 8: Update Container App (khi có thay đổi)

### Backend
```bash
cd backend
docker build -t invitationaicr.azurecr.io/invitation-backend:latest .
docker push invitationaicr.azurecr.io/invitation-backend:latest

az containerapp update \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --image invitationaicr.azurecr.io/invitation-backend:latest
```

### Frontend
```bash
cd frontend-next
docker build -t invitationaicr.azurecr.io/invitation-frontend:latest .
docker push invitationaicr.azurecr.io/invitation-frontend:latest

az containerapp update \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --image invitationaicr.azurecr.io/invitation-frontend:latest
```

## Bước 9: Monitoring và Logs

### Xem logs backend
```bash
az containerapp logs show \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --follow
```

### Xem logs frontend
```bash
az containerapp logs show \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --follow
```

### Xem metrics
```bash
az containerapp show \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --query properties.configuration.ingress
```

## Bước 10: Custom Domain (Optional)

### Thêm custom domain cho frontend
```bash
# Thêm domain
az containerapp hostname add \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --hostname yourdomain.com

# Bind certificate
az containerapp hostname bind \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --hostname yourdomain.com \
  --environment invitation-ai-env \
  --validation-method CNAME
```

## Bước 11: Scaling Configuration

### Auto-scaling rules
```bash
# Backend scaling
az containerapp update \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --min-replicas 1 \
  --max-replicas 5 \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 50

# Frontend scaling
az containerapp update \
  --name invitation-frontend \
  --resource-group invitation-ai-rg \
  --min-replicas 1 \
  --max-replicas 5 \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 100
```

## Bước 12: Cleanup (khi cần xóa)

```bash
# Xóa toàn bộ resource group
az group delete \
  --name invitation-ai-rg \
  --yes \
  --no-wait
```

## Chi phí ước tính (Southeast Asia)

- **Container Apps**: ~$20-50/tháng (tùy traffic)
- **Container Registry**: ~$5/tháng (Basic tier)
- **MongoDB Atlas**: Free tier (512MB) hoặc $9/tháng (Shared M2)
- **Azure Blob Storage**: ~$2-5/tháng (tùy dung lượng)
- **Azure OpenAI**: Tính theo usage

**Tổng ước tính**: $30-70/tháng

## Checklist trước khi deploy

- [ ] MongoDB connection string đã có
- [ ] Azure Storage connection string đã có
- [ ] Azure OpenAI credentials đã có
- [ ] Đã test Dockerfile locally
- [ ] Đã cập nhật CORS origins
- [ ] Đã set environment variables đúng
- [ ] Đã kiểm tra image domain trong next.config.js

## Troubleshooting

### Lỗi "Image pull failed"
```bash
# Kiểm tra ACR credentials
az acr credential show --name invitationaicr

# Kiểm tra image có tồn tại
az acr repository list --name invitationaicr
```

### Lỗi 502 Bad Gateway
```bash
# Kiểm tra logs
az containerapp logs show --name invitation-backend -g invitation-ai-rg --follow

# Kiểm tra health probe
az containerapp show --name invitation-backend -g invitation-ai-rg --query properties.template.containers[0].probes
```

### Frontend không kết nối được Backend
- Kiểm tra CORS settings
- Kiểm tra NEXT_PUBLIC_API_URL
- Kiểm tra backend ingress có external không

## Liên hệ & Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Azure Portal → Container Apps → Logs
2. Application Insights (nếu đã enable)
3. Azure Monitor

---
**Lưu ý**: Thay thế tất cả `YOUR_*` placeholders bằng giá trị thực tế của bạn.
