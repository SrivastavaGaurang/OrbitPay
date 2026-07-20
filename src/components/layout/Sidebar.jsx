import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Wallet,
  Brain,
  Calculator,
  Users,
  Radar,
  Trophy,
  Presentation
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Insights', path: '/insights', icon: Brain },
    { name: 'Simulator', path: '/simulator', icon: Calculator },
    { name: 'Bill Splitter', path: '/split', icon: Users },
    { name: 'Zombie Radar', path: '/radar', icon: Radar },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Presentation', path: '/presentation', icon: Presentation },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.div
      className="hidden md:flex flex-col h-screen glass border-r t-border relative p-4 flex-shrink-0 select-none"
      animate={{ width: isCollapsed ? 80 : 265 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Brand Header */}
      <div className="flex items-center px-2 py-3.5 mb-4 border-b t-border overflow-hidden">
        <Logo size="md" showText={!isCollapsed} />
      </div>

      {/* Collapse Trigger Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-16 -right-3.5 w-7 h-7 rounded-full t-bg-card border t-border hover:border-brand-purple/40 t-text-secondary hover:t-text flex items-center justify-center cursor-pointer shadow-md z-30"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.name} to={item.path}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all select-none border ${
                  isActive
                    ? 'bg-brand-purple/15 border-brand-purple/30 t-text font-extrabold shadow-sm'
                    : 'bg-transparent border-transparent t-text-secondary hover:t-text hover:t-bg-surface font-bold'
                }`}
                whileHover={{ x: isCollapsed ? 0 : 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-brand-purple' : 't-text-secondary'}`}>
                  <Icon size={18} />
                </div>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="truncate font-display text-xs"
                  >
                    {item.name}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile / Logout */}
      <div className="border-t t-border pt-3 mt-2">
        {user && !isCollapsed && (
          <div className="flex items-center gap-2.5 px-1.5 mb-2.5">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full bg-slate-800 border t-border"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'User'}`;
              }}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold t-text truncate font-display">{user.displayName}</p>
              <p className="text-[10px] t-text-muted truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold border border-transparent text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors select-none"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.div>
  );
};
