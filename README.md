# Graduation Invitation Web App

Ứng dụng web thiệp mời lễ tốt nghiệp - hỗ trợ nhiều người tốt nghiệp, mỗi người có thể gửi thiệp cho bạn bè với thông tin sự kiện của riêng họ.

## Tính Năng Chính

- **Xác thực bằng mã**: Nhập mã 6 số để truy cập thiệp mời
- **Thiệp mời cá nhân hóa**: Hiển thị tên người nhân và thông tin lễ tốt nghiệp tương ứng
- **Hỗ trợ nhiều người**: Mỗi người tốt nghiệp có thể tạo riêng invitation code cho bạn bè
- **Chatbot thông minh**: Hỏi thông tin về lễ tốt nghiệp bằng LLM (Azure OpenAI GPT)
- **Responsive Design**: Hoạt động tốt trên desktop, tablet, mobile
- **Azure Deployment**: Sẵn sàng deploy lên Azure Container Apps

##  Cấu Trúc Dự Án

```
invitation-ai/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/
│   │   │   └── schemas.py  # Pydantic models
│   │   ├── routes/
│   │   │   ├── graduates.py
│   │   │   ├── invitations.py
│   │   │   └── chatbot.py
│   │   ├── services/
│   │   │   ├── graduate_service.py
│   │   │   ├── invitation_service.py
│   │   │   └── chatbot_service.py
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # MongoDB connection
│   │   └── main.py         # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── .env               # (Tạo từ .env.example)
├── frontend/               # Frontend HTML/CSS/JS (Public pages)
│   ├── index.html          # Public invitation viewing page
│   ├── style.css
│   ├── script.js
│   ├── serve.py           # Multi-port server script
│   └── dashboard/         # Admin dashboard (Private)
│       ├── index.html
│       ├── style.css
│       └── script.js
└── README.md
```

##  Cài Đặt

### Backend

#### Chạy bằng Dockerfile
1. **Build Dockerfile**
```bash
docker build -t invitation-api .
```

2. **Run**
```bash
docker run -p 8000:8000 invitation-api
```


#### Setup Manual
1. **Clone repository và vào thư mục backend:**
```bash
cd backend
```

2. **Tạo virtual environment:**
```bash
uv venv
```

3. **Cài đặt dependencies:**
```bash
uv pip install -r requirements.txt
```

5. **Chạy server:**
```bash
uv -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend sẽ chạy tại: http://localhost:8000

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend

Frontend hiện có 2 phần riêng biệt:
- **Public Page** (port 3000): Trang công khai cho khách xem thiệp mời
- **Admin Dashboard** (port 3001): Trang quản lý cho người tốt nghiệp (yêu cầu code bảo mật)

#### Option 1: Chạy riêng từng phần (Recommended)

**Public page (port 3000):**
```bash
cd frontend
python3 -m http.server 3000
```

**Admin dashboard (port 3001):**
```bash
cd frontend/dashboard
python3 -m http.server 3001
```

Truy cập:
- Public: http://localhost:3000
- Admin:  http://localhost:3001 (mã bảo mật xem code)

#### Option 2: Dùng Docker Compose (All-in-One)

Khởi động toàn bộ hệ thống (backend + mongo + frontend):
```bash
docker-compose up
```

Services sẽ tự động chạy tại:
- Backend API: http://localhost:8000
- Public Page: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- MongoDB: localhost:27017
