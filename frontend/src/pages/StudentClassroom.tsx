import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { websocketService } from '../services/websocket';
import { webrtcManager } from '../services/webrtc';
import { aiDetectionService } from '../services/aiDetection';
import axios from 'axios';
import AttentionPanel from '../components/AttentionPanel';
import BottomToolbar from '../components/BottomToolbar';

export default function StudentClassroom() {
  const { user, token } = useAuthStore();
  const [roomCode, setRoomCode] = useState('');
  const [session, setSession] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [myAttention, setMyAttention] = useState({ score: 0, status: 'Unknown', history: [] as any[] });
  const [lockMode, setLockMode] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [teacherStream, setTeacherStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (token && session) {
      const socket = websocketService.connect(token);
      
      socket.on('attention_update', (data: any) => {
        if (data.student_id === user?.id) {
          setMyAttention(prev => ({
            score: data.attention_score,
            status: data.status,
            history: [...prev.history, { time: new Date(), score: data.attention_score }].slice(-30)
          }));
        }
      });

      socket.on('lockmode_changed', (data: any) => {
        setLockMode(data.enabled);
      });

      socket.on('student_muted', () => {
        setMicOn(false);
        webrtcManager.toggleAudio(false);
      });

      socket.on('camera_off', () => {
        setCameraOn(false);
        webrtcManager.toggleVideo(false);
      });

      socket.on('student_kicked', () => {
        alert('You have been removed from the session');
        leaveClass();
      });

      socket.on('session_ended', () => {
        alert('Session has ended');
        leaveClass();
      });

      // Listen for WebRTC remote streams (teacher's video)
      const handleRemoteStream = (event: CustomEvent) => {
        console.log('📹 Received teacher stream:', event.detail);
        const stream = event.detail.stream;
        setTeacherStream(stream);
        if (teacherVideoRef.current) {
          teacherVideoRef.current.srcObject = stream;
        }
      };

      window.addEventListener('remoteStreamReceived', handleRemoteStream as EventListener);

      return () => {
        window.removeEventListener('remoteStreamReceived', handleRemoteStream as EventListener);
      };
    }

    return () => {
      websocketService.disconnect();
      webrtcManager.cleanup();
    };
  }, [token, session, user]);

  const joinClass = async () => {
    try {
      // Get local video stream with better error handling
      let stream: MediaStream | null = null;
      
      try {
        console.log('🎥 Requesting camera access...');
        stream = await webrtcManager.getLocalStream(true, true);
        console.log('✅ Camera access granted');
        setLocalStream(stream);

        // Set video source
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          console.log('📹 Video stream set to video element');
        }
      } catch (cameraError) {
        console.error('❌ Camera access failed:', cameraError);
        alert('Camera access is required for AI monitoring. Please allow camera permission and refresh the page.');
        return; // Don't continue without camera
      }

      // Join room
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${API_URL}/room/join`, 
        { room_code: roomCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = response.data.room_id;
      setSession({ id: sessionId, room_code: roomCode });

      // Initialize WebRTC
      await webrtcManager.initialize(
        websocketService.getSocket()!,
        sessionId,
        user!.id
      );

      // Join session via WebSocket
      websocketService.emit('join_session', { session_id: sessionId });

      // Start AI detection after video is ready
      setTimeout(() => {
        if (videoRef.current) {
          aiDetectionService.initialize(videoRef.current);
          aiDetectionService.startDetection((data) => {
            // Update local attention display
            setMyAttention(prev => ({
              score: data.score,
              status: data.status,
              history: [...prev.history, { time: new Date(), score: data.score }].slice(-30)
            }));

            // Send to teacher via WebSocket
            websocketService.emit('ai_update', {
              session_id: sessionId,
              student_id: user!.id,
              attention_score: data.score,
              status: data.status,
              video_frame: data.frame // Send video frame to teacher
            });
          });
        }
      }, 1000);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to join room');
    }
  };

  const leaveClass = async () => {
    if (session) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        await axios.post(`${API_URL}/room/leave?room_id=${session.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        websocketService.emit('leave_session', { session_id: session.id });
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }
    
    aiDetectionService.cleanup();
    webrtcManager.cleanup();
    setSession(null);
    setLocalStream(null);
    setRoomCode('');
  };

  const toggleCamera = () => {
    const newState = !cameraOn;
    setCameraOn(newState);
    webrtcManager.toggleVideo(newState);
  };

  const toggleMic = () => {
    const newState = !micOn;
    setMicOn(newState);
    webrtcManager.toggleAudio(newState);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold text-neon-cyan mb-8 text-center">Join Classroom</h1>
          
          <div className="glass rounded-2xl p-8">
            <div className="text-6xl text-center mb-6">🎓</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-dark-panel border border-gray-700 rounded-lg text-white text-center text-2xl font-mono focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="ABC123"
                  maxLength={6}
                />
              </div>

              <button
                onClick={async () => {
                  // Test camera first
                  try {
                    console.log('🧪 Testing camera access...');
                    const testStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    console.log('✅ Camera test successful');
                    testStream.getTracks().forEach(track => track.stop()); // Clean up test stream
                    joinClass(); // Proceed with join
                  } catch (error: any) {
                    console.error('❌ Camera test failed:', error);
                    alert(`Camera test failed: ${error.message}\n\nPlease:\n1. Allow camera permission\n2. Close other apps using camera\n3. Refresh page and try again`);
                  }
                }}
                disabled={roomCode.length !== 6}
                className="w-full px-6 py-3 bg-neon-cyan text-dark-bg font-bold rounded-lg hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Class
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* My Camera */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-2">My Camera</h3>
            <div className="relative aspect-video bg-dark-panel rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)', display: localStream ? 'block' : 'none' }}
              />
              {!localStream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
              )}
              {localStream && (
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-green-400">
                  ● AI Monitoring Active
                </div>
              )}
            </div>
          </div>

          {/* Teacher Camera */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-2">Teacher</h3>
            <div className="relative aspect-video bg-dark-panel rounded-lg overflow-hidden">
              {teacherStream ? (
                <video
                  ref={teacherVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-6xl">👨‍🏫</div>
                </div>
              )}
              {teacherStream && (
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-green-400">
                  ● WebRTC Live
                </div>
              )}
              {!teacherStream && (
                <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                  🔄 Connecting to teacher...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attention Panel */}
        <div className="lg:col-span-1">
          <AttentionPanel 
            score={myAttention.score}
            status={myAttention.status}
            history={myAttention.history}
            lockMode={lockMode}
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <BottomToolbar
        cameraOn={cameraOn}
        micOn={micOn}
        lockMode={lockMode}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        onLeave={leaveClass}
      />
    </div>
  );
}
