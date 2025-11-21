# Admin Dashboard Guide

Admin Dashboard là nơi quản lý toàn bộ thông tin người tốt nghiệp và tạo invitation codes cho khách mời.

## 🌐 Truy Cập

```
Admin Dashboard: http://localhost:3001
```

## 🎯 Tính Năng Chính

### 1. Quản Lý Người Tốt Nghiệp (Tab "Người Tốt Nghiệp")

#### Tạo Người Tốt Nghiệp Mới

Form bao gồm các trường:

**Thông Tin Cơ Bản:**
- **Tên Người Tốt Nghiệp** *: Họ tên đầy đủ
- **Bằng Cấp** *: Bachelor / Master / PhD
- **Ngành Học** *: Tên ngành (VD: Computer Science)
- **Ngày Tốt Nghiệp** *: Chọn ngày (date picker)
- **Giờ Tốt Nghiệp** *: Chọn giờ (time picker)

**Thông Tin Địa Điểm:**
- **Tên Địa Điểm** *: (VD: Hội Trường A)
- **Địa Chỉ** *: (VD: 123 Đường ABC, Hà Nội)
- **Chỗ Đậu Xe**: (Optional, VD: B3, B4)

**Thông Tin Liên Hệ:**
- **Email** *: Email liên hệ
- **Điện Thoại** *: Số điện thoại

**Ảnh (Optional):**
- Có thể thêm multiple ảnh bằng URL
- Click "+ Thêm Ảnh" để thêm ảnh khác
- Click "Xóa" để loại bỏ ảnh

**Mẫu Thiệp (Optional):**
- HTML hoặc text custom cho thiệp mời

**Bước thực hiện:**
1. Điền đầy đủ thông tin (các trường có * là bắt buộc)
2. Click "Tạo Người Tốt Nghiệp"
3. Sẽ nhận được thông báo thành công với Graduation ID

#### Xem Danh Sách Người Tốt Nghiệp

- Mỗi card hiển thị:
  - Tên, bằng cấp, ngành học
  - Email, điện thoại
  - Graduation ID (để copy)
  - Ảnh preview (nếu có)

### 2. Tạo Thiệp Mời (Tab "Tạo Thiệp")

**Bước thực hiện:**

1. **Chọn Người Tốt Nghiệp:**
   - Dropdown "Chọn Người Tốt Nghiệp"
   - Sẽ liệt kê tất cả graduates đã tạo

2. **Nhập Danh Sách Người Được Mời:**
   - Nhập tên từng người (VD: "Nguyễn Văn A")
   - Click "+ Thêm Người" để thêm hàng mới
   - Click "Xóa" để loại bỏ người nào đó

3. **Tạo Thiệp:**
   - Click "Tạo Thiệp Mời"
   - Mỗi người được mời sẽ nhận 1 invitation code (6 chữ số)
   - Thông báo sẽ hiển thị số lượng thiệp vừa tạo

4. **Copy Mã Thiệp:**
   - Các mã sẽ hiển thị trong danh sách dưới
   - Mỗi card hiển thị: Tên người, Mã thiệp
   - Click vào mã để copy (hoặc drag to select)

**Ví dụ:**
```
Tạo 3 thiệp cho Nguyễn A:
- Nguyễn Văn A → 123456
- Trần Thị B → 234567
- Hoàng Văn C → 345678
```

## 📋 Workflow Tiêu Biểu

### Scenario: Tạo lễ tốt nghiệp cho Nguyễn A

**Bước 1:** Tạo Graduates
- Tab "Người Tốt Nghiệp" → Form "Tạo Thông Tin Người Tốt Nghiệp"
- Điền: Nguyễn A, Bachelor, Computer Science, 2024-06-15, 10:00, etc.
- Click "Tạo Người Tốt Nghiệp"
- Ghi nhớ Graduation ID: `12345abc...`

**Bước 2:** Tạo Invitations
- Tab "Tạo Thiệp"
- Chọn "Nguyễn A" từ dropdown
- Nhập danh sách bạn bè:
  - Nguyễn Văn B
  - Trần Thị C
  - Hoàng Văn D
  - etc.
- Click "Tạo Thiệp Mời"
- Sẽ tạo 3 invitation codes

**Bước 3:** Phân phối Codes
- Copy mã từ dashboard
- Gửi cho bạn bè: "Mã thiệp của bạn: 123456"
- Họ vào http://localhost:3000 → Nhập code → Xem thiệp

## 🔗 Tích Hợp

### Link Giữa Public Page và Dashboard

- **Từ Dashboard → Public:** "Xem Thiệp Công Khai" link ở navbar
- **Từ Public → Dashboard:** Hiện tại không có link trực tiếp (có thể thêm password-protected link sau)

### API Endpoints Dùng

Dashboard gửi requests đến backend API:
- `POST /api/graduates` - Tạo graduate
- `GET /api/graduates` - Lấy danh sách
- `POST /api/invitations` - Tạo invitation codes
- `POST /api/invitations/verify` - Xác thực code (dùng bởi public page)

## 🔒 Bảo Mật

> **Lưu ý:** Hiện tại dashboard không có authentication. 
> Để production, cần thêm:
> - Password protection
> - JWT tokens
> - Role-based access control

Xem DEPLOYMENT.md để hướng dẫn bảo mật.

## 🆘 Troubleshooting

### "Lỗi tải dữ liệu" khi vào tab Người Tốt Nghiệp

**Nguyên nhân:** Backend không chạy hoặc API URL sai
**Giải pháp:**
```bash
# Kiểm tra backend đang chạy
curl http://localhost:8000/docs

# Nếu không chạy, start backend
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### "Lỗi tạo graduate" - Detail: ...

**Nguyên nhân:** Validation error hoặc field missing
**Kiểm tra:**
- Tất cả trường * đều được điền
- Email hợp lệ (VD: user@example.com)
- Điện thoại có format (VD: +84912345678)
- Datetime hợp lệ (ngày >= hôm nay)

### Dashboard không load CSS/JS

**Nguyên nhân:** Serve script không chạy đúng cách
**Giải pháp:**
```bash
cd frontend
python serve.py

# Hoặc serve từng cái
python -m http.server 3001  # Từ frontend/dashboard
```

## 📝 Development Notes

- Dashboard được build với vanilla JavaScript (không có framework)
- Communicate với backend qua REST API (fetch)
- UI framework: CSS Grid + Flexbox (responsive)
- Themes: Purple gradient (#667eea - #764ba2)

## 🚀 Deploy Dashboard

Khi deploy lên production:

1. **Cập nhật API_URL trong `script.js`:**
```javascript
const API_URL = 'https://api.yourdomain.com/api';  // Production URL
```

2. **Thêm authentication** (recommended)

3. **Serve từ CDN hoặc container**

Xem DEPLOYMENT.md để chi tiết.
