import React from 'react';
import { formatCurrency, daysUntilRenewal } from '../../utils/helpers';
import { Calendar, AlertCircle } from 'lucide-react';
import { useSubscriptions } from '../../context/SubscriptionContext';

export const RenewalTimeline = ({ limit = 4 }) => {
  const { subscriptions } = useSubscriptions();
  
  // Sort active subscriptions by nextRenewal date ascending
  const upcomingSubs = subscriptions
    .filter(s => s.status === 'active' && s.nextRenewal)
    .map(s => ({
      ...s,
      daysLeft: daysUntilRenewal(s.nextRenewal)
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, limit);

  if (upcomingSubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center t-text-muted">
        <Calendar size={32} className="opacity-40 mb-2" />
        <span className="text-sm font-semibold">No upcoming renewals</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {upcomingSubs.map((sub) => {
        const { id, name, logo, cost, currency, nextRenewal, daysLeft, color } = sub;
        
        let urgencyColor = 't-border t-bg-surface';
        let badgeColor = 't-bg-surface t-text-muted';
        
        if (daysLeft <= 3) {
          urgencyColor = 'border-rose-500/20 bg-rose-500/5';
          badgeColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        } else if (daysLeft <= 7) {
          urgencyColor = 'border-amber-500/20 bg-amber-500/5';
          badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        }

        return (
          <div 
            key={id} 
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${urgencyColor}`}
          >
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg t-bg-surface border t-border flex items-center justify-center overflow-hidden p-1">
                {logo ? (
                  <img 
                    src={logo} 
                    alt={name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center text-sm font-bold t-text uppercase"
                  style={{ display: logo ? 'none' : 'flex', backgroundColor: (color || '#8b5cf6') + '33' }}
                >
                  {name.charAt(0)}
                </div>
              </div>
              
              <div>
                <h5 className="font-bold t-text text-sm font-display">{name}</h5>
                <span className="text-xs t-text-muted flex items-center gap-1 mt-0.5 font-medium">
                  <Calendar size={11} />
                  {new Date(nextRenewal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-extrabold t-text text-sm block font-display">
                {formatCurrency(cost, currency)}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1.5 ${badgeColor}`}>
                {daysLeft === 0 ? (
                  'Today'
                ) : daysLeft < 0 ? (
                  <span className="flex items-center gap-0.5"><AlertCircle size={10} /> Overdue</span>
                ) : (
                  `${daysLeft} d left`
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
