from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.seed_data import seed_database

# Ensure models are imported so Base.metadata knows about them
import app.models

# Create tables immediately
Base.metadata.create_all(bind=engine)
# Seed database if empty
_db = SessionLocal()
try:
    seed_database(_db)
finally:
    _db.close()

# Routers
from app.api.schemes import router as schemes_router
from app.api.services import router as services_router
from app.api.civic import router as civic_router
from app.api.helplines import router as helplines_router
from app.api.tutorials import router as tutorials_router
from app.api.assistant import router as assistant_router
from app.api.voice import router as voice_router
from app.api.saved_tasks import router as saved_tasks_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables and seed data are ready
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="JanSetu AI — One Platform. Every Citizen. Clear Next Steps. Official Multilingual Public Services API.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api prefix
app.include_router(schemes_router, prefix="/api")
app.include_router(services_router, prefix="/api")
app.include_router(civic_router, prefix="/api")
app.include_router(helplines_router, prefix="/api")
app.include_router(tutorials_router, prefix="/api")
app.include_router(assistant_router, prefix="/api")
app.include_router(voice_router, prefix="/api")
app.include_router(saved_tasks_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "JanSetu AI API",
        "tagline": "One Platform. Every Citizen. Clear Next Steps.",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "JanSetu AI Backend",
        "database": "connected",
        "version": settings.VERSION
    }
