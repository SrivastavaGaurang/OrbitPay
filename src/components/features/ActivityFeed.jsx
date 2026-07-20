import React from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { PlusCircle, PauseCircle, PlayCircle, Trash2, Edit3, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed = ({ limit = 5 }) => {
  const { activityLogs } = useSubscriptions();

  const getIcon = (type) => {
    switch (type) {
      case 'added':
        return <PlusCircle className="text-emerald-400" size={16} />;
      case 'paused':
        return <PauseCircle className="text-amber-400" size={16} />;
      case 'active':
        return <PlayCircle className="text-brand-cyan" size={16} />;
      case 'cancelled':
        return <Trash2 className="text-rose-400" size={16} />;
      case 'updated':
        return <Edit3 className="text-violet-400" size={16} />;
      default:
        return <RefreshCw className="text-gray-400" size={16} />;
    }
  };

  const displayLogs = activityLogs.slice(0, limit);

  if (displayLogs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No recent activities logged.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {displayLogs.map((log) => {
        const { id, type, subscriptionName, details, timestamp } = log;
        return (
          <div key={id} className="flex gap-3">
            {/* Action Icon Node */}
            <div className="mt-1 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {getIcon(type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white font-display truncate">
                {subscriptionName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                {details}
              </p>
              <span className="text-[10px] text-gray-500 block mt-1.5">
                {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
