from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Room, RoomParticipant, User
from ..schemas import RoomCreate, RoomResponse, RoomJoin
from ..auth import get_current_teacher, get_current_student, get_current_user
from ..utils import generate_room_code

router = APIRouter(prefix="/room", tags=["rooms"])

@router.post("/create", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """Create a new classroom session (teachers only)"""
    # Generate unique room code
    room_code = generate_room_code()
    while db.query(Room).filter(Room.room_code == room_code).first():
        room_code = generate_room_code()
    
    # Create room
    new_room = Room(
        room_code=room_code,
        teacher_id=current_user.id,
        is_active=True,
        lock_mode_enabled=False
    )
    
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    
    return new_room

@router.post("/join")
async def join_room(
    room_data: RoomJoin,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Join a classroom session (students only)"""
    # Find room
    room = db.query(Room).filter(
        Room.room_code == room_data.room_code,
        Room.is_active == True
    ).first()
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found or inactive"
        )
    
    # Check if already joined
    existing = db.query(RoomParticipant).filter(
        RoomParticipant.room_id == room.id,
        RoomParticipant.student_id == current_user.id,
        RoomParticipant.left_at == None
    ).first()
    
    if existing:
        return {"message": "Already in room", "room_id": room.id}
    
    # Create participant record
    participant = RoomParticipant(
        room_id=room.id,
        student_id=current_user.id
    )
    
    db.add(participant)
    db.commit()
    
    return {"message": "Joined room successfully", "room_id": room.id}

@router.post("/leave")
async def leave_room(
    room_id: str,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Leave a classroom session"""
    participant = db.query(RoomParticipant).filter(
        RoomParticipant.room_id == room_id,
        RoomParticipant.student_id == current_user.id,
        RoomParticipant.left_at == None
    ).first()
    
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not in this room"
        )
    
    participant.left_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Left room successfully"}

@router.get("/{room_id}/students")
async def get_room_students(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all students in a room"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    participants = db.query(RoomParticipant, User).join(
        User, RoomParticipant.student_id == User.id
    ).filter(
        RoomParticipant.room_id == room_id,
        RoomParticipant.left_at == None
    ).all()
    
    students = [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "joined_at": participant.joined_at
        }
        for participant, user in participants
    ]
    
    return {"students": students}

@router.get("/{room_id}/teacher")
async def get_room_teacher(
    room_id: str,
    db: Session = Depends(get_db)
):
    """Get room teacher info"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    teacher = db.query(User).filter(User.id == room.teacher_id).first()
    return {
        "id": teacher.id,
        "name": teacher.name,
        "email": teacher.email
    }

@router.put("/{room_id}/lockmode")
async def toggle_lockmode(
    room_id: str,
    enabled: bool,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """Toggle LockMode for a room (teachers only)"""
    room = db.query(Room).filter(
        Room.id == room_id,
        Room.teacher_id == current_user.id
    ).first()
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found or not authorized"
        )
    
    room.lock_mode_enabled = enabled
    db.commit()
    
    return {"message": "LockMode updated", "lock_mode_enabled": enabled}

@router.delete("/{room_id}")
async def end_session(
    room_id: str,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """End a classroom session (teachers only)"""
    room = db.query(Room).filter(
        Room.id == room_id,
        Room.teacher_id == current_user.id
    ).first()
    
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found or not authorized"
        )
    
    room.is_active = False
    room.end_time = datetime.utcnow()
    
    # Mark all participants as left
    participants = db.query(RoomParticipant).filter(
        RoomParticipant.room_id == room_id,
        RoomParticipant.left_at == None
    ).all()
    
    for participant in participants:
        participant.left_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Session ended successfully"}
