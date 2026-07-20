import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/ui/GradientButton';
import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back to OrbitPay!");
      } else {
        await signup(email, password, name);
        toast.success("Account created successfully!");
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (type) => {
    setLoading(true);
    try {
      if (type === 'google') await loginWithGoogle();
      else await loginWithGithub();
      toast.success("Welcome to OrbitPay!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Social login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen t-bg-deep t-text flex flex-col items-center justify-center p-4 bg-mesh select-none font-sans">
      
      {/* Brand Header */}
      <div 
        onClick={() => navigate('/')} 
        className="mb-8 cursor-pointer group hover:scale-105 transition-transform"
      >
        <Logo size="lg" />
      </div>

      {/* Main card */}
      <motion.div
        className="w-full max-w-md glass-premium rounded-2xl p-8 border t-border shadow-2xl relative overflow-hidden text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Shifting Mesh glow inside card */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <h3 className="text-2xl font-extrabold t-text text-center font-display mb-2">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h3>
        <p className="t-text-secondary text-xs text-center mb-6 leading-relaxed">
          {isLogin 
            ? 'Access your subscription database and savings insights.' 
            : 'Register now to start tracking your recurring spending.'}
        </p>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs t-text-muted font-bold uppercase tracking-wider">Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 t-text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Gaurang Srivastava"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:outline-none focus:border-brand-purple/50"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs t-text-muted font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 t-text-muted" size={16} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:outline-none focus:border-brand-purple/50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs t-text-muted font-bold uppercase tracking-wider flex justify-between">
              <span>Password</span>
              {isLogin && (
                <span className="text-[10px] text-brand-cyan hover:underline cursor-pointer lowercase">
                  Forgot Password?
                </span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 t-text-muted" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:outline-none focus:border-brand-purple/50"
              />
            </div>
          </div>

          {/* Form Actions */}
          <GradientButton 
            type="submit" 
            variant="purple-cyan" 
            disabled={loading}
            fullWidth 
            className="mt-2 text-sm font-bold py-3"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Sign Up'}
          </GradientButton>

        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px t-border flex-1" />
          <span className="text-[10px] t-text-muted uppercase tracking-widest font-extrabold">Or Continue With</span>
          <div className="h-px t-border flex-1" />
        </div>

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl t-bg-surface border t-border hover:border-brand-purple/40 t-text transition-colors cursor-pointer text-xs font-bold"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl t-bg-surface border t-border hover:border-brand-purple/40 t-text transition-colors cursor-pointer text-xs font-bold"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Toggle Footer */}
        <p className="text-xs t-text-secondary text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-cyan hover:underline cursor-pointer font-bold"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </span>
        </p>

      </motion.div>
    </div>
  );
}
