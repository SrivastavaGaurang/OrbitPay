import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { daysUntilRenewal } from '../../utils/helpers';
import { Bell, Plus, Sun, Moon, Menu, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { NotificationPanel } from '../features/NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';

export const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { subscriptions } = useSubscriptions();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Count active notifications (e.g. renewals in next 3 days)
  const notificationCount = subscriptions.filter(sub => {
    if (sub.status === 'active' && sub.nextRenewal) {
      const daysLeft = daysUntilRenewal(sub.nextRenewal);
      return daysLeft <= 3; // urgent renewals
    }
    return false;
  }).length;

  return (
    <header className="h-16 border-b t-border glass px-6 flex items-center justify-between relative select-none z-30">
      
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl t-text-secondary hover:t-text hover:bg-brand-purple/5 md:hidden transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Brand showing on mobile top only */}
        <div className="md:hidden">
          <Logo size="sm" />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3 ml-auto">
        
        {/* Quick Add Button */}
        <button
          onClick={() => navigate('/subscriptions/add')}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-semibold hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all cursor-pointer"
        >
          <Plus size={14} /> <span className="hidden sm:inline">Add New</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl t-text-secondary hover:t-text hover:bg-brand-purple/10 border t-border transition-all relative overflow-hidden group"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <motion.div
            key={isDark ? 'sun' : 'moon'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.div>
          <span className="absolute inset-0 rounded-xl bg-brand-purple/0 group-hover:bg-brand-purple/5 transition-colors" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications(true)}
          className="p-2 rounded-xl t-text-secondary hover:t-text hover:bg-brand-purple/5 border t-border relative transition-colors"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            >
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-7 h-7 rounded-full bg-white/5"
              />
              <ChevronDown size={14} className="text-gray-400 hidden sm:inline" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                  <motion.div
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-premium border border-white/10 shadow-xl py-1.5 z-20"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-1.5">
                      <p className="text-xs font-semibold text-white font-display truncate">{user.displayName}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/settings" 
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 block"
                    >
                      Account Settings
                    </Link>
                    
                    <Link 
                      to="/pricing" 
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 block"
                    >
                      Pricing Tiers
                    </Link>
                    
                    <div className="border-t border-white/5 my-1.5" />
                    
                    <button
                      onClick={() => { logout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 block font-semibold"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Notification Slide drawer */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
};
