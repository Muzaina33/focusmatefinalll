interface Props {
  activities: any[];
}

export default function LiveActivityFeed({ activities }: Props) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'joined': return '✅';
      case 'left': return '👋';
      case 'tab_switch': return '⚠️';
      default: return '📝';
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'joined': return 'Student joined';
      case 'left': return 'Student left';
      case 'tab_switch': return activity.was_blocked ? 'Tab switch blocked' : 'Tab switch detected';
      default: return 'Activity';
    }
  };

  return (
    <div className="glass rounded-xl p-4 h-[600px] flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">Live Activity</h3>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No activity yet</p>
        ) : (
          activities.slice().reverse().map((activity, index) => (
            <div key={index} className="bg-dark-panel rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-white">{getActivityText(activity)}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(activity.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
