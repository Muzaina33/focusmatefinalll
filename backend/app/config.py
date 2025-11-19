from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./focusmate.db"
    # Use SECRET_KEY from environment, fallback to JWT_SECRET for compatibility
    JWT_SECRET: str = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET") or "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    class Config:
        env_file = ".env"

settings = Settings()

# Print configuration on startup (without exposing secret)
print(f"🔧 Database: {settings.DATABASE_URL}")
print(f"🔑 JWT Secret configured: {'Yes' if settings.JWT_SECRET != 'your-secret-key-change-in-production' else 'No (using default!)'}")
print(f"⏰ Token expiry: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
