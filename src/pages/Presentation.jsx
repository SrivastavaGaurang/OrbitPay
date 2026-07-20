import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Presentation as PresentationIcon,
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Wallet, 
  Users, 
  Radar, 
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    // Slide 1: Welcome
    {
      title: "OrbitPay / SubSync",
      subtitle: "INTELLIGENT RECURRING FINANCE HUB",
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-pulse">
            <PresentationIcon size={40} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-white">
            OrbitPay / <span className="text-gradient">SubSync</span>
          </h1>
          <p className="text-base sm:text-lg t-text-secondary max-w-xl leading-relaxed">
            A premium dashboard for tracking, analyzing, and optimizing your recurring subscriptions. Keep your budget healthy and cut the waste.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold mt-4">
            <Sparkles size={12} className="text-brand-cyan" /> Press Left / Right Arrow keys to navigate
          </div>
        </div>
      )
    },
    // Slide 2: The Problem
    {
      title: "The Subscription Challenge",
      subtitle: "WHAT PROBLEMS ARE WE SOLVING?",
      content: (
        <div className="grid md:grid-cols-2 gap-6 items-center h-full">
          <div className="flex flex-col gap-4 text-left">
            <h3 className="text-xl font-bold text-brand-purple font-display">The Rise of Subscription Creep</h3>
            <p className="text-sm t-text-secondary leading-relaxed">
              With everything from media streaming to cloud servers charging monthly, it's easy to lose track of actual spend.
            </p>
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
              <AlertTriangle size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Silent Capital Drain</h4>
                <p className="text-xs t-text-secondary mt-0.5">Unused trial periods and membership trackers that pull money from accounts unnoticed.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              { id: '1', title: "Zombie Subscriptions", desc: "Forgotten memberships that drain money month after month." },
              { id: '2', title: "Opaque Spending Trends", desc: "Hard to visualize actual aggregate monthly and yearly subscription fees." },
              { id: '3', title: "Manual Split Hassles", desc: "Splitting Netflix or Spotify bills with family manually is error-prone." }
            ].map(item => (
              <div key={item.id} className="p-3.5 rounded-xl t-bg-surface border t-border flex items-start gap-3 text-left">
                <span className="w-6 h-6 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex items-center justify-center text-xs font-black">{item.id}</span>
                <div>
                  <h4 className="text-xs font-extrabold t-text font-display">{item.title}</h4>
                  <p className="text-xs t-text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // Slide 3: The Platform Pillars
    {
      title: "Platform Core Ecosystem",
      subtitle: "FOUR PILLARS OF FINANCIAL OPTIMIZATION",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full items-center">
          {[
            { title: "Consolidated Tracker", icon: Wallet, color: "text-brand-purple", desc: "A singular vault aggregating bills, renewal schedules, and payment channels." },
            { title: "Visual Spend Galaxy", icon: Sparkles, color: "text-brand-cyan", desc: "Orbits mapping cost significance visually, sizing planets based on relative pricing." },
            { title: "Zombie Radar", icon: Radar, color: "text-rose-400", desc: "Usage-to-cost audit system flagging low utility memberships." },
            { title: "Savings Simulator", icon: TrendingUp, color: "text-emerald-400", desc: "Calculates compound interest from cancelled subscriptions over 5 years." }
          ].map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-xl t-bg-surface border t-border flex flex-col justify-between h-52 text-left hover:border-brand-purple/30 transition-colors">
              <div className={`p-2 rounded-xl bg-white/5 w-fit ${pillar.color}`}>
                <pillar.icon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display t-text mb-1">{pillar.title}</h4>
                <p className="text-xs t-text-muted leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 4: Interactive Dashboard
    {
      title: "Dashboard & Spend Galaxy",
      subtitle: "ENGAGING & DYNAMIC VISUALIZATIONS",
      content: (
        <div className="grid md:grid-cols-12 gap-6 items-center h-full">
          <div className="md:col-span-7 flex flex-col gap-4 text-left">
            <h3 className="text-lg font-bold text-brand-cyan font-display">Interactive 3D-Orbit Galaxy</h3>
            <p className="text-xs t-text-secondary leading-relaxed">
              We convert static Excel tables into an immersive dashboard. Subscriptions rotate around a center cost hub in 3D orbit modes.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-3 rounded-xl t-bg-surface border t-border">
                <span className="text-xs font-bold text-brand-purple block font-display">Spend Trends</span>
                <span className="text-[10px] t-text-muted mt-0.5 block">Recharts historical curves over 6-month cycles.</span>
              </div>
              <div className="p-3 rounded-xl t-bg-surface border t-border">
                <span className="text-xs font-bold text-brand-cyan block font-display">Category Donuts</span>
                <span className="text-[10px] t-text-muted mt-0.5 block">Segments cloud databases, workspace licenses, and media logs.</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 p-5 rounded-2xl bg-brand-purple/5 border border-brand-purple/15 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-brand-purple/10 to-transparent pointer-events-none" />
            <div className="w-16 h-16 rounded-full border border-dashed border-brand-purple/40 flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <div className="w-3 h-3 rounded-full bg-brand-cyan" />
            </div>
            <h4 className="text-sm font-bold t-text font-display">Galaxy Orbit Sandbox</h4>
            <p className="text-xs t-text-muted leading-relaxed max-w-xs">
              Dynamically scales planet radius sizes according to cost ratios. Visual and fun.
            </p>
          </div>
        </div>
      )
    },
    // Slide 5: Zombie Radar & Simulator
    {
      title: "Zombie Radar & Savings Simulator",
      subtitle: "UNCOVERING WASTE & SNOWBALLING SAVINGS",
      content: (
        <div className="grid md:grid-cols-2 gap-6 h-full items-center text-left">
          <div className="p-4 rounded-xl t-bg-surface border t-border flex flex-col gap-3">
            <h4 className="text-md font-bold text-rose-400 font-display flex items-center gap-1.5">
              <Radar size={16} /> Zombie Radar
            </h4>
            <p className="text-xs t-text-secondary leading-relaxed">
              Audits utilization: Daily, Weekly, Monthly, Rarely, or Never. Calculates a Value-for-Money (VFM) score. Flags high cost, low usage trackers as \"zombie risk\" to help users save.
            </p>
            <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-xs font-bold text-rose-400">
              <span>Avg Portfolio Health</span>
              <span>76% VFM</span>
            </div>
          </div>
          <div className="p-4 rounded-xl t-bg-surface border t-border flex flex-col gap-3">
            <h4 className="text-md font-bold text-emerald-400 font-display flex items-center gap-1.5">
              <TrendingUp size={16} /> Savings Simulator
            </h4>
            <p className="text-xs t-text-secondary leading-relaxed">
              Allows users to toggle cancellations and forecasts compound growth over 5 years at custom return rates (6%-12%). Includes auto-generated emails for support requests.
            </p>
            <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-xs font-bold text-emerald-400">
              <span>5-Year Compound Returns</span>
              <span>Up to +35% Interest</span>
            </div>
          </div>
        </div>
      )
    },
    // Slide 6: Budget & Bill Splitter
    {
      title: "Budgets & Family Vault Splits",
      subtitle: "SPENDING CAPS & GROUP ACCOUNT SHARING",
      content: (
        <div className="grid md:grid-cols-2 gap-6 h-full items-center text-left">
          <div className="flex flex-col gap-3">
            <h4 className="text-md font-bold text-brand-purple font-display flex items-center gap-1.5">
              <Wallet size={16} /> Budget Limits
            </h4>
            <p className="text-xs t-text-secondary leading-relaxed">
              Set caps by categories (e.g. cloud database limits, entertainment budgets). Displays category metrics, overruns warnings, and monthly potential savings.
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
              <div className="bg-brand-purple h-full" style={{ width: '82%' }} />
            </div>
            <span className="text-[10px] t-text-muted uppercase font-bold">Category Limit reached: 82%</span>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-md font-bold text-brand-cyan font-display flex items-center gap-1.5">
              <Users size={16} /> Family Vault Splitter
            </h4>
            <p className="text-xs t-text-secondary leading-relaxed">
              Split shared subscription charges equally. Input handles, calculate ratios, and copy custom request templates containing UPI IDs to send instantly.
            </p>
            <div className="p-3 rounded-lg bg-brand-cyan/5 border border-brand-cyan/15 text-xs text-brand-cyan font-mono leading-tight">
              UPI Request: Hey Alex! Your share for Netflix is ₹162...
            </div>
          </div>
        </div>
      )
    },
    // Slide 7: Technical Architecture
    {
      title: "Technical Infrastructure Layer",
      subtitle: "MODERN FULL-STACK ARCHITECTURE",
      content: (
        <div className="grid grid-cols-3 gap-4 h-full items-center text-left">
          <div className="p-4 rounded-xl t-bg-surface border t-border flex flex-col justify-between h-48">
            <h4 className="text-xs font-extrabold text-brand-purple uppercase tracking-widest font-display">View & Style</h4>
            <ul className="text-xs t-text-secondary flex flex-col gap-2 mt-2">
              <li>• React 19 Engine</li>
              <li>• Tailwind CSS v4 Theme</li>
              <li>• Lucide Vectors</li>
              <li>• Recharts Charts</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl t-bg-surface border t-border flex flex-col justify-between h-48">
            <h4 className="text-xs font-extrabold text-brand-cyan uppercase tracking-widest font-display">Application State</h4>
            <ul className="text-xs t-text-secondary flex flex-col gap-2 mt-2">
              <li>• AuthContext (Session)</li>
              <li>• Subscription Context</li>
              <li>• ThemeContext (Dark/Light)</li>
              <li>• Currency Providers</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl t-bg-surface border t-border flex flex-col justify-between h-48">
            <h4 className="text-xs font-extrabold text-brand-purple uppercase tracking-widest font-display">Backend & Storage</h4>
            <ul className="text-xs t-text-secondary flex flex-col gap-2 mt-2">
              <li>• Firebase Auth System</li>
              <li>• Firestore Collections</li>
              <li>• Users Profiles</li>
              <li>• Offline local Storage</li>
            </ul>
          </div>
        </div>
      )
    },
    // Slide 8: Future Roadmap
    {
      title: "Roadmap & Takeaways",
      subtitle: "NEXT ITERATIONS & SCALING VISION",
      content: (
        <div className="grid md:grid-cols-2 gap-6 h-full items-center text-left">
          <div className="flex flex-col gap-4">
            <h3 className="text-md font-bold text-brand-purple font-display">Feature Roadmap</h3>
            <ul className="text-xs t-text-secondary flex flex-col gap-3">
              <li className="flex gap-2">
                <CheckCircle size={14} className="text-brand-purple flex-shrink-0" />
                <span><strong>Gmail Invoicing Integration:</strong> Auto-scan invoice attachments to update lists automatically.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle size={14} className="text-brand-purple flex-shrink-0" />
                <span><strong>FCM Alerts:</strong> Push/SMS alerts 3 days before renew charges.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle size={14} className="text-brand-purple flex-shrink-0" />
                <span><strong>Credit Card Open Banking:</strong> Directly check statements for billing.</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/15 flex flex-col justify-center gap-2">
            <span className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider font-display">Key Takeaway</span>
            <p className="text-xs t-text-secondary leading-relaxed">
              OrbitPay SubSync shifts subscription audits from a passive spreadsheet into an active financial tracker. By aggregating bills, splitting fees, auditing usage, and projecting investments, it gives financial control back to users.
            </p>
          </div>
        </div>
      )
    }
  ];

  // Navigation handlers
  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autoplay
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Fullscreen
  const toggleFullscreen = () => {
    const element = document.getElementById('presentation-deck-viewport');
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Listen to exit fullscreen via ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Slide transition variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none max-w-5xl mx-auto h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2.5">
            <PresentationIcon className="text-brand-purple" size={28} /> Project Presentation Deck
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Interactive presentation showing project challenges, technical stack, core modules, and future roadmap.
          </p>
        </div>
      </div>

      {/* Main Slide Deck Box */}
      <GlassCard 
        id="presentation-deck-viewport"
        className={`flex-1 flex flex-col justify-between overflow-hidden relative min-h-[400px] border t-border bg-slate-950 ${
          isFullscreen ? '!p-8 w-screen h-screen flex flex-col justify-between' : ''
        }`}
      >
        {/* Background slide design details */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-purple/10 to-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-brand-cyan/5 to-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Category Header */}
        <div className="relative z-10 flex justify-between items-start border-b border-white/5 pb-3">
          <div>
            <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
              {slides[currentSlide].subtitle}
            </span>
            <h3 className="text-xl font-extrabold text-white font-display mt-0.5">
              {slides[currentSlide].title}
            </h3>
          </div>
          <span className="text-xs font-bold text-brand-purple">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Window Content */}
        <div className="flex-1 my-6 relative z-10 overflow-y-auto pr-1">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="h-full"
            >
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Controls footer */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/5 pt-4">
          
          {/* Progress dots */}
          <div className="flex gap-1.5 items-center">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? 'w-6 bg-brand-purple' 
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation and state buttons */}
          <div className="flex items-center gap-3">
            {/* Auto Play toggler */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
                isPlaying 
                  ? 'bg-brand-purple/20 border-brand-purple text-brand-purple' 
                  : 't-bg-surface t-border t-text-secondary hover:t-text'
              }`}
              title={isPlaying ? "Pause Autoplay" : "Start Autoplay (5s cycle)"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Viewport size toggler */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl t-bg-surface border t-border t-text-secondary hover:t-text transition-colors flex items-center justify-center"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            <div className="h-6 w-[1px] bg-white/10" />

            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl t-bg-surface border t-border t-text-secondary hover:t-text transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-bold flex items-center gap-1 hover:shadow-md hover:shadow-brand-purple/20 transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
