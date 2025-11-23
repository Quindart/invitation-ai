# Graduation Invitation – Smart Graduation Invitation Web App


![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black)

![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![Uvicorn](https://img.shields.io/badge/Uvicorn-0.30-499848)

![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)

![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-GPT-blue?logo=microsoft-azure)

![Docker](https://img.shields.io/badge/Docker-26-2496ED?logo=docker)
![Docker Compose](https://img.shields.io/badge/Compose-2.29-2496ED?logo=docker)

Graduate Invitation is a modern web application that allows multiple graduates to create and share personalized graduation invitation pages. Each graduate can generate unique access codes for their guests, while visitors can view event details and interact with an integrated AI chatbot for ceremony-related questions.

## Key Features

- Code-based authentication (6-digit)
- Personalized invitations
- Multi-graduate support
- AI chatbot (Azure OpenAI GPT)
- Responsive design
- Azure deployment-ready
- Modern frontend with Next.js + shadcn/ui

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
