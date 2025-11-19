interface Props {
  score: number;
  status: string;
  history: any[];
  lockMode: boolean;
}

export default function AttentionPanel({ score, status, history, lockMode }: Props) {
  const getStatusColor = (status: string) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="glass rounded-xl p-6 space-y-6 sticky top-4">
      {/* LockMode Indicator */}
      {lockMode && (
        <div className="bg-neon-cyan/20 border border-neon-cyan rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🔒</div>
          <div className="text-sm font-bold text-neon-cyan">LockMode Active</div>
        </div>
      )}

      {/* Attention Score */}
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-2">Your Attention</div>
        <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(0)}%
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-2">Status</div>
        <div className={`text-xl font-bold ${getStatusColor(status)}`}>
          {status}
        </div>
      </div>

      {/* Mini Graph */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Attention Trend</div>
        <div className="h-24 bg-dark-panel rounded-lg p-2 flex items-end gap-1">
          {history.length === 0 ? (
            <div className="w-full text-center text-gray-500 text-xs">No data yet</div>
          ) : (
            history.map((point, index) => (
              <div
                key={index}
                className="flex-1 bg-neon-cyan rounded-t"
                style={{ height: `${point.score}%` }}
              />
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-dark-panel rounded-lg p-4">
        <div className="text-sm font-bold text-white mb-2">💡 Tips</div>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Face the camera directly</li>
          <li>• Keep your eyes open</li>
          <li>• Stay focused on the lesson</li>
          <li>• Avoid looking away frequently</li>
        </ul>
      </div>
    </div>
  );
}
