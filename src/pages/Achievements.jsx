import React, { useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  Trophy, 
  Award, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Star,
  Target,
  Flame,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Achievements() {
  const { subscriptions, activityLogs } = useSubscriptions();

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const pausedSubs = subscriptions.filter(s => s.status === 'paused');

  // Badge criteria evaluation
  const badges = useMemo(() => {
    return [
      {
        id: 'b-1',
        title: 'Galaxy Commander',
        description: 'Added 5 or more active subscription trackers.',
        icon: '🌌',
        xp: 150,
        unlocked: activeSubs.length >= 5
      },
      {
        id: 'b-2',
        title: 'Cancel Ninja',
        description: 'Paused or cancelled an unutilized subscription.',
        icon: '🥷',
        xp: 200,
        unlocked: pausedSubs.length > 0 || activityLogs.some(a => a.type === 'paused' || a.type === 'cancelled')
      },
      {
        id: 'b-3',
        title: 'Annual Optimizer',
        description: 'Opted for yearly billing cycle to save costs.',
        icon: '💎',
        xp: 180,
        unlocked: subscriptions.some(s => s.billingCycle === 'yearly')
      },
      {
        id: 'b-4',
        title: 'Budget Commander',
        description: 'Maintained total monthly spend under control.',
        icon: '🥇',
        xp: 250,
        unlocked: activeSubs.length > 0
      },
      {
        id: 'b-5',
        title: 'Vault Splitter',
        description: 'Configured shared bill splitting in Family Vault.',
        icon: '👥',
        xp: 120,
        unlocked: true
      },
      {
        id: 'b-6',
        title: 'Radar Auditor',
        description: 'Audited subscription utilization frequencies.',
        icon: '🎯',
        xp: 100,
        unlocked: true
      }
    ];
  }, [subscriptions, activityLogs, activeSubs, pausedSubs]);

  // Total XP & User Rank calculation
  const totalXp = useMemo(() => {
    return badges.filter(b => b.unlocked).reduce((acc, b) => acc + b.xp, 0);
  }, [badges]);

  const level = Math.floor(totalXp / 200) + 1;
  const levelXp = totalXp % 200;
  const levelPercent = Math.min(100, Math.round((levelXp / 200) * 100));

  const rankTitle = level >= 5 ? 'Orbit Master' : level >= 3 ? 'Orbit Captain' : 'Orbit Pilot';

  return (
    <div className="flex flex-col gap-6 text-left select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2.5">
            <Trophy className="text-amber-400" size={28} /> Orbit Badges & Achievements
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Earn experience points (XP) and unlock badges as you optimize your subscription portfolio.
          </p>
        </div>
      </div>

      {/* User Level Card */}
      <GlassCard className="!p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-purple/20 to-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-extrabold flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex-shrink-0">
              <Crown size={32} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">Level {level}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
                  {rankTitle}
                </span>
              </div>
              <h3 className="text-2xl font-black t-text font-display mt-0.5">{totalXp} Total XP</h3>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="w-full md:w-72 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="t-text-muted">Level {level} Progress</span>
              <span className="text-brand-purple">{levelXp} / 200 XP</span>
            </div>
            <div className="w-full h-2.5 t-bg-surface rounded-full overflow-hidden border t-border">
              <div
                className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all duration-500"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Badges Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {badges.map((badge, idx) => {
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard className={`h-full flex flex-col justify-between transition-all ${
                badge.unlocked
                  ? 'border-brand-purple/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                  : 'opacity-60 grayscale'
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl p-2.5 rounded-2xl t-bg-surface border t-border shadow-inner">
                      {badge.icon}
                    </span>

                    {badge.unlocked ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl t-bg-surface text-gray-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border t-border">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold t-text text-base font-display mb-1">{badge.title}</h4>
                  <p className="text-xs t-text-muted leading-relaxed">{badge.description}</p>
                </div>

                <div className="pt-3 border-t t-border mt-4 flex items-center justify-between text-xs">
                  <span className="text-brand-purple font-extrabold flex items-center gap-1">
                    <Sparkles size={12} /> +{badge.xp} XP
                  </span>
                  <span className="t-text-muted font-bold">Orbit Reward</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
