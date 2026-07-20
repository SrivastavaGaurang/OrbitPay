import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscriptions } from '../context/SubscriptionContext';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Modal } from '../components/ui/Modal';
import { CURRENCIES } from '../utils/constants';
import { User, Bell, Shield, Trash2, Check, Camera, Sparkles, Link as LinkIcon, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Curated collection of high quality avatar styles
const PRESET_AVATARS = [
  { id: 'avatar-1', name: 'Cyberpunk', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyberpunk' },
  { id: 'avatar-2', name: 'Astronaut', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Cosmic' },
  { id: 'avatar-3', name: 'Developer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gaurang' },
  { id: 'avatar-4', name: 'Neon Ninja', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neon' },
  { id: 'avatar-5', name: 'Abstract Art', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=SubSync' },
  { id: 'avatar-6', name: 'Creative Girl', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia' },
  { id: 'avatar-7', name: 'Futuristic AI', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jarvis' },
  { id: 'avatar-8', name: 'Pixel Hero', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hero' },
  { id: 'avatar-9', name: 'Minimalist', url: 'https://api.dicebear.com/7.x/initials/svg?seed=SS' }
];

export default function Settings() {
  const { user, updateUserPhoto } = useAuth();
  const { profile, updateProfileSettings } = useSubscriptions();

  // Settings form states
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${displayName}`);
  const [currency, setCurrency] = useState(profile?.currency || 'INR');
  const [emailAlerts, setEmailAlerts] = useState(profile?.notifications?.email ?? true);
  const [pushAlerts, setPushAlerts] = useState(profile?.notifications?.push ?? true);
  const [reminderDays, setReminderDays] = useState(profile?.notifications?.renewalReminder ?? 3);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectAvatar = (url) => {
    setPhotoURL(url);
    setShowAvatarModal(false);
    toast.success("Avatar selected! Click 'Save Settings' to apply.");
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setPhotoURL(customUrl.trim());
    setShowAvatarModal(false);
    toast.success("Custom photo URL applied!");
  };

  const handleRandomize = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
    setPhotoURL(newUrl);
    toast.success("Generated random avatar!");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileSettings({
        displayName,
        photoURL,
        currency,
        notifications: {
          email: emailAlerts,
          push: pushAlerts,
          renewalReminder: parseInt(reminderDays)
        }
      });

      // Update auth context photo URL instantly
      updateUserPhoto(photoURL);
      toast.success("Profile & Settings saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display">Account Settings</h2>
        <p className="t-text-secondary text-sm mt-1 leading-relaxed">
          Manage your profile avatar, notification timing, and security preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        
        {/* Profile Card with Change Avatar Feature */}
        <GlassCard className="flex flex-col gap-5">
          <h4 className="font-bold t-text text-md font-display flex items-center justify-between border-b t-border pb-3">
            <span className="flex items-center gap-2">
              <User size={16} className="text-brand-purple" /> Profile Information
            </span>
            <span className="text-xs text-brand-purple font-semibold">Step 1 of 2</span>
          </h4>

          {/* Profile Picture & Avatar Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl t-bg-surface border t-border">
            
            {/* Avatar Container with Hover Edit Overlay */}
            <div className="relative group flex-shrink-0 cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <img
                src={photoURL}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-2xl bg-brand-purple/10 border-2 border-brand-purple/30 object-cover shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName || 'User'}`;
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                <Camera size={20} className="text-brand-cyan" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan text-white flex items-center justify-center border-2 border-slate-900 shadow-md">
                <Camera size={13} />
              </span>
            </div>

            {/* Avatar Details & Quick Change Buttons */}
            <div className="flex-1 text-center sm:text-left">
              <h5 className="font-extrabold t-text text-lg font-display">{displayName || user?.displayName || 'SubSync User'}</h5>
              <p className="text-xs t-text-muted mt-0.5">{user?.email}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-purple/15 text-brand-purple hover:bg-brand-purple/25 border border-brand-purple/30 text-xs font-bold transition-all"
                >
                  <Sparkles size={13} /> Choose Avatar
                </button>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl t-bg-surface border t-border t-text-secondary hover:t-text text-xs font-bold transition-all"
                >
                  <RefreshCw size={13} /> Randomize
                </button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs t-text-muted font-semibold uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:outline-none focus:border-brand-purple/40"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs t-text-muted font-semibold uppercase tracking-wider">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:outline-none focus:border-brand-purple/40"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Notifications preferences */}
        <GlassCard className="flex flex-col gap-4">
          <h4 className="font-bold t-text text-md font-display flex items-center gap-2 border-b t-border pb-3">
            <Bell size={16} className="text-brand-cyan" /> Renewal Notifications
          </h4>

          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between cursor-pointer p-1 rounded-lg hover:t-bg-surface transition-colors">
              <div>
                <span className="text-sm font-semibold t-text block">Email Alerts</span>
                <span className="text-[10px] t-text-muted mt-0.5 block">Get billing alerts delivered directly to your inbox.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple/40"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1 rounded-lg hover:t-bg-surface transition-colors">
              <div>
                <span className="text-sm font-semibold t-text block">In-app Bulletins</span>
                <span className="text-[10px] t-text-muted mt-0.5 block">Show warning cards inside your notification pane.</span>
              </div>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple/40"
              />
            </label>

            <div className="flex flex-col gap-1.5 mt-2 max-w-xs text-left">
              <label className="text-xs t-text-muted font-semibold uppercase tracking-wider">Send Reminders</label>
              <select
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                className="px-3.5 py-2 rounded-xl t-bg-surface border t-border t-text text-xs focus:outline-none focus:border-brand-purple/40"
              >
                <option value="1">1 Day Before</option>
                <option value="3">3 Days Before</option>
                <option value="5">5 Days Before</option>
                <option value="7">7 Days Before</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Security & Danger zone */}
        <GlassCard className="flex flex-col gap-4 border-rose-500/10">
          <h4 className="font-bold text-rose-400 text-md font-display flex items-center gap-2 border-b border-rose-500/10 pb-3">
            <Shield size={16} /> Danger Zone
          </h4>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold t-text block">Delete SubSync Profile</span>
              <span className="text-xs t-text-muted mt-0.5 block">Permanently erase all subscriptions databases and activity history logs.</span>
            </div>
            <button
              type="button"
              onClick={() => toast.error("Account deletion is disabled in Demo Mode.")}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold cursor-pointer"
            >
              <Trash2 size={14} /> Delete Profile
            </button>
          </div>
        </GlassCard>

        {/* Save button */}
        <GradientButton
          type="submit"
          disabled={loading}
          className="ml-auto font-bold flex items-center gap-1.5 text-xs px-6 py-3"
        >
          {loading ? 'Saving...' : 'Save Profile & Settings'} <Check size={14} />
        </GradientButton>

      </form>

      {/* Avatar Selection Modal */}
      <Modal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2 border-b t-border pb-3">
            <Camera size={20} className="text-brand-purple" />
            <div>
              <h3 className="text-lg font-bold t-text font-display">Select Profile Picture</h3>
              <p className="text-xs t-text-muted">Choose a preset avatar or paste a custom image URL.</p>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-3 gap-3 my-2">
            {PRESET_AVATARS.map(avatar => (
              <div
                key={avatar.id}
                onClick={() => handleSelectAvatar(avatar.url)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  photoURL === avatar.url
                    ? 'bg-brand-purple/20 border-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.3)] ring-1 ring-brand-purple'
                    : 't-bg-surface t-border hover:border-brand-purple/30 hover:scale-105'
                }`}
              >
                <img src={avatar.url} alt={avatar.name} className="w-14 h-14 rounded-full bg-slate-800" />
                <span className="text-[10px] font-bold t-text truncate max-w-full">{avatar.name}</span>
              </div>
            ))}
          </div>

          {/* Custom Image URL Option */}
          <div className="pt-3 border-t t-border flex flex-col gap-2">
            <label className="text-xs font-bold t-text flex items-center gap-1.5">
              <LinkIcon size={14} className="text-brand-cyan" /> Or Custom Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/my-photo.png"
                className="flex-1 px-3.5 py-2 rounded-xl t-bg-surface border t-border t-text text-xs outline-none focus:border-brand-purple/40"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="px-4 py-2 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
