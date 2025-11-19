from sqlalchemy import Column, String, DateTime, Boolean, Float, Integer, ForeignKey, Text
from sqlalchemy.sql import func
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'teacher' or 'student'
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    room_code = Column(String, unique=True, nullable=False, index=True)
    teacher_id = Column(String, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    lock_mode_enabled = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class RoomParticipant(Base):
    __tablename__ = "room_participants"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)

class AttentionSample(Base):
    __tablename__ = "attention_samples"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("rooms.id"), nullable=False, index=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    attention_score = Column(Float, nullable=False)
    status = Column(String, nullable=False)

class StatusTimeline(Base):
    __tablename__ = "status_timeline"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("rooms.id"), nullable=False, index=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    duration_in_previous = Column(Integer, nullable=True)  # seconds

class TabSwitchEvent(Base):
    __tablename__ = "tab_switch_events"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("rooms.id"), nullable=False, index=True)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    lock_mode_active = Column(Boolean, nullable=False)
    was_blocked = Column(Boolean, nullable=False)

class ClassReport(Base):
    __tablename__ = "class_reports"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    generated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    total_duration = Column(Integer, nullable=False)  # seconds
    student_count = Column(Integer, nullable=False)
    average_attention = Column(Float, nullable=False)
    report_data = Column(Text, nullable=False)  # JSON string
