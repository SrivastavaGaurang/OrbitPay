import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useCurrency } from '../context/CurrencyContext';
import { calculateMonthlyCost } from '../utils/helpers';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Radar,
  Flame,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FREQUENCY_SCORES = {
  daily: { score: 100, label: 'Daily (High Usage)', color: 'text-emerald-400' },
  weekly: { score: 75, label: 'Weekly (Good Use)', color: 'text-brand-cyan' },
  monthly: { score: 45, label: 'Monthly (Moderate)', color: 'text-amber-400' },
  rarely: { score: 20, label: 'Rarely (Zombie Risk)', color: 'text-rose-400' },
  never: { score: 0, label: 'Never (Active Zombie)', color: 'text-rose-500 font-extrabold' }
};

export default function ZombieRadar() {
  const { subscriptions, updateSub } = useSubscriptions();
  const { formatVal } = useCurrency();
  const navigate = useNavigate();

  // Usage state per subscription stored in localStorage
  const [usageMap, setUsageMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orbitpay_zombie_usage')) || {
        'sub-1': 'daily',
        'sub-2': 'daily',
        'sub-3': 'weekly',
        'sub-4': 'rarely',
        'sub-5': 'monthly'
      };
    } catch { return {}; }
  });

  const activeSubs = useMemo(() => {
    return subscriptions.filter(s => s.status === 'active');
  }, [subscriptions]);

  const handleUsageChange = (subId, freq) => {
    const updated = { ...usageMap, [subId]: freq };
    setUsageMap(updated);
    localStorage.setItem('orbitpay_zombie_usage', JSON.stringify(updated));
    toast.success("Usage frequency updated!");
  };

  // Evaluate Zombie Subscriptions & Health Score
  const auditResults = useMemo(() => {
    let totalScore = 0;
    let zombieCount = 0;
    let potentialWaste = 0;

    const evaluated = activeSubs.map(sub => {
      const freq = usageMap[sub.id] || 'weekly';
      const freqInfo = FREQUENCY_SCORES[freq] || FREQUENCY_SCORES.weekly;
      const monthlyCost = calculateMonthlyCost(sub.cost, sub.billingCycle);

      // Score adjusts lower if cost is high and frequency is low
      let vfmScore = freqInfo.score;
      if (monthlyCost > 1000 && (freq === 'rarely' || freq === 'never')) {
        vfmScore = Math.max(0, vfmScore - 15);
      }

      const isZombie = freq === 'rarely' || freq === 'never';
      if (isZombie) {
        zombieCount++;
        potentialWaste += monthlyCost;
      }

      totalScore += vfmScore;

      return {
        ...sub,
        monthlyCost,
        frequency: freq,
        freqLabel: freqInfo.label,
        vfmScore,
        isZombie
      };
    });

    const overallHealth = activeSubs.length > 0 ? Math.round(totalScore / activeSubs.length) : 100;

    return {
      evaluated,
      overallHealth,
      zombieCount,
      potentialWaste
    };
  }, [activeSubs, usageMap]);

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2.5">
            <Radar className="text-rose-400" size={28} /> Zombie Subscription Radar
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Scan your active portfolio for idle subscriptions and optimize your value-per-hour score.
          </p>
        </div>
      </div>

      {/* Portfolio Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${auditResults.overallHealth >= 75 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
              <Zap size={20} />
            </div>
            <div>
              <span className="text-2xl font-extrabold t-text font-display">{auditResults.overallHealth}%</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">VFM Health Score</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-rose-400 font-display">{auditResults.zombieCount}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">Zombies Detected</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingDown size={20} />
            </div>
            <div>
              <span className="text-xl font-extrabold text-amber-400 font-display">{formatVal(auditResults.potentialWaste)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">Monthly Idle Waste</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-xl font-extrabold text-brand-cyan font-display">{formatVal(auditResults.potentialWaste * 12)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">Yearly Recovery</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Radar Subscription Audit List */}
      <GlassCard className="flex flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b t-border">
          <div>
            <h3 className="font-extrabold t-text text-base font-display">Subscription Utilization Radar</h3>
            <p className="text-xs t-text-muted mt-0.5">Set how frequently you use each service to uncover value scores.</p>
          </div>

          <span className="text-xs text-brand-purple font-bold">
            {activeSubs.length} Active Audited
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {auditResults.evaluated.map((sub, idx) => {
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${sub.isZombie
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 't-bg-surface t-border'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden p-1 flex-shrink-0"
                    style={{ backgroundColor: (sub.color || '#8b5cf6') + '22', border: `1px solid ${sub.color || '#8b5cf6'}44` }}
                  >
                    {sub.logo ? (
                      <img src={sub.logo} alt={sub.name} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold t-text uppercase" style={{ display: sub.logo ? 'none' : 'flex' }}>
                      {sub.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold t-text text-base font-display flex items-center gap-2">
                      {sub.name}
                      {sub.isZombie && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle size={10} /> Zombie Risk
                        </span>
                      )}
                    </h4>
                    <span className="text-xs t-text-muted">{formatVal(sub.monthlyCost, sub.currency)} / month</span>
                  </div>
                </div>

                {/* Usage Selector Pill */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs t-text-muted font-bold">Usage:</span>
                    <select
                      value={sub.frequency}
                      onChange={e => handleUsageChange(sub.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl t-bg-surface border t-border t-text text-xs font-bold focus:outline-none focus:border-brand-purple/40 cursor-pointer"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="rarely">Rarely</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  {/* Score badge */}
                  <div className="text-right min-w-[70px]">
                    <span className={`text-sm font-extrabold block font-display ${sub.vfmScore >= 75 ? 'text-emerald-400' : sub.vfmScore >= 45 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                      {sub.vfmScore}/100
                    </span>
                    <span className="text-[9px] t-text-muted uppercase font-bold">VFM Score</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
