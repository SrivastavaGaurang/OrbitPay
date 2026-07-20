import React, { useMemo, useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, calculateMonthlyCost, getCategoryName, daysUntilRenewal } from '../utils/helpers';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  AlertCircle, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Zap,
  ArrowRight,
  FileDown,
  RefreshCw,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Insights() {
  const { subscriptions } = useSubscriptions();
  const [exportStatus, setExportStatus] = useState(null);

  const activeSubs = subscriptions.filter(s => s.status === 'active');

  // Generate smart insights
  const insights = useMemo(() => {
    const results = [];
    if (activeSubs.length === 0) return results;

    // 1. Most expensive subscription
    const sorted = [...activeSubs].sort((a, b) => calculateMonthlyCost(b.cost, b.billingCycle) - calculateMonthlyCost(a.cost, a.billingCycle));
    const mostExpensive = sorted[0];
    if (mostExpensive) {
      const monthCost = calculateMonthlyCost(mostExpensive.cost, mostExpensive.billingCycle);
      results.push({
        icon: DollarSign,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/20',
        title: 'Biggest Expense',
        description: `${mostExpensive.name} costs you ${formatCurrency(monthCost)}/month — that's ${Math.round((monthCost / activeSubs.reduce((a, s) => a + calculateMonthlyCost(s.cost, s.billingCycle), 0)) * 100)}% of your total spend.`,
        type: 'info',
        priority: 1
      });
    }

    // 2. Total yearly projection
    const monthlyTotal = activeSubs.reduce((a, s) => a + calculateMonthlyCost(s.cost, s.billingCycle), 0);
    const yearlyProjection = monthlyTotal * 12;
    results.push({
      icon: TrendingUp,
      iconColor: 'text-brand-cyan',
      iconBg: 'bg-brand-cyan/10 border-brand-cyan/20',
      title: 'Yearly Projection',
      description: `At current rates, you'll spend ${formatCurrency(yearlyProjection)} this year on subscriptions. That's ${formatCurrency(monthlyTotal)} per month.`,
      type: 'insight',
      priority: 2
    });

    // 3. Check for duplicate categories
    const catCounts = {};
    activeSubs.forEach(sub => {
      const cat = sub.category || 'other';
      if (!catCounts[cat]) catCounts[cat] = [];
      catCounts[cat].push(sub);
    });
    Object.entries(catCounts).forEach(([cat, subs]) => {
      if (subs.length >= 2) {
        const total = subs.reduce((a, s) => a + calculateMonthlyCost(s.cost, s.billingCycle), 0);
        results.push({
          icon: AlertCircle,
          iconColor: 'text-rose-400',
          iconBg: 'bg-rose-500/10 border-rose-500/20',
          title: `Overlapping ${getCategoryName(cat)} Subscriptions`,
          description: `You have ${subs.length} ${getCategoryName(cat)} subscriptions (${subs.map(s => s.name).join(', ')}) costing ${formatCurrency(total)}/mo total. Consider consolidating.`,
          type: 'warning',
          priority: 3
        });
      }
    });

    // 4. Upcoming renewals
    const urgentRenewals = activeSubs.filter(s => {
      const d = daysUntilRenewal(s.nextRenewal);
      return d >= 0 && d <= 3;
    });
    if (urgentRenewals.length > 0) {
      results.push({
        icon: Clock,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/20',
        title: `${urgentRenewals.length} Renewal${urgentRenewals.length > 1 ? 's' : ''} in 3 Days`,
        description: `${urgentRenewals.map(s => s.name).join(', ')} ${urgentRenewals.length === 1 ? 'is' : 'are'} renewing soon. Total: ${formatCurrency(urgentRenewals.reduce((a, s) => a + s.cost, 0))}`,
        type: 'urgent',
        priority: 0
      });
    }

    // 5. Savings tip — switch to yearly
    const monthlySubs = activeSubs.filter(s => s.billingCycle === 'monthly' && calculateMonthlyCost(s.cost, s.billingCycle) >= 100);
    if (monthlySubs.length > 0) {
      const potentialSave = monthlySubs.reduce((a, s) => a + calculateMonthlyCost(s.cost, s.billingCycle) * 0.15, 0); // ~15% savings for yearly
      results.push({
        icon: Lightbulb,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Save with Annual Plans',
        description: `${monthlySubs.length} subscription${monthlySubs.length > 1 ? 's' : ''} could save ~${formatCurrency(potentialSave * 12)}/year by switching to annual billing (~15% discount).`,
        type: 'tip',
        priority: 4
      });
    }

    // 6. Subscription density
    if (activeSubs.length >= 5) {
      results.push({
        icon: Zap,
        iconColor: 'text-brand-purple',
        iconBg: 'bg-brand-purple/10 border-brand-purple/20',
        title: 'Subscription Portfolio',
        description: `You manage ${activeSubs.length} active subscriptions across ${Object.keys(catCounts).length} categories. You're in the top tier of subscription managers!`,
        type: 'info',
        priority: 5
      });
    }

    // 7. Cost per day
    const dailyCost = monthlyTotal / 30;
    results.push({
      icon: RefreshCw,
      iconColor: 'text-brand-pink',
      iconBg: 'bg-brand-pink/10 border-brand-pink/20',
      title: 'Daily Cost',
      description: `Your subscriptions cost ${formatCurrency(dailyCost)} per day, or ${formatCurrency(monthlyTotal / 4)} per week. That's like a ${dailyCost < 50 ? 'coffee' : dailyCost < 200 ? 'meal' : 'fancy dinner'} every day.`,
      type: 'info',
      priority: 6
    });

    return results.sort((a, b) => a.priority - b.priority);
  }, [activeSubs]);

  // Export functions
  const exportAsCSV = () => {
    const headers = ['Name', 'Category', 'Cost', 'Currency', 'Billing Cycle', 'Status', 'Next Renewal', 'Monthly Cost'];
    const rows = subscriptions.map(sub => [
      sub.name,
      getCategoryName(sub.category),
      sub.cost,
      sub.currency || 'INR',
      sub.billingCycle,
      sub.status,
      sub.nextRenewal || '',
      calculateMonthlyCost(sub.cost, sub.billingCycle).toFixed(2)
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subsync_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('csv');
    setTimeout(() => setExportStatus(null), 3000);
  };

  const exportAsJSON = () => {
    const data = subscriptions.map(sub => ({
      name: sub.name,
      category: getCategoryName(sub.category),
      cost: sub.cost,
      currency: sub.currency || 'INR',
      billingCycle: sub.billingCycle,
      status: sub.status,
      nextRenewal: sub.nextRenewal,
      monthlyCost: calculateMonthlyCost(sub.cost, sub.billingCycle)
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subsync_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('json');
    setTimeout(() => setExportStatus(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2">
          <Brain size={28} className="text-brand-purple" /> Smart Insights
        </h2>
        <p className="t-text-secondary text-sm mt-1 leading-relaxed">
          AI-powered analysis of your subscription habits with actionable recommendations.
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {insights.length > 0 ? insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <GlassCard className="h-full" delay={0}>
                <div className="flex gap-3">
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 h-fit ${insight.iconBg}`}>
                    <Icon size={18} className={insight.iconColor} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-sm font-bold t-text font-display">{insight.title}</h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        insight.type === 'urgent' ? 'bg-rose-500/10 text-rose-400' :
                        insight.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                        insight.type === 'tip' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-brand-purple/10 text-brand-purple'
                      }`}>
                        {insight.type}
                      </span>
                    </div>
                    <p className="text-xs t-text-secondary leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        }) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 t-text-muted gap-2">
            <Sparkles size={32} className="opacity-30" />
            <span className="text-sm font-semibold">No insights yet</span>
            <span className="text-xs">Add some subscriptions to get smart recommendations.</span>
          </div>
        )}
      </div>

      {/* Export Data Section */}
      <GlassCard>
        <h3 className="text-lg font-bold t-text font-display mb-2 flex items-center gap-2">
          <FileDown size={18} className="text-brand-cyan" /> Export Your Data
        </h3>
        <p className="text-xs t-text-secondary mb-5">Download your subscription data for external analysis or backup.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportAsCSV}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl t-bg-surface border t-border hover:border-brand-purple/30 t-text text-sm font-semibold transition-all hover:bg-brand-purple/5"
          >
            <FileDown size={16} className="text-emerald-400" />
            Export as CSV
            {exportStatus === 'csv' && <span className="text-[10px] text-emerald-400 font-bold">✓ Downloaded</span>}
          </button>
          <button
            onClick={exportAsJSON}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl t-bg-surface border t-border hover:border-brand-purple/30 t-text text-sm font-semibold transition-all hover:bg-brand-purple/5"
          >
            <FileDown size={16} className="text-brand-cyan" />
            Export as JSON
            {exportStatus === 'json' && <span className="text-[10px] text-brand-cyan font-bold">✓ Downloaded</span>}
          </button>
        </div>
      </GlassCard>

      {/* Fun Stats */}
      {activeSubs.length > 0 && (
        <GlassCard>
          <h3 className="text-lg font-bold t-text font-display mb-4 flex items-center gap-2">
            <Star size={18} className="text-amber-400" /> Fun Facts
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl t-bg-surface border t-border">
              <span className="text-3xl font-extrabold text-gradient font-display block">
                {activeSubs.length}
              </span>
              <span className="text-[10px] t-text-muted uppercase tracking-wider font-bold">Active Subscriptions</span>
            </div>
            <div className="text-center p-4 rounded-xl t-bg-surface border t-border">
              <span className="text-3xl font-extrabold text-gradient-pink font-display block">
                {formatCurrency(activeSubs.reduce((a, s) => a + calculateMonthlyCost(s.cost, s.billingCycle), 0) * 12)}
              </span>
              <span className="text-[10px] t-text-muted uppercase tracking-wider font-bold">Yearly Cost</span>
            </div>
            <div className="text-center p-4 rounded-xl t-bg-surface border t-border">
              <span className="text-3xl font-extrabold text-gradient font-display block">
                {[...new Set(activeSubs.map(s => s.category))].length}
              </span>
              <span className="text-[10px] t-text-muted uppercase tracking-wider font-bold">Categories</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
