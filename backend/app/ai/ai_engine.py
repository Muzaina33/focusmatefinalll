"""
FocusMate AI Engine
Real-time attention monitoring using Mediapipe and OpenCV
"""

import asyncio
import cv2
import socketio
from datetime import datetime

# Use absolute imports when run as script, relative when imported as module
try:
    from .face_detector import FaceDetector
    from .attention_analyzer import AttentionAnalyzer
except ImportError:
    from face_detector import FaceDetector
    from attention_analyzer import AttentionAnalyzer

class StreamProcessor:
    def __init__(self, student_id: str, session_id: str, backend_url: str = "http://localhost:8000"):
        """Initialize stream processor"""
        self.student_id = student_id
        self.session_id = session_id
        self.backend_url = backend_url
        
        # Initialize components
        self.detector = FaceDetector()
        self.analyzer = AttentionAnalyzer()
        
        # Absence tracking
        self.absent_timer = 0
        self.fps = 30
        self.absent_threshold = 60  # 2 seconds at 30fps
        self.left_class_threshold = 300  # 10 seconds at 30fps
        
        # WebSocket client
        self.sio = socketio.AsyncClient()
        self.connected = False
    
    async def connect_websocket(self):
        """Connect to backend WebSocket"""
        try:
            await self.sio.connect(self.backend_url)
            self.connected = True
            print(f"Connected to backend: {self.backend_url}")
        except Exception as e:
            print(f"WebSocket connection error: {e}")
            # Retry with exponential backoff
            for attempt in range(5):
                await asyncio.sleep(2 ** attempt)
                try:
                    await self.sio.connect(self.backend_url)
                    self.connected = True
                    print("Reconnected successfully")
                    break
                except:
                    continue
    
    async def send_update(self, data: dict):
        """Send attention update to backend"""
        if not self.connected:
            await self.connect_websocket()
        
        try:
            await self.sio.emit('ai_update', data)
        except Exception as e:
            print(f"Error sending update: {e}")
            self.connected = False
    
    async def process_frame(self, frame):
        """Process a single video frame"""
        # Detect face
        landmarks = self.detector.detect_face(frame)
        
        if landmarks:
            # Face detected - analyze engagement
            score, status = self.analyzer.analyze_engagement(landmarks)
            self.absent_timer = 0
        else:
            # No face detected
            self.absent_timer += 1
            score = 0
            
            if self.absent_timer > self.left_class_threshold:
                status = 'Left Class'
            elif self.absent_timer > self.absent_threshold:
                status = 'Absent'
            else:
                status = 'Present'  # Brief absence
        
        # Send update to backend
        await self.send_update({
            'student_id': self.student_id,
            'session_id': self.session_id,
            'attention_score': score,
            'status': status,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        return score, status
    
    async def start_processing(self, video_source=0):
        """Start processing video stream"""
        print(f"Starting AI Engine for student {self.student_id} in session {self.session_id}")
        
        # Connect to backend
        await self.connect_websocket()
        
        # Open video capture
        cap = cv2.VideoCapture(video_source)
        cap.set(cv2.CAP_PROP_FPS, self.fps)
        
        try:
            frame_count = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Failed to read frame")
                    break
                
                # Process every frame
                score, status = await self.process_frame(frame)
                
                frame_count += 1
                if frame_count % 30 == 0:  # Log every second
                    print(f"Frame {frame_count}: Score={score:.1f}, Status={status}")
                
                # Control frame rate
                await asyncio.sleep(1.0 / self.fps)
        
        except KeyboardInterrupt:
            print("Stopping AI Engine...")
        
        finally:
            cap.release()
            self.detector.close()
            if self.connected:
                await self.sio.disconnect()
            print("AI Engine stopped")

async def main():
    """Main entry point for AI Engine"""
    print("FocusMate AI Engine")
    print("=" * 50)
    
    # For testing, use dummy values
    # In production, these would come from command line args or config
    student_id = "test-student-123"
    session_id = "test-session-456"
    
    processor = StreamProcessor(student_id, session_id)
    await processor.start_processing()

if __name__ == "__main__":
    asyncio.run(main())
