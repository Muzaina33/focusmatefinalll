interface Props {
  cameraOn: boolean;
  micOn: boolean;
  lockMode: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onLeave: () => void;
}

export default function BottomToolbar({ 
  cameraOn, 
  micOn, 
  lockMode, 
  onToggleCamera, 
  onToggleMic, 
  onLeave 
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur-lg border-t border-gray-800 p-4">
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-4">
        {/* Mic Toggle - Zoom Style */}
        <button
          onClick={onToggleMic}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
            micOn
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={micOn ? 'Mute' : 'Unmute'}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            {micOn ? (
              <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
            ) : (
              <>
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
              </>
            )}
          </svg>
          <span className="text-xs mt-1">{micOn ? 'Mute' : 'Unmute'}</span>
        </button>

        {/* Camera Toggle - Zoom Style */}
        <button
          onClick={onToggleCamera}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
            cameraOn
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={cameraOn ? 'Stop video' : 'Start video'}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            {cameraOn ? (
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            ) : (
              <>
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
              </>
            )}
          </svg>
          <span className="text-xs mt-1">{cameraOn ? 'Stop' : 'Start'}</span>
        </button>

        {/* LockMode Indicator */}
        {lockMode && (
          <div className="w-14 h-14 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center text-2xl">
            🔒
          </div>
        )}

        {/* Leave Button - Zoom Style */}
        <button
          onClick={onLeave}
          className="px-6 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all text-white font-semibold"
          title="Leave class"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
