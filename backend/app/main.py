from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import os
from .database import init_db
from .routers import auth, room, reports
from .websocket import register_socket_events

app = FastAPI(title="FocusMate API", version="1.0.0")

# Get allowed origins from environment variable
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [FRONTEND_URL]

# Add localhost for development
if "localhost" not in FRONTEND_URL:
    allowed_origins.append("http://localhost:5173")
    allowed_origins.append("http://localhost:3000")

# Add Vercel deployments support (all subdomains)
if "vercel.app" in FRONTEND_URL:
    # Allow all Vercel preview deployments
    allowed_origins.append("https://*.vercel.app")

print(f"🌐 CORS allowed origins: {allowed_origins}")
print(f"🔑 Frontend URL: {FRONTEND_URL}")

# CORS middleware with wildcard support for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app" if "vercel.app" in FRONTEND_URL else None,
    allow_origins=allowed_origins if "vercel.app" not in FRONTEND_URL else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(room.router)
app.include_router(reports.router)

print("📊 Reports router included successfully")
print("🔗 Available routes:")
for route in app.routes:
    if hasattr(route, 'path'):
        print(f"  {route.methods} {route.path}")

# Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=allowed_origins
)

# Register WebSocket events
register_socket_events(sio)

socket_app = socketio.ASGIApp(sio, app)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("Database initialized")
    print("WebSocket server ready")

@app.get("/")
async def root():
    return {"message": "FocusMate API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
