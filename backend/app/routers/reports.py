from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Room, User, AttentionSample, StatusTimeline, TabSwitchEvent, ClassReport
from ..auth import get_current_user, get_current_teacher, get_current_student
import json
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/teacher/{teacher_id}/sessions")
async def get_teacher_sessions(
    teacher_id: str,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """Get all sessions for a teacher"""
    if current_user.id != teacher_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    sessions = db.query(Room).filter(
        Room.teacher_id == teacher_id,
        Room.end_time != None
    ).order_by(Room.start_time.desc()).all()
    
    result = []
    for session in sessions:
        # Calculate summary metrics
        avg_attention = db.query(func.avg(AttentionSample.attention_score)).filter(
            AttentionSample.session_id == session.id
        ).scalar() or 0
        
        student_count = db.query(func.count(func.distinct(AttentionSample.student_id))).filter(
            AttentionSample.session_id == session.id
        ).scalar() or 0
        
        result.append({
            'id': session.id,
            'room_code': session.room_code,
            'start_time': session.start_time,
            'end_time': session.end_time,
            'duration': (session.end_time - session.start_time).total_seconds() if session.end_time else 0,
            'student_count': student_count,
            'average_attention': round(avg_attention, 1)
        })
    
    return {'sessions': result}

@router.get("/session/{session_id}")
async def get_session_report(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed report for a session"""
    session = db.query(Room).filter(Room.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get all students in session
    students = db.query(AttentionSample.student_id, User.name).join(
        User, AttentionSample.student_id == User.id
    ).filter(
        AttentionSample.session_id == session_id
    ).distinct().all()
    
    student_reports = []
    for student_id, student_name in students:
        # Get attention samples
        samples = db.query(AttentionSample).filter(
            AttentionSample.session_id == session_id,
            AttentionSample.student_id == student_id
        ).all()
        
        avg_attention = sum(s.attention_score for s in samples) / len(samples) if samples else 0
        
        # Get status timeline
        timeline = db.query(StatusTimeline).filter(
            StatusTimeline.session_id == session_id,
            StatusTimeline.student_id == student_id
        ).order_by(StatusTimeline.timestamp).all()
        
        # Get tab switches
        tab_switches = db.query(TabSwitchEvent).filter(
            TabSwitchEvent.session_id == session_id,
            TabSwitchEvent.student_id == student_id
        ).count()
        
        student_reports.append({
            'student_id': student_id,
            'name': student_name,
            'final_attention_score': round(avg_attention, 1),
            'status_timeline': [
                {
                    'timestamp': t.timestamp,
                    'status': t.new_status,
                    'duration': t.duration_in_previous
                } for t in timeline
            ],
            'tab_switch_count': tab_switches
        })
    
    return {
        'session': {
            'id': session.id,
            'room_code': session.room_code,
            'start_time': session.start_time,
            'end_time': session.end_time
        },
        'students': student_reports
    }

@router.get("/student/{student_id}/sessions")
async def get_student_sessions(
    student_id: str,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get all sessions for a student"""
    if current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get sessions where student participated
    sessions = db.query(Room).join(
        AttentionSample, Room.id == AttentionSample.session_id
    ).filter(
        AttentionSample.student_id == student_id,
        Room.end_time != None
    ).distinct().order_by(Room.start_time.desc()).all()
    
    result = []
    for session in sessions:
        # Calculate student's average attention
        avg_attention = db.query(func.avg(AttentionSample.attention_score)).filter(
            AttentionSample.session_id == session.id,
            AttentionSample.student_id == student_id
        ).scalar() or 0
        
        result.append({
            'id': session.id,
            'room_code': session.room_code,
            'start_time': session.start_time,
            'end_time': session.end_time,
            'my_attention_score': round(avg_attention, 1)
        })
    
    return {'sessions': result}

@router.get("/student/{student_id}/session/{session_id}")
async def get_student_session_report(
    student_id: str,
    session_id: str,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get detailed report for a student's session"""
    if current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    session = db.query(Room).filter(Room.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get attention samples
    samples = db.query(AttentionSample).filter(
        AttentionSample.session_id == session_id,
        AttentionSample.student_id == student_id
    ).all()
    
    avg_attention = sum(s.attention_score for s in samples) / len(samples) if samples else 0
    
    # Get status timeline
    timeline = db.query(StatusTimeline).filter(
        StatusTimeline.session_id == session_id,
        StatusTimeline.student_id == student_id
    ).order_by(StatusTimeline.timestamp).all()
    
    # Get tab switches
    tab_switches = db.query(TabSwitchEvent).filter(
        TabSwitchEvent.session_id == session_id,
        TabSwitchEvent.student_id == student_id
    ).all()
    
    return {
        'session': {
            'id': session.id,
            'room_code': session.room_code,
            'start_time': session.start_time,
            'end_time': session.end_time
        },
        'final_attention_score': round(avg_attention, 1),
        'status_timeline': [
            {
                'timestamp': t.timestamp,
                'status': t.new_status,
                'duration': t.duration_in_previous
            } for t in timeline
        ],
        'tab_switch_events': [
            {
                'timestamp': t.timestamp,
                'was_blocked': t.was_blocked
            } for t in tab_switches
        ]
    }
