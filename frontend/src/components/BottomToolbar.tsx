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
        {/* Camera Toggle */}
        <button
          onClick={onToggleCamera}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            cameraOn
              ? 'bg-dark-panel hover:bg-gray-700'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {cameraOn ? '📹' : '📷'}
        </button>

        {/* Mic Toggle */}
        <button
          onClick={onToggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            micOn
              ? 'bg-dark-panel hover:bg-gray-700'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={micOn ? 'Mute' : 'Unmute'}
        >
          {micOn ? '🎤' : '🔇'}
        </button>

        {/* LockMode Indicator */}
        {lockMode && (
          <div className="w-14 h-14 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center text-2xl">
            🔒
          </div>
        )}

        {/* Leave Button */}
        <button
          onClick={onLeave}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-2xl transition-all"
          title="Leave class"
        >
          📤
        </button>
      </div>
    </div>
  );
}
