"""
WebSocket event handlers for real-time communication
"""
import socketio
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User, Room
from .auth import decode_token

# Active sessions: {session_id: {user_id: sid}}
active_sessions = {}

async def get_user_from_token(token: str, db: Session) -> User:
    """Get user from JWT token"""
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except:
        return None

def register_socket_events(sio: socketio.AsyncServer):
    """Register all Socket.IO event handlers"""
    
    @sio.event
    async def connect(sid, environ, auth):
        """Handle client connection"""
        print(f"Client connected: {sid}")
        if auth and 'token' in auth:
            db = SessionLocal()
            try:
                user = await get_user_from_token(auth['token'], db)
                if user:
                    # Store user info in session
                    await sio.save_session(sid, {'user_id': user.id, 'role': user.role})
                    print(f"User authenticated: {user.email}")
            finally:
                db.close()
    
    @sio.event
    async def disconnect(sid):
        """Handle client disconnection"""
        print(f"Client disconnected: {sid}")
        session = await sio.get_session(sid)
        if session:
            user_id = session.get('user_id')
            # Remove from active sessions
            for session_id, users in active_sessions.items():
                if user_id in users:
                    del users[user_id]
                    # Notify others in the session
                    await sio.emit('student_left', {'user_id': user_id}, room=session_id)
    
    @sio.event
    async def join_session(sid, data):
        """Handle user joining a session"""
        session = await sio.get_session(sid)
        if not session:
            return {'error': 'Not authenticated'}
        
        session_id = data.get('session_id')
        user_id = session.get('user_id')
        
        # Join Socket.IO room
        await sio.enter_room(sid, session_id)
        
        # Track in active sessions
        if session_id not in active_sessions:
            active_sessions[session_id] = {}
        active_sessions[session_id][user_id] = sid
        
        # Notify others
        await sio.emit('student_joined', {
            'user_id': user_id,
            'session_id': session_id
        }, room=session_id, skip_sid=sid)
        
        return {'status': 'joined', 'session_id': session_id}
    
    @sio.event
    async def leave_session(sid, data):
        """Handle user leaving a session"""
        session = await sio.get_session(sid)
        if not session:
            return {'error': 'Not authenticated'}
        
        session_id = data.get('session_id')
        user_id = session.get('user_id')
        
        # Leave Socket.IO room
        await sio.leave_room(sid, session_id)
        
        # Remove from active sessions
        if session_id in active_sessions and user_id in active_sessions[session_id]:
            del active_sessions[session_id][user_id]
        
        # Notify others
        await sio.emit('student_left', {
            'user_id': user_id,
            'session_id': session_id
        }, room=session_id)
        
        return {'status': 'left'}
    
    @sio.event
    async def toggle_lockmode(sid, data):
        """Handle LockMode toggle (teachers only)"""
        session = await sio.get_session(sid)
        if not session or session.get('role') != 'teacher':
            return {'error': 'Not authorized'}
        
        session_id = data.get('session_id')
        enabled = data.get('enabled')
        
        # Broadcast to all students in session
        await sio.emit('lockmode_changed', {
            'session_id': session_id,
            'enabled': enabled
        }, room=session_id)
        
        return {'status': 'broadcasted'}
    
    @sio.event
    async def mute_student(sid, data):
        """Handle muting a student (teachers only)"""
        session = await sio.get_session(sid)
        if not session or session.get('role') != 'teacher':
            return {'error': 'Not authorized'}
        
        session_id = data.get('session_id')
        student_id = data.get('student_id')
        
        # Send to specific student
        if session_id in active_sessions and student_id in active_sessions[session_id]:
            target_sid = active_sessions[session_id][student_id]
            await sio.emit('student_muted', {'muted': True}, room=target_sid)
        
        return {'status': 'sent'}
    
    @sio.event
    async def camera_off_student(sid, data):
        """Handle turning off student camera (teachers only)"""
        session = await sio.get_session(sid)
        if not session or session.get('role') != 'teacher':
            return {'error': 'Not authorized'}
        
        session_id = data.get('session_id')
        student_id = data.get('student_id')
        
        # Send to specific student
        if session_id in active_sessions and student_id in active_sessions[session_id]:
            target_sid = active_sessions[session_id][student_id]
            await sio.emit('camera_off', {'camera_off': True}, room=target_sid)
        
        return {'status': 'sent'}
    
    @sio.event
    async def kick_student(sid, data):
        """Handle kicking a student (teachers only)"""
        session = await sio.get_session(sid)
        if not session or session.get('role') != 'teacher':
            return {'error': 'Not authorized'}
        
        session_id = data.get('session_id')
        student_id = data.get('student_id')
        
        # Send to specific student
        if session_id in active_sessions and student_id in active_sessions[session_id]:
            target_sid = active_sessions[session_id][student_id]
            await sio.emit('student_kicked', {}, room=target_sid)
            await sio.disconnect(target_sid)
        
        return {'status': 'kicked'}
    
    @sio.event
    async def ai_update(sid, data):
        """Handle AI attention updates"""
        from datetime import datetime
        from .models import AttentionSample, StatusTimeline
        
        session_id = data.get('session_id')
        student_id = data.get('student_id')
        attention_score = data.get('attention_score')
        status = data.get('status')
        
        # Store attention sample in database
        db = SessionLocal()
        try:
            # Create attention sample
            sample = AttentionSample(
                session_id=session_id,
                student_id=student_id,
                attention_score=attention_score,
                status=status
            )
            db.add(sample)
            
            # Check for status change
            last_timeline = db.query(StatusTimeline).filter(
                StatusTimeline.session_id == session_id,
                StatusTimeline.student_id == student_id
            ).order_by(StatusTimeline.timestamp.desc()).first()
            
            if not last_timeline or last_timeline.new_status != status:
                # Status changed - create timeline entry
                duration = None
                if last_timeline:
                    duration = int((datetime.utcnow() - last_timeline.timestamp).total_seconds())
                
                timeline_entry = StatusTimeline(
                    session_id=session_id,
                    student_id=student_id,
                    previous_status=last_timeline.new_status if last_timeline else None,
                    new_status=status,
                    duration_in_previous=duration
                )
                db.add(timeline_entry)
            
            db.commit()
        finally:
            db.close()
        
        # Broadcast to session (teacher and student)
        await sio.emit('attention_update', {
            'student_id': student_id,
            'attention_score': attention_score,
            'status': status
        }, room=session_id)
        
        return {'status': 'broadcasted'}
    
    @sio.event
    async def tab_switch(sid, data):
        """Handle tab switch events from extension"""
        session = await sio.get_session(sid)
        if not session:
            return {'error': 'Not authenticated'}
        
        session_id = data.get('session_id')
        was_blocked = data.get('was_blocked')
        
        # Notify teacher
        await sio.emit('tab_switch_event', {
            'student_id': session.get('user_id'),
            'was_blocked': was_blocked
        }, room=session_id)
        
        return {'status': 'logged'}
    
    @sio.event
    async def session_ended(sid, data):
        """Handle session end notification"""
        session = await sio.get_session(sid)
        if not session or session.get('role') != 'teacher':
            return {'error': 'Not authorized'}
        
        session_id = data.get('session_id')
        
        # Notify all participants
        await sio.emit('session_ended', {'session_id': session_id}, room=session_id)
        
        # Clean up active sessions
        if session_id in active_sessions:
            del active_sessions[session_id]
        
        return {'status': 'ended'}
    
    # WebRTC signaling events
    @sio.event
    async def webrtc_offer(sid, data):
        """Forward WebRTC offer"""
        target_id = data.get('target_id')
        session_id = data.get('session_id')
        
        if session_id in active_sessions and target_id in active_sessions[session_id]:
            target_sid = active_sessions[session_id][target_id]
            await sio.emit('webrtc_offer', {
                'from_id': data.get('from_id'),
                'offer': data.get('offer')
            }, room=target_sid)
    
    @sio.event
    async def webrtc_answer(sid, data):
        """Forward WebRTC answer"""
        target_id = data.get('target_id')
        session_id = data.get('session_id')
        
        if session_id in active_sessions and target_id in active_sessions[session_id]:
            target_sid = active_sessions[session_id][target_id]
            await sio.emit('webrtc_answer', {
                'from_id': data.get('from_id'),
                'answer': data.get('answer')
            }, room=target_sid)
    
    @sio.event
    async def webrtc_ice_candidate(sid, data):
        """Forward ICE candidate"""
        target_id = data.get('target_id')
        session_id = data.get('session_id')
        
        if session_id in active_sessions and target_id in active_sessions[session_id]:
            target_sid = active_sessions[session_id][target_id]
            await sio.emit('webrtc_ice_candidate', {
                'from_id': data.get('from_id'),
                'candidate': data.get('candidate')
            }, room=target_sid)
