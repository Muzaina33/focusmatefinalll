import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TeacherReports() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(
        `${API_URL}/reports/teacher/${user?.id}/sessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetail = async (sessionId: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(
        `${API_URL}/reports/session/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSession(response.data);
    } catch (error) {
      console.error('Error loading session detail:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading reports...</div>
      </div>
    );
  }

  if (selectedSession) {
    return (
      <div className="min-h-screen bg-dark-bg p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => setSelectedSession(null)}
              className="text-neon-cyan hover:underline mb-2"
            >
              ← Back to Reports
            </button>
            <h1 className="text-3xl font-bold text-white">Session Report</h1>
            <p className="text-gray-400">
              Room Code: {selectedSession.session.room_code} | 
              {new Date(selectedSession.session.start_time).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 glass text-white rounded-lg hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        {/* Students Report */}
        <div className="space-y-4">
          {selectedSession.students.map((student: any) => (
            <div key={student.student_id} className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{student.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-cyan">
                    {student.final_attention_score}%
                  </div>
                  <div className="text-sm text-gray-400">Final Attention Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {student.status_timeline.length}
                  </div>
                  <div className="text-sm text-gray-400">Status Changes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {student.tab_switch_count}
                  </div>
                  <div className="text-sm text-gray-400">Tab Switches</div>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2">Status Timeline</h4>
                <div className="space-y-2">
                  {student.status_timeline.map((event: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-white">{event.status}</span>
                      {event.duration && (
                        <span className="text-gray-500">{event.duration}s</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-neon-cyan mb-2">My Reports</h1>
          <p className="text-gray-400">View reports from all your classroom sessions</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="px-4 py-2 glass text-white rounded-lg hover:bg-gray-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 glass text-white rounded-lg hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Sessions Yet</h2>
          <p className="text-gray-400 mb-6">Create a session to start generating reports</p>
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="px-6 py-3 bg-neon-cyan text-dark-bg font-bold rounded-lg hover:shadow-neon"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => loadSessionDetail(session.id)}
              className="glass rounded-xl p-6 cursor-pointer hover:border-neon-cyan transition-all"
            >
              <div className="text-2xl font-bold text-white mb-2">
                {session.room_code}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {new Date(session.start_time).toLocaleDateString()} at{' '}
                {new Date(session.start_time).toLocaleTimeString()}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-neon-cyan">
                    {session.student_count}
                  </div>
                  <div className="text-xs text-gray-400">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neon-cyan">
                    {session.average_attention}%
                  </div>
                  <div className="text-xs text-gray-400">Avg Attention</div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-neon-cyan hover:underline">
                View Details →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
