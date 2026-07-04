from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, statements, export
from database import init_db, SessionLocal
import sys
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Initialize database
init_db()

# Dependency for DB sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="Lekhai AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(statements.router, prefix="/api/statements", tags=["Statements"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])

@app.get("/")
def read_root():
    return {"message": "Lekhai AI Backend is running"}
