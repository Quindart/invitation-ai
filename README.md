# Graduation Invitation – Smart Graduation Invitation Web App

Graduate Invitation is a modern web application that allows multiple graduates to create and share personalized graduation invitation pages. Each graduate can generate unique access codes for their guests, while visitors can view event details and interact with an integrated AI chatbot for ceremony-related questions.

## Key Features

- Code-based authentication (6-digit)
- Personalized invitations
- Multi-graduate support
- AI chatbot (Azure OpenAI GPT)
- Responsive design
- Azure deployment-ready
- Modern frontend with Next.js + shadcn/ui

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- shadcn/ui
- Tailwind CSS
- HTML/CSS/JS (public static pages)

### Backend
- FastAPI
- Pydantic
- MongoDB
- Uvicorn
- Docker

### AI Integration
- Azure OpenAI GPT models

### DevOps
- Docker / Docker Compose
- Environment-based config

## Project Structure

```
invitation-ai/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── dashboard/
└── README.md
```

## Backend Setup

### Docker
```
docker build -t invitation-api .
docker run -p 8000:8000 invitation-api
```

### Manual
```
cd backend
uv venv
uv pip install -r requirements.txt
uv -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

### Public Page
```
cd frontend
python3 -m http.server 3000
```

### Admin Dashboard
```
cd frontend/dashboard
python3 -m http.server 3001
```

## Docker Compose
```
docker-compose up --build
```

## Roadmap

- Full Next.js migration
- Multi-language support
- QR-code invitations
- Dynamic OG images
