


# 🎓 API Backend Lễ Tốt Nghiệp - Tài liệu chi tiết

---

## 1. Quản lý người tốt nghiệp (Graduates)

### Tạo mới người tốt nghiệp
**POST /api/graduates**

**Request body:**
```json
{
  "name": "Thái Quang",
  "degree": "Bachelor of Science",
  "department": "Computer Science",
  "graduation_datetime": "2025-12-20T10:00:00Z",
  "venue": {
    "name": "University Auditorium",
    "address": "123 Main St",
    "parking": "Lot B"
  },
  "invitation_template": null,
  "contact": {
    "email": "thai@example.com",
    "phone": "+84912345678"
  },
  "photo_urls": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ]
}
```

**Response:**
```json
{
  "message": "Graduate created successfully",
  "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

### Lấy thông tin người tốt nghiệp
**GET /api/graduates/{graduate_id}**

**Response:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Thái Quang",
  "degree": "Bachelor of Science",
  "department": "Computer Science",
  "graduation_datetime": "2025-12-20T10:00:00Z",
  "venue": {
    "name": "University Auditorium",
    "address": "123 Main St",
    "parking": "Lot B"
  },
  "invitation_template": null,
  "contact": {
    "email": "thai@example.com",
    "phone": "+84912345678"
  },
  "photo_urls": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ]
}
```

---

### Cập nhật thông tin người tốt nghiệp
**PUT /api/graduates/{graduate_id}**

**Request body:**
```json
{
  "photo_urls": ["https://example.com/photo3.jpg"]
}
```
**Response:**
```json
{
  "message": "Graduate updated successfully",
  "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

---

### Lấy danh sách người tốt nghiệp
**GET /api/graduates**

**Response:**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Thái Quang",
    "degree": "Bachelor of Science",
    "department": "Computer Science",
    "graduation_datetime": "2025-12-20T10:00:00Z",
    "venue": {
      "name": "University Auditorium",
      "address": "123 Main St",
      "parking": "Lot B"
    },
    "invitation_template": null,
    "contact": {
      "email": "thai@example.com",
      "phone": "+84912345678"
    },
    "photo_urls": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ]
  },
  ...
]
```

---

### Upload ảnh cho người tốt nghiệp
**POST /api/graduates/{graduate_id}/photos**

**Request:**
- Form-data: file (image/jpeg, image/png, image/gif, image/webp, tối đa 5MB)

**Response:**
```json
{
  "photo_url": "https://storage.azure.com/...",
  "file_name": "photo.jpg"
}
```

---

## 2. Quản lý mã mời (Invitations)

### Tạo mã mời cho khách
**POST /api/invitations**

**Request body:**
```json
{
  "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "guest_names": ["Nguyễn Văn A", "Trần Thị B", "Hoàng Văn C"]
}
```

**Response:**
```json
{
  "message": "3 invitation(s) created successfully",
  "invitations": [
    {
      "invitation_code": "123456",
      "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "guest_name": "Nguyễn Văn A"
    },
    {
      "invitation_code": "234567",
      "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "guest_name": "Trần Thị B"
    },
    {
      "invitation_code": "345678",
      "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "guest_name": "Hoàng Văn C"
    }
  ]
}
```

---

### Xác thực mã mời
**POST /api/invitations/verify**

**Request body:**
```json
{
  "invitation_code": "123456"
}
```

**Response:**
```json
{
  "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "guest_name": "Nguyễn Văn A",
  "graduate_info": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Thái Quang",
    "degree": "Bachelor of Science",
    "department": "Computer Science",
    "graduation_datetime": "2025-12-20T10:00:00Z",
    "venue": {
      "name": "University Auditorium",
      "address": "123 Main St",
      "parking": "Lot B"
    },
    "invitation_template": null,
    "contact": {
      "email": "thai@example.com",
      "phone": "+84912345678"
    },
    "photo_urls": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ]
  }
}
```

---

### Lấy danh sách mã mời
**GET /api/invitations**

**Query:**
- graduate_id (tùy chọn): lọc theo người tốt nghiệp

**Response:**
```json
[
  {
    "_id": "...",
    "invitation_code": "123456",
    "graduate_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "guest_name": "Nguyễn Văn A"
  },
  ...
]
```

---

## 3. Chatbot lễ tốt nghiệp

### Chat với chatbot
**POST /api/graduates/{graduate_id}/chat**

**Request body:**
```json
{
  "message": "Lễ tốt nghiệp lúc mấy giờ?"
}
```

**Response:**
```json
{
  "response": "Lễ tốt nghiệp sẽ diễn ra vào 10h sáng ngày 20 tháng 12..."
}
```

---

## 4. Cấu trúc dữ liệu MongoDB

### graduates collection
```javascript
{
  _id: ObjectId,
  name: String,
  degree: String,
  department: String,
  graduation_datetime: Date,
  venue: {
    name: String,
    address: String,
    parking: String
  },
  invitation_template: String,  // Optional
  contact: {
    email: String,
    phone: String
  },
  photo_urls: [String]
}
```

### invitations collection
```javascript
{
  _id: ObjectId,
  invitation_code: String,  // 6 ký tự, duy nhất
  graduate_id: String,      // Tham chiếu graduates._id
  guest_name: String        // Tên khách mời
}
```

---

## 5. Chatbot Azure OpenAI

Chatbot sử dụng **Azure OpenAI GPT API** để tự động trả lời các câu hỏi liên quan đến lễ tốt nghiệp:
- Thời gian, địa điểm, chỗ đậu xe
- Thông tin liên hệ người tốt nghiệp
- Từ chối các câu hỏi không liên quan

**Yêu cầu:** Cần có Azure OpenAI instance đã deploy với GPT model.

---

## 6. Liên hệ & Hỗ trợ

Nếu có thắc mắc về API hoặc cần hỗ trợ kỹ thuật, vui lòng liên hệ đội phát triển qua email hoặc các kênh nội bộ.

## 💾 MongoDB Schema

### graduates collection
```javascript
{
  _id: ObjectId,
  name: String,
  degree: String,
  department: String,
  graduation_datetime: Date,
  venue: {
    name: String,
    address: String,
    parking: String
  },
  invitation_template: String,  // Optional
  contact: {
    email: String,
    phone: String
  }
}
```

### invitations collection
```javascript
{
  _id: ObjectId,
  invitation_code: String,  // 6-digit unique code
  graduate_id: String       // References graduates._id
}
```

## 🤖 Chatbot

Chatbot được hỗ trợ bằng **Azure OpenAI GPT API**. Nó được thiết kế để:

- ✅ Trả lời câu hỏi về thông tin lễ tốt nghiệp
- ✅ Cung cấp chi tiết về thời gian, địa điểm, chỗ đậu xe
- ✅ Cho phép liên hệ với người tốt nghiệp
- ❌ Từ chối trả lời câu hỏi không liên quan

**Yêu cầu:** Cần có Azure OpenAI instance được deploy với GPT model
