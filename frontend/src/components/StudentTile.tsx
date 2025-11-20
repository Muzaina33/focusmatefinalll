import { useEffect, useRef, useState } from 'react';
import { websocketService } from '../services/websocket';
import { webrtcManager } from '../services/webrtc';

interface Props {
  student: any;
  sessionId: string;
  videoFrame?: string;
}

export default function StudentTile({ student, sessionId, videoFrame }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasWebRTCStream, setHasWebRTCStream] = useState(false);
  const [connectionState, setConnectionState] = useState('checking');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Engaged': return 'text-green-400';
      case 'Present': return 'text-blue-400';
      case 'Looking Away': return 'text-yellow-400';
      case 'Drowsy': return 'text-orange-400';
      case 'Absent': return 'text-red-400';
      case 'Left Class': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  useEffect(() => {
    // Try to get WebRTC stream for this student
    const updateStream = () => {
      const stream = webrtcManager.getRemoteStream(student.id);
      const state = webrtcManager.getPeerConnectionState(student.id);
      
      setConnectionState(state);
      
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasWebRTCStream(true);
        console.log(`✅ WebRTC stream set for student ${student.name}`);
      } else {
        setHasWebRTCStream(false);
      }
    };

    // Initial check
    updateStream();

    // Listen for remote stream events
    const handleRemoteStream = (event: CustomEvent) => {
      if (event.detail.peerId === student.id) {
        updateStream();
      }
    };

    window.addEventListener('remoteStreamReceived', handleRemoteStream as EventListener);

    // Check periodically for stream updates
    const interval = setInterval(updateStream, 2000);

    return () => {
      window.removeEventListener('remoteStreamReceived', handleRemoteStream as EventListener);
      clearInterval(interval);
    };
  }, [student.id, student.name]);

  const handleMute = () => {
    websocketService.emit('mute_student', {
      session_id: sessionId,
      student_id: student.id
    });
  };

  const handleCameraOff = () => {
    websocketService.emit('camera_off_student', {
      session_id: sessionId,
      student_id: student.id
    });
  };

  const handleKick = () => {
    if (confirm(`Kick ${student.name} from the session?`)) {
      websocketService.emit('kick_student', {
        session_id: sessionId,
        student_id: student.id
      });
    }
  };

  return (
    <div className="glass rounded-lg p-4 hover:border-neon-cyan transition-all">
      {/* Video display */}
      <div className="relative aspect-video bg-dark-panel rounded-lg mb-3 overflow-hidden">
        {hasWebRTCStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : videoFrame ? (
          <img 
            src={videoFrame} 
            alt={student.name}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">👤</div>
            <div className="absolute bottom-2 left-2 text-xs text-gray-500">
              {connectionState === 'connecting' && '🔄 Connecting...'}
              {connectionState === 'connected' && '✅ Connected'}
              {connectionState === 'failed' && '❌ Failed'}
              {connectionState === 'not-found' && '⏳ Waiting...'}
            </div>
          </div>
        )}
        <div className="absolute bottom-1 left-1 text-xs text-gray-400 bg-black/70 px-2 py-0.5 rounded">
          {student.name}
        </div>
        {(hasWebRTCStream || videoFrame) && (
          <div className="absolute top-1 right-1 text-xs text-green-400 bg-black/70 px-2 py-0.5 rounded">
            ● {hasWebRTCStream ? 'WebRTC' : 'AI Feed'}
          </div>
        )}
      </div>

      {/* Student Info */}
      <div className="space-y-2">
        <h4 className="font-bold text-white truncate">{student.name}</h4>
        
        {/* Attention Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Attention:</span>
          <span className="text-lg font-bold text-neon-cyan">
            {student.attentionScore?.toFixed(0) || 0}%
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Status:</span>
          <span className={`text-sm font-medium ${getStatusColor(student.status)}`}>
            {student.status || 'Unknown'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleMute}
            className="flex-1 px-3 py-2 bg-dark-panel hover:bg-neon-cyan/20 rounded text-xs transition-colors"
            title="Mute"
          >
            🔇
          </button>
          <button
            onClick={handleCameraOff}
            className="flex-1 px-3 py-2 bg-dark-panel hover:bg-neon-cyan/20 rounded text-xs transition-colors"
            title="Camera Off"
          >
            📷
          </button>
          <button
            onClick={handleKick}
            className="flex-1 px-3 py-2 bg-dark-panel hover:bg-red-500/20 rounded text-xs transition-colors"
            title="Kick"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  );
}
