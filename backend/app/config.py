from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Support both PostgreSQL (production) and SQLite (local dev)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./focusmate.db")
    
    # Use SECRET_KEY from environment, fallback to JWT_SECRET for compatibility
    JWT_SECRET: str = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET") or "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    class Config:
        env_file = ".env"

settings = Settings()

# Fix Render's postgres:// to postgresql:// (SQLAlchemy requirement)
if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Print configuration on startup (without exposing secret)
db_type = "PostgreSQL" if "postgresql" in settings.DATABASE_URL else "SQLite"
print(f"🔧 Database: {db_type}")
print(f"🔑 JWT Secret configured: {'Yes' if settings.JWT_SECRET != 'your-secret-key-change-in-production' else 'No (using default!)'}")
print(f"⏰ Token expiry: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
