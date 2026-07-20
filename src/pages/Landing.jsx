import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  Sparkles, 
  Orbit, 
  Bell, 
  BarChart3, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) navigate('/dashboard');
    else navigate('/auth');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20 }
    }
  };

  const features = [
    {
      title: 'Subscription Galaxy',
      description: 'Interact with your subscriptions visualized as planets orbiting around your monthly spend.',
      icon: Orbit,
      color: '#8b5cf6'
    },
    {
      title: 'Smart Reminders',
      description: 'Get alert notifications days before renewals hit to prevent unwanted recurring fees.',
      icon: Bell,
      color: '#06b6d4'
    },
    {
      title: 'Advanced Analytics',
      description: 'Track spending distributions by categories, histories, and payment types with rich charts.',
      icon: BarChart3,
      color: '#ec4899'
    },
    {
      title: 'Renewals Calendar',
      description: 'A dedicated calendar grid visualizing due dates, keeping your accounts aligned.',
      icon: CalendarIcon,
      color: '#10b981'
    }
  ];

  return (
    <div className="min-h-screen t-bg-deep t-text overflow-x-hidden bg-mesh font-sans">
      
      {/* Navbar */}
      <header className="max-w-6xl mx-auto h-20 px-6 flex items-center justify-between border-b border-white/5">
        <Logo size="lg" />
        <button
          onClick={handleStart}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          {user ? 'Go to Dashboard' : 'Sign In'}
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold w-fit">
              <Sparkles size={12} className="text-brand-cyan" /> Intelligent Finance Hub
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-white">
              Master Your <span className="text-gradient">Subscriptions</span> in One Portal
            </h1>
            
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Consolidate Netflix, Spotify, cloud servers, and SaaS. Visualize expenses dynamically, skip unwanted payments, and boost savings.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <GradientButton onClick={handleStart} variant="purple-cyan" className="flex items-center gap-2">
                Get Started Free <ArrowRight size={16} />
              </GradientButton>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right Visual - Orbital Animation Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex items-center justify-center p-4"
          >
            {/* Center Node */}
            <div className="w-28 h-28 rounded-full glass-premium border border-brand-purple/30 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(139,92,246,0.2)] z-10">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Spendings</span>
              <span className="text-lg font-bold font-display text-white mt-0.5">₹4,230</span>
            </div>

            {/* Orbit paths */}
            <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-white/5 animate-[spin_30s_linear_infinite]" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-white/5 animate-[spin_50s_linear_infinite]" />

            {/* Floating Cards */}
            <div className="absolute animate-[float_6s_ease-in-out_infinite] top-[10%] left-[15%]">
              <div className="glass p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white">N</div>
                <span className="text-xs font-semibold text-white">Netflix</span>
              </div>
            </div>

            <div className="absolute animate-[float_6s_ease-in-out_infinite_2s] bottom-[15%] right-[10%]">
              <div className="glass p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">S</div>
                <span className="text-xs font-semibold text-white">Spotify</span>
              </div>
            </div>

            <div className="absolute animate-[float_6s_ease-in-out_infinite_4s] top-[60%] left-[5%]">
              <div className="glass p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">C</div>
                <span className="text-xs font-semibold text-white">Claude CC</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white">
            Designed for Modern Digital Lifestyles
          </h2>
          <p className="text-gray-400 mt-4 leading-relaxed">
            Stop losing money to hidden subscriptions. Control services and maximize subscription utility with these core components.
          </p>
        </div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={feat.title}
                variants={itemVariants}
              >
                <GlassCard className="h-full flex flex-col items-start text-left gap-4" delay={0}>
                  <div 
                    className="p-3 rounded-xl text-white flex items-center justify-center"
                    style={{ backgroundColor: `${feat.color}15`, border: `1px solid ${feat.color}33` }}
                  >
                    <Icon size={22} style={{ color: feat.color }} />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mt-2">{feat.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Social Verification Metrics */}
      <section className="max-w-6xl mx-auto px-6 py-12 mb-16">
        <div className="rounded-2xl glass-premium p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-white/10">
          <div>
            <h3 className="text-3xl font-extrabold text-white font-display">₹1.5M+</h3>
            <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-wider">Expenses Tracked</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white font-display">50,000+</h3>
            <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-wider">Alerts Sent</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white font-display">12%</h3>
            <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-wider">Average Money Saved</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white font-display">50+</h3>
            <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-wider">Integrations Seeding</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <Logo size="sm" />
        <p>© 2026 OrbitPay Command. All rights reserved.</p>
      </footer>

    </div>
  );
}
