import React from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { formatCurrency, daysUntilRenewal } from '../../utils/helpers';
import { Calendar, Bell, X, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { subscriptions, analytics } = useSubscriptions();

  // Dynamically generate notifications based on state
  const getNotifications = () => {
    const list = [];
    const now = new Date();
    
    subscriptions.forEach(sub => {
      if (sub.status === 'active' && sub.nextRenewal) {
        const daysLeft = daysUntilRenewal(sub.nextRenewal);
        
        if (daysLeft < 0) {
          list.push({
            id: `notif-overdue-${sub.id}`,
            type: 'warning',
            title: 'Payment Overdue',
            message: `Your ${sub.name} subscription renewal date was ${new Date(sub.nextRenewal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.`,
            timestamp: Date.now() - 3600000 // mock an hour ago
          });
        } else if (daysLeft <= 3) {
          list.push({
            id: `notif-renew-${sub.id}`,
            type: 'alert',
            title: 'Upcoming Renewal',
            message: `${sub.name} is renewing in ${daysLeft === 0 ? 'today' : daysLeft === 1 ? '1 day' : `${daysLeft} days`} (${formatCurrency(sub.cost, sub.currency)}).`,
            timestamp: Date.now()
          });
        }
      }
    });

    // Savings recommendation insight if there's savings potential
    if (analytics.savingsPotential > 0) {
      list.push({
        id: 'notif-savings-insight',
        type: 'info',
        title: 'Savings Potential Deteced',
        message: `You currently have ${analytics.pausedCount} paused subscriptions, saving you ${formatCurrency(analytics.savingsPotential)} monthly.`,
        timestamp: Date.now() - 86400000
      });
    }

    return list;
  };

  const notifications = getNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          
          {/* Slide out Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm glass-premium border-l border-white/10 z-50 p-5 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h4 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Bell size={18} className="text-brand-purple" /> Notifications
              </h4>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {notifications.map((notif) => {
                const { id, type, title, message } = notif;
                return (
                  <div
                    key={id}
                    className={`p-3.5 rounded-xl border flex gap-3 text-left ${
                      type === 'warning' ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' :
                      type === 'alert' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300' :
                      'bg-sky-500/5 border-sky-500/20 text-sky-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {type === 'warning' ? <AlertTriangle size={15} /> :
                       type === 'alert' ? <Calendar size={15} /> :
                       <Info size={15} />}
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs uppercase tracking-wider text-white">
                        {title}
                      </h5>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                        {message}
                      </p>
                    </div>
                  </div>
                );
              })}

              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-2">
                  <Bell size={28} className="text-gray-600 mb-1" />
                  <span className="text-sm">All caught up!</span>
                  <span className="text-xs text-gray-600">No new alerts or recommendations.</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
