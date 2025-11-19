interface Props {
  students: any[];
}

export default function SessionAnalytics({ students }: Props) {
  const avgAttention = students.length > 0
    ? students.reduce((sum, s) => sum + (s.attentionScore || 0), 0) / students.length
    : 0;

  const statusCounts = students.reduce((acc, s) => {
    const status = s.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Session Analytics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-neon-cyan">{students.length}</div>
          <div className="text-sm text-gray-400">Students</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-neon-cyan">{avgAttention.toFixed(0)}%</div>
          <div className="text-sm text-gray-400">Avg Attention</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{statusCounts['Engaged'] || 0}</div>
          <div className="text-sm text-gray-400">Engaged</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400">{(statusCounts['Absent'] || 0) + (statusCounts['Left Class'] || 0)}</div>
          <div className="text-sm text-gray-400">Absent</div>
        </div>
      </div>
    </div>
  );
}
