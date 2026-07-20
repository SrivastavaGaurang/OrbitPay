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
  Brain 
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
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen t-bg-deep t-text overflow-hidden relative font-sans">
      
      {/* Sidebar for Desktop */}
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Drawer */}
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
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors border ${
                        isActive
                          ? 'bg-brand-purple/15 border-brand-purple/30 t-text'
                          : 'bg-transparent border-transparent t-text-secondary hover:t-text hover:t-bg-surface'
                      }`}>
                        <Icon size={18} className={isActive ? 'text-brand-purple' : 't-text-secondary'} />
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        
        {/* Page body */}
        <main className="flex-1 overflow-y-auto t-bg-deep p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto pb-10">
            {/* Route animation key triggers layout refresh */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
