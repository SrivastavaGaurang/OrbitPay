import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscriptions } from '../context/SubscriptionContext';
import { StatsCard } from '../components/ui/StatsCard';
import { SubscriptionGalaxy } from '../components/features/SubscriptionGalaxy';
import { SpendingChart } from '../components/features/SpendingChart';
import { CategoryDonut } from '../components/features/CategoryDonut';
import { RenewalTimeline } from '../components/features/RenewalTimeline';
import { ActivityFeed } from '../components/features/ActivityFeed';
import { GlassCard } from '../components/ui/GlassCard';
import { Sparkles, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { subscriptions, analytics, loading } = useSubscriptions();
  const navigate = useNavigate();

  // Get current active currency (default INR)
  const currency = subscriptions[0]?.currency || 'INR';

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2">
            Welcome back, {user?.displayName || 'User'} <span className="animate-[wave_1.5s_infinite]">👋</span>
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Here's an overview of your active subscriptions and savings potential.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/subscriptions/add')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
        >
          <Plus size={14} /> Add Subscription
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard
          title="Monthly Spend"
          value={analytics.totalMonthlySpend}
          prefix={currency === 'INR' ? '₹' : '$'}
          icon="DollarSign"
          trend={12}
          trendLabel="vs last month"
          delay={0.05}
        />
        <StatsCard
          title="Active Trackers"
          value={analytics.activeCount}
          icon="CreditCard"
          trend={0}
          trendLabel="new this month"
          delay={0.1}
        />
        <StatsCard
          title="Due in 7 Days"
          value={analytics.upcomingCount}
          icon="Calendar"
          delay={0.15}
        />
        <StatsCard
          title="Savings Potential"
          value={analytics.savingsPotential}
          prefix={currency === 'INR' ? '₹' : '$'}
          icon="Sparkles"
          delay={0.2}
        />
      </div>

      {/* Galaxy and Donut Visualization Columns */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Interactive Subscription Galaxy */}
        <GlassCard className="lg:col-span-7 flex flex-col justify-between" delay={0.25}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-bold t-text text-lg font-display">Subscription Galaxy</h4>
              <p className="text-xs t-text-secondary mt-1">Planets orbit around central spendings sized by relative costs.</p>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} className="animate-spin text-brand-cyan" /> 3D-Orbit Mode
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <SubscriptionGalaxy 
              subscriptions={subscriptions} 
              totalSpend={analytics.totalMonthlySpend} 
              currency={currency} 
            />
          </div>
        </GlassCard>

        {/* Categories Distribution Donut */}
        <GlassCard className="lg:col-span-5 flex flex-col justify-between" delay={0.3}>
          <div>
            <h4 className="font-bold t-text text-lg font-display">Category Breakdown</h4>
            <p className="text-xs t-text-secondary mt-1">Expenses structured by service types.</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <CategoryDonut categorySpend={analytics.categorySpend} />
          </div>
        </GlassCard>
      </div>

      {/* History and Timeline Columns */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Expenditure History Area Line Chart */}
        <GlassCard className="lg:col-span-7" delay={0.35}>
          <div className="mb-6">
            <h4 className="font-bold t-text text-lg font-display">Spending Trends</h4>
            <p className="text-xs t-text-secondary mt-1">Monthly recurring cost history over the last 6 months.</p>
          </div>
          <SpendingChart subscriptions={subscriptions} />
        </GlassCard>

        {/* Upcoming Renewals and Activities side-list */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Timeline */}
          <GlassCard className="flex-1" delay={0.4}>
            <div className="mb-5">
              <h4 className="font-bold t-text text-md font-display">Upcoming Renewals</h4>
              <p className="text-xs t-text-secondary mt-0.5">Urgent payments due in the next few days.</p>
            </div>
            <RenewalTimeline limit={3} />
          </GlassCard>

          {/* Activity Feed */}
          <GlassCard className="flex-1" delay={0.45}>
            <div className="mb-5">
              <h4 className="font-bold t-text text-md font-display">Recent Activity</h4>
              <p className="text-xs t-text-secondary mt-0.5">Chronological record of updates.</p>
            </div>
            <ActivityFeed limit={3} />
          </GlassCard>
        </div>
      </div>

    </div>
  );
}
