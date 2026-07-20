import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { 
  X, 
  LayoutDashboard, 
  CreditCard, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Sparkles,
  Wallet,
  Brain,
  Calculator,
  Users,
  Radar,
  Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';

export const AppLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Protected route check
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Insights', path: '/insights', icon: Brain },
    { name: 'Simulator', path: '/simulator', icon: Calculator },
    { name: 'Bill Splitter', path: '/split', icon: Users },
    { name: 'Zombie Radar', path: '/radar', icon: Radar },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen t-bg-deep t-text overflow-hidden relative font-sans">
      
      {/* Sidebar for Desktop */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Dynamic Route Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-64 glass-premium z-50 p-5 flex flex-col md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b t-border pb-4 mb-5">
                <Logo size="md" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg t-text-secondary hover:t-text"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors border ${
                        isActive
                          ? 'bg-brand-purple/15 border-brand-purple/30 t-text'
                          : 'bg-transparent border-transparent t-text-secondary hover:t-text hover:t-bg-surface'
                      }`}>
                        <Icon size={16} className={isActive ? 'text-brand-purple' : 't-text-secondary'} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
