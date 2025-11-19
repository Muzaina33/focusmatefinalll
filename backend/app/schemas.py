from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Auth schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str  # 'teacher' or 'student'
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Room schemas
class RoomCreate(BaseModel):
    pass

class RoomResponse(BaseModel):
    id: str
    room_code: str
    teacher_id: str
    start_time: datetime
    lock_mode_enabled: bool
    is_active: bool
    
    class Config:
        from_attributes = True

class RoomJoin(BaseModel):
    room_code: str

# Attention schemas
class AttentionUpdate(BaseModel):
    student_id: str
    session_id: str
    attention_score: float
    status: str
    timestamp: datetime
