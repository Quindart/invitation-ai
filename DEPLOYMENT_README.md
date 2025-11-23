# 🎓 Graduation Invitation AI - Azure Deployment Guide

## 📋 Tổng quan

Ứng dụng thiệp mời tốt nghiệp với AI chatbot, được deploy lên Azure Container Apps.

### Kiến trúc
- **Frontend**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python 3.12)
- **Database**: MongoDB Atlas
- **Storage**: Azure Blob Storage
- **AI**: Azure OpenAI (GPT-4)
- **Hosting**: Azure Container Apps

## 🚀 Deployment nhanh

### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
# Full deployment (lần đầu)
./deploy.sh

# Update sau khi thay đổi code
./update.sh --all          # Update cả backend và frontend
./update.sh --backend      # Chỉ update backend
./update.sh --frontend     # Chỉ update frontend
```

### Cách 2: Manual deployment

Xem chi tiết trong file [DEPLOY_AZURE.md](./DEPLOY_AZURE.md)

## 📦 Chuẩn bị trước khi deploy

### 1. Cài đặt công cụ cần thiết

```bash
# Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Docker (nếu chưa có)
sudo apt-get update
sudo apt-get install docker.io
sudo usermod -aG docker $USER
```

### 2. Thông tin cần thiết

Chuẩn bị các thông tin sau:

- ✅ **MongoDB Connection String** (từ MongoDB Atlas)
- ✅ **Azure Storage Connection String**
- ✅ **Azure OpenAI Endpoint**
- ✅ **Azure OpenAI API Key**
- ✅ **Azure OpenAI Deployment Name** (vd: gpt-4)

### 3. Đăng nhập Azure

```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_NAME"
```

## 🏗️ Cấu trúc dự án

```
invitation-ai/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # Entry point
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── models/            # Data models
│   ├── Dockerfile             # Backend container
│   ├── requirements.txt
│   └── .dockerignore
├── frontend-next/              # Next.js frontend
│   ├── src/
│   │   ├── app/               # App router
│   │   └── components/        # React components
│   ├── Dockerfile             # Frontend container
│   ├── package.json
│   └── .dockerignore
├── deploy.sh                   # Full deployment script
├── update.sh                   # Quick update script
└── DEPLOY_AZURE.md            # Chi tiết deployment
```

## 🔧 Configuration

### Backend Environment Variables

```bash
MONGODB_URI=mongodb+srv://...
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### Frontend Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-backend.azurecontainerapps.io/api
```

## 📝 Workflow sau khi deploy

### 1. Test ứng dụng

```bash
# Lấy URLs
FRONTEND_URL=$(az containerapp show --name invitation-frontend --resource-group invitation-ai-rg --query properties.configuration.ingress.fqdn -o tsv)
BACKEND_URL=$(az containerapp show --name invitation-backend --resource-group invitation-ai-rg --query properties.configuration.ingress.fqdn -o tsv)

echo "Frontend: https://$FRONTEND_URL"
echo "Backend: https://$BACKEND_URL"
```

### 2. Xem logs

```bash
# Backend logs
az containerapp logs show --name invitation-backend -g invitation-ai-rg --follow

# Frontend logs
az containerapp logs show --name invitation-frontend -g invitation-ai-rg --follow
```

### 3. Update code

```bash
# Sau khi sửa code backend
./update.sh --backend

# Sau khi sửa code frontend
./update.sh --frontend

# Update cả 2
./update.sh --all
```

## 🛠️ Troubleshooting

### Lỗi "Image pull failed"

```bash
# Kiểm tra ACR credentials
az acr credential show --name invitationaicr

# Login lại
az acr login --name invitationaicr
```

### Lỗi CORS

Cập nhật `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.azurecontainerapps.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend không kết nối Backend

Kiểm tra environment variable:

```bash
az containerapp show --name invitation-frontend -g invitation-ai-rg --query properties.template.containers[0].env
```

## 💰 Chi phí ước tính

| Dịch vụ | Chi phí/tháng |
|---------|---------------|
| Container Apps | $20-50 |
| Container Registry | $5 |
| MongoDB Atlas | Free - $9 |
| Blob Storage | $2-5 |
| Azure OpenAI | Theo usage |
| **Tổng** | **$30-70** |

## 🔒 Security Best Practices

1. ✅ Sử dụng secrets cho sensitive data
2. ✅ Enable HTTPS (mặc định trên Container Apps)
3. ✅ Cấu hình CORS đúng
4. ✅ Limit scaling để tránh chi phí cao
5. ✅ Regular security updates

## 📊 Monitoring

### Application Insights (Optional)

```bash
# Enable Application Insights
az containerapp update \
  --name invitation-backend \
  --resource-group invitation-ai-rg \
  --enable-app-insights
```

### Metrics

```bash
# CPU & Memory usage
az monitor metrics list \
  --resource /subscriptions/{sub-id}/resourceGroups/invitation-ai-rg/providers/Microsoft.App/containerApps/invitation-backend \
  --metric "CpuPercentage,MemoryPercentage"
```

## 🔄 CI/CD (Future Enhancement)

Để tự động deploy khi push code:

1. Tạo GitHub Actions workflow
2. Configure Azure Service Principal
3. Auto build & push khi merge vào main
4. Auto deploy lên Container Apps

## 📚 Tài liệu tham khảo

- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

## 🆘 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra logs: `az containerapp logs show`
2. Kiểm tra Azure Portal
3. Review DEPLOY_AZURE.md
4. Check GitHub Issues

## 📄 License

MIT License - Free to use for educational and commercial purposes.

---

**Happy Deploying! 🚀**
