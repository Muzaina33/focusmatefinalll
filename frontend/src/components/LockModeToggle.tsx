import { useState } from 'react';
import { websocketService } from '../services/websocket';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

interface Props {
  sessionId: string;
}

export default function LockModeToggle({ sessionId }: Props) {
  const [enabled, setEnabled] = useState(false);
  const { token } = useAuthStore();

  const toggle = async () => {
    const newState = !enabled;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.put(
        `${API_URL}/room/${sessionId}/lockmode?enabled=${newState}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      websocketService.emit('toggle_lockmode', {
        session_id: sessionId,
        enabled: newState
      });
      
      setEnabled(newState);
    } catch (error) {
      console.error('Error toggling LockMode:', error);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 ${
        enabled
          ? 'bg-neon-cyan text-dark-bg shadow-neon'
          : 'glass text-gray-300 hover:border-neon-cyan'
      }`}
    >
      🔒 LockMode: {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
