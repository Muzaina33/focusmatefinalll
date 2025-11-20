import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { websocketService } from '../services/websocket';
import { webrtcManager } from '../services/webrtc';
import axios from 'axios';
import StudentGrid from '../components/StudentGrid';
import SessionAnalytics from '../components/SessionAnalytics';
import LiveActivityFeed from '../components/LiveActivityFeed';
import LockModeToggle from '../components/LockModeToggle';

export default function TeacherDashboard() {
  const { user, token } = useAuthStore();
  const [session, setSession] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [studentFrames, setStudentFrames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (token && session) {
      const socket = websocketService.connect(token);
      
      socket.on('student_joined', async (data: any) => {
        console.log('Student joined:', data);
        setActivities(prev => [...prev, { type: 'joined', ...data, time: new Date() }]);
        
        // Initiate WebRTC connection with the new student
        try {
          console.log(`🔄 Initiating WebRTC connection with student ${data.user_id}`);
          await webrtcManager.createOffer(data.user_id);
        } catch (error) {
          console.error('Failed to create WebRTC offer:', error);
        }
        
        // Reload students list
        loadStudents();
      });

      socket.on('student_left', (data: any) => {
        console.log('Student left:', data);
        setActivities(prev => [...prev, { type: 'left', ...data, time: new Date() }]);
        // Reload students list
        loadStudents();
      });

      socket.on('attention_update', (data: any) => {
        console.log('Attention update received:', data);
        setStudents(prev => prev.map(s => 
          s.id === data.student_id 
            ? { ...s, attentionScore: data.attention_score, status: data.status }
            : s
        ));
        
        // Update video frame if provided
        if (data.video_frame) {
          setStudentFrames(prev => ({
            ...prev,
            [data.student_id]: data.video_frame
          }));
        }
      });

      socket.on('tab_switch_event', (data: any) => {
        setActivities(prev => [...prev, { type: 'tab_switch', ...data, time: new Date() }]);
      });
    }

    return () => {
      websocketService.disconnect();
      webrtcManager.cleanup();
    };
  }, [token, session]);

  const createSession = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Create room first (without camera)
      const response = await axios.post(`${API_URL}/room/create`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newSession = response.data;
      setSession(newSession);

      // Try to get camera (optional - don't fail if unavailable)
      try {
        const stream = await webrtcManager.getLocalStream(true, true);
        setLocalStream(stream);
        
        // Initialize WebRTC
        await webrtcManager.initialize(
          websocketService.getSocket()!,
          newSession.id,
          user!.id
        );
      } catch (cameraError) {
        console.log('Camera not available, continuing without video');
      }

      // Join session via WebSocket
      websocketService.emit('join_session', { session_id: newSession.id });
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const loadStudents = async () => {
    if (!session) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}/room/${session.id}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Loaded students:', response.data.students);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Load students when session changes
  useEffect(() => {
    if (session) {
      loadStudents();
      // Poll for students every 5 seconds as backup
      const interval = setInterval(loadStudents, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const endSession = async () => {
    if (!session) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.delete(`${API_URL}/room/${session.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      websocketService.emit('session_ended', { session_id: session.id });
      webrtcManager.cleanup();
      setSession(null);
      setLocalStream(null);
      setStudents([]);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-bg p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logout */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-neon-cyan">Teacher Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/teacher/reports'}
                className="px-4 py-2 glass text-white rounded-lg hover:bg-gray-700"
              >
                Reports
              </button>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  window.location.href = '/';
                }}
                className="px-4 py-2 glass text-white rounded-lg hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to start a class?</h2>
            <p className="text-gray-400 mb-8">Create a session and share the room code with your students</p>
            
            <button
              onClick={createSession}
              className="px-8 py-4 bg-neon-cyan text-dark-bg font-bold rounded-lg hover:shadow-neon transition-all duration-300 text-lg"
            >
              Create Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4">
      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neon-cyan">Live Session</h1>
          <p className="text-gray-400">Room Code: <span className="text-white font-mono text-xl">{session.room_code}</span></p>
        </div>
        
        <div className="flex gap-4">
          <LockModeToggle sessionId={session.id} />
          <button
            onClick={endSession}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            End Session
          </button>
          <button
            onClick={() => window.location.href = '/teacher/reports'}
            className="px-6 py-3 glass text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reports
          </button>
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              window.location.href = '/';
            }}
            className="px-6 py-3 glass text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Teacher Preview with Controls */}
          <div className="glass rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-white">Your Camera</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (localStream) {
                      const videoTrack = localStream.getVideoTracks()[0];
                      if (videoTrack) {
                        videoTrack.enabled = !videoTrack.enabled;
                      }
                    }
                  }}
                  className="px-3 py-1 bg-dark-panel hover:bg-gray-700 rounded text-sm"
                  title="Toggle camera"
                >
                  📹
                </button>
                <button
                  onClick={() => {
                    if (localStream) {
                      const audioTrack = localStream.getAudioTracks()[0];
                      if (audioTrack) {
                        audioTrack.enabled = !audioTrack.enabled;
                      }
                    }
                  }}
                  className="px-3 py-1 bg-dark-panel hover:bg-gray-700 rounded text-sm"
                  title="Toggle microphone"
                >
                  🎤
                </button>
              </div>
            </div>
            <div className="relative aspect-video bg-dark-panel rounded-lg overflow-hidden">
              <video
                autoPlay
                playsInline
                muted
                ref={(video) => {
                  if (video && localStream && video.srcObject !== localStream) {
                    video.srcObject = localStream;
                  }
                }}
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)', display: localStream ? 'block' : 'none' }}
              />
              {!localStream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">👨‍🏫</div>
                </div>
              )}
            </div>
          </div>

          {/* Student Grid */}
          <StudentGrid students={students} sessionId={session.id} studentFrames={studentFrames} />

          {/* Analytics */}
          <SessionAnalytics students={students} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <LiveActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
