import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { SpendingChart } from '../components/features/SpendingChart';
import { CategoryDonut } from '../components/features/CategoryDonut';
import { GlassCard } from '../components/ui/GlassCard';
import { formatCurrency } from '../utils/helpers';
import { Sparkles, TrendingUp, DollarSign, Wallet, ShieldAlert } from 'lucide-react';

export default function Analytics() {
  const { subscriptions, analytics } = useSubscriptions();

  // Get active currency
  const currency = subscriptions[0]?.currency || 'INR';

  // Calculate highest costing active subscription
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const highestSub = activeSubs.length > 0 
    ? [...activeSubs].sort((a, b) => b.cost - a.cost)[0]
    : null;

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Analytics & Insights</h2>
        <p className="text-gray-400 text-sm mt-1 leading-relaxed">
          Deep-dive analysis of your monthly recurring investments.
        </p>
      </div>

      {/* Analytics Overview Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Total Monthly Spend */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider block font-semibold">Total Monthly</span>
            <span className="text-2xl font-bold text-white font-display block mt-1">
              {formatCurrency(analytics.totalMonthlySpend, currency)}
            </span>
          </div>
        </GlassCard>

        {/* Highest Costing Subscription */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
            <Wallet size={20} />
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider block font-semibold">Highest Cost Tracker</span>
            <span className="text-lg font-bold text-white font-display block mt-1 truncate max-w-[180px]">
              {highestSub ? `${highestSub.name} (${formatCurrency(highestSub.cost, highestSub.currency)})` : 'None'}
            </span>
          </div>
        </GlassCard>

        {/* Potential Savings */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider block font-semibold">Monthly Savings</span>
            <span className="text-2xl font-bold text-white font-display block mt-1">
              {formatCurrency(analytics.savingsPotential, currency)}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Spend Charts Area */}
      <div className="grid lg:grid-cols-12 gap-5">
        
        {/* Spending trend over time */}
        <GlassCard className="lg:col-span-7 flex flex-col justify-between">
          <div className="mb-6">
            <h4 className="font-bold text-white text-lg font-display">Expenditure Timelines</h4>
            <p className="text-xs text-gray-400 mt-1">Recurring trends and seasonal variation estimates.</p>
          </div>
          <SpendingChart subscriptions={subscriptions} />
        </GlassCard>

        {/* Categories Distribution Donut */}
        <GlassCard className="lg:col-span-5 flex flex-col justify-between">
          <div className="mb-6">
            <h4 className="font-bold text-white text-lg font-display">Categories Distribution</h4>
            <p className="text-xs text-gray-400 mt-1">Breakdown of expenditure by service genres.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <CategoryDonut categorySpend={analytics.categorySpend} />
          </div>
        </GlassCard>
      </div>

      {/* Optimization Insights list */}
      <GlassCard>
        <div className="mb-6">
          <h4 className="font-bold text-white text-lg font-display">Subscription Optimization Audit</h4>
          <p className="text-xs text-gray-400 mt-1">Derived savings opportunities based on active and paused trackers.</p>
        </div>

        <div className="flex flex-col gap-4">
          {analytics.pausedCount > 0 ? (
            <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-emerald-300">
              <Sparkles className="flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-white">Paused Subscriptions Benefit</p>
                <p className="text-xs text-gray-400 mt-1">You are currently pausing {analytics.pausedCount} subscriptions. This is keeping {formatCurrency(analytics.savingsPotential, currency)} in your account monthly. Resume them only when needed.</p>
              </div>
            </div>
          ) : null}

          {highestSub && highestSub.cost > 1000 ? (
            <div className="flex items-start gap-3 bg-brand-cyan/5 border border-brand-cyan/20 p-4 rounded-xl text-brand-cyan">
              <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-white">High Value Tracker Alert</p>
                <p className="text-xs text-gray-400 mt-1">Your subscription to {highestSub.name} costs {formatCurrency(highestSub.cost, highestSub.currency)} which accounts for a significant portion of your total monthly recurring cost. Consider checking if you share this plan or have subscription options.</p>
              </div>
            </div>
          ) : null}

          {subscriptions.length > 5 ? (
            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-amber-300">
              <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-white">Subscription Consolidation Opportunity</p>
                <p className="text-xs text-gray-400 mt-1">You are tracking {subscriptions.length} recurring expenses. Check if there are bundled packages (like Apple One or Google One) to consolidate separate services and reduce overhead costs.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl text-gray-300">
              <Sparkles className="flex-shrink-0 mt-0.5 text-brand-purple" size={18} />
              <div>
                <p className="text-sm font-semibold text-white">All Clear!</p>
                <p className="text-xs text-gray-400 mt-1">Your subscription count is moderate and optimization indices are green. No urgent action required.</p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

    </div>
  );
}
