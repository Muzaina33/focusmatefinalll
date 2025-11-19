"""
Database initialization script
Creates all tables and indexes
"""
from .database import engine, Base, init_db
from .models import User, Room, RoomParticipant, AttentionSample, StatusTimeline, TabSwitchEvent, ClassReport

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully!")
    
    # Create indexes
    print("Creating indexes...")
    from sqlalchemy import Index
    
    # Indexes are already defined in models via index=True
    # Additional composite indexes can be added here if needed
    
    print("Database initialization complete!")

if __name__ == "__main__":
    create_tables()
