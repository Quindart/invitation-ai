from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import mongo_db
from app.routes import graduates, invitations, chatbot

# Create FastAPI app
app = FastAPI(
    title="Graduation Invitation API",
    description="API for managing graduation invitations and chatbot",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(graduates.router)
app.include_router(invitations.router)
app.include_router(chatbot.router)

@app.on_event("startup")
async def startup():
    """Initialize database connection on startup"""
    mongo_db.connect()
    print("Application startup - MongoDB connected")

@app.on_event("shutdown")
async def shutdown():
    """Close database connection on shutdown"""
    mongo_db.disconnect()
    print("Application shutdown - MongoDB disconnected")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Graduation Invitation API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
