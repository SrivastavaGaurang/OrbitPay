import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useCurrency } from '../context/CurrencyContext';
import { calculateMonthlyCost } from '../utils/helpers';
import { GlassCard } from '../components/ui/GlassCard';
import { Modal } from '../components/ui/Modal';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Sparkles, 
  CheckSquare, 
  Square, 
  FileText, 
  Copy, 
  ExternalLink,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Simulator() {
  const { subscriptions } = useSubscriptions();
  const { formatVal, symbol } = useCurrency();

  const activeSubs = useMemo(() => {
    return subscriptions.filter(s => s.status === 'active');
  }, [subscriptions]);

  // Selected subscription IDs to simulate cancelling
  const [cancelledIds, setCancelledIds] = useState([]);
  const [selectedSubForTemplate, setSelectedSubForTemplate] = useState(null);
  const [annualReturnRate, setAnnualReturnRate] = useState(10); // 10% annual return

  const toggleCancel = (id) => {
    setCancelledIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (cancelledIds.length === activeSubs.length) {
      setCancelledIds([]);
    } else {
      setCancelledIds(activeSubs.map(s => s.id));
    }
  };

  // Monthly savings from cancelled subscriptions
  const monthlySavings = useMemo(() => {
    return activeSubs
      .filter(s => cancelledIds.includes(s.id))
      .reduce((acc, sub) => acc + calculateMonthlyCost(sub.cost, sub.billingCycle), 0);
  }, [activeSubs, cancelledIds]);

  const yearlySavings = monthlySavings * 12;

  // Compound Growth calculation: Future Value = P * [((1 + r)^n - 1) / r] * (1 + r)
  const calculateCompoundGrowth = (years) => {
    const r = annualReturnRate / 100 / 12;
    const n = years * 12;
    if (monthlySavings === 0) return 0;
    const fv = monthlySavings * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    return Math.round(fv);
  };

  const savings1Yr = useMemo(() => calculateCompoundGrowth(1), [monthlySavings, annualReturnRate]);
  const savings3Yr = useMemo(() => calculateCompoundGrowth(3), [monthlySavings, annualReturnRate]);
  const savings5Yr = useMemo(() => calculateCompoundGrowth(5), [monthlySavings, annualReturnRate]);

  // Chart data for 5 years (60 months)
  const chartData = useMemo(() => {
    const data = [];
    const r = annualReturnRate / 100 / 12;
    for (let month = 1; month <= 60; month += 3) {
      const year = (month / 12).toFixed(1);
      const rawSavings = monthlySavings * month;
      const compoundValue = monthlySavings === 0 ? 0 : Math.round(monthlySavings * (((Math.pow(1 + r, month) - 1) / r) * (1 + r)));
      data.push({
        month: `Yr ${year}`,
        Saved: Math.round(rawSavings),
        InvestedValue: compoundValue
      });
    }
    return data;
  }, [monthlySavings, annualReturnRate]);

  const copyCancellationTemplate = (sub) => {
    const template = `Subject: Cancellation Request for ${sub.name} Account

Dear ${sub.name} Support Team,

I am writing to formally request the immediate cancellation of my subscription for ${sub.name}.

Subscription Details:
- Service: ${sub.name}
- Billing Cycle: ${sub.billingCycle}
- Cost: ${formatVal(sub.cost, sub.currency)}

Please confirm the receipt of this request and verify that no further charges will be billed to my account.

Thank you,
Sent via OrbitPay Subscription Command`;

    navigator.clipboard.writeText(template);
    toast.success("Cancellation template copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2.5">
            <Calculator className="text-brand-purple" size={28} /> Cancellation & Savings Simulator
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Simulate cancelling subscriptions to watch your compound investment growth snowball over 5 years.
          </p>
        </div>
      </div>

      {/* Simulator Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PiggyBank size={20} />
            </div>
            <div>
              <span className="text-xl font-extrabold text-emerald-400 font-display">{formatVal(monthlySavings)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">Monthly Savings</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <TrendingUp size={20} />
            </div>
            <div>
              <span className="text-xl font-extrabold t-text font-display">{formatVal(savings1Yr)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">1-Year Value</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-xl font-extrabold t-text font-display">{formatVal(savings3Yr)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">3-Year Growth</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame size={20} />
            </div>
            <div>
              <span className="text-xl font-black text-gradient font-display">{formatVal(savings5Yr)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-bold mt-0.5">5-Year Snowball</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Subscription Selectors List */}
        <GlassCard className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b t-border">
            <div>
              <h3 className="font-extrabold t-text text-base font-display">Select Subscriptions to Cancel</h3>
              <p className="text-xs t-text-muted mt-0.5">Toggle to simulate monthly savings.</p>
            </div>
            <button
              onClick={selectAll}
              className="text-xs text-brand-purple hover:underline font-bold"
            >
              {cancelledIds.length === activeSubs.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {activeSubs.length > 0 ? activeSubs.map(sub => {
              const isCancelled = cancelledIds.includes(sub.id);
              const monthlyCost = calculateMonthlyCost(sub.cost, sub.billingCycle);

              return (
                <div
                  key={sub.id}
                  onClick={() => toggleCancel(sub.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isCancelled
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 't-bg-surface t-border hover:border-brand-purple/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-brand-purple">
                      {isCancelled ? (
                        <CheckSquare size={18} className="text-rose-400" />
                      ) : (
                        <Square size={18} className="t-text-muted" />
                      )}
                    </button>

                    <div>
                      <h4 className={`text-sm font-bold font-display ${isCancelled ? 'line-through t-text-muted' : 't-text'}`}>
                        {sub.name}
                      </h4>
                      <span className="text-[10px] t-text-muted capitalize">{sub.billingCycle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-display ${isCancelled ? 'text-emerald-400 font-extrabold' : 't-text'}`}>
                      +{formatVal(monthlyCost, sub.currency)}/mo
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubForTemplate(sub);
                      }}
                      className="p-1.5 rounded-lg t-bg-surface border t-border t-text-muted hover:t-text hover:bg-brand-purple/10 transition-colors"
                      title="Generate Cancellation Template"
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs t-text-muted text-center py-8">No active subscriptions available.</p>
            )}
          </div>
        </GlassCard>

        {/* 5-Year Growth Graph */}
        <GlassCard className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b t-border">
            <div>
              <h3 className="font-extrabold t-text text-base font-display flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" /> 5-Year Compound Growth Chart
              </h3>
              <p className="text-xs t-text-muted mt-0.5">Assumes monthly savings are invested at annual return rate.</p>
            </div>

            {/* Return rate slider */}
            <div className="flex items-center gap-2 t-bg-surface px-3 py-1 rounded-xl border t-border text-xs font-bold">
              <span className="t-text-muted">Return:</span>
              <select
                value={annualReturnRate}
                onChange={e => setAnnualReturnRate(Number(e.target.value))}
                className="t-text font-bold bg-transparent outline-none cursor-pointer"
              >
                <option value={6}>6% / year</option>
                <option value={8}>8% / year</option>
                <option value={10}>10% / year (Index Fund)</option>
                <option value={12}>12% / year (High Growth)</option>
              </select>
            </div>
          </div>

          {/* Area Chart */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${symbol}${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-premium p-3 rounded-xl border t-border text-xs">
                          <p className="font-bold t-text mb-1">{payload[0].payload.month}</p>
                          <p className="text-emerald-400 font-extrabold">
                            Invested Value: {formatVal(payload[0].value)}
                          </p>
                          <p className="t-text-muted mt-0.5">
                            Raw Cash Saved: {formatVal(payload[0].payload.Saved)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="InvestedValue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInvested)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t t-border text-xs">
            <span className="t-text-muted">Direct Cash Saved: <strong className="t-text">{formatVal(yearlySavings * 5)}</strong></span>
            <span className="text-emerald-400 font-extrabold">Compound Interest Earned: +{formatVal(savings5Yr - (yearlySavings * 5))}</span>
          </div>
        </GlassCard>
      </div>

      {/* Cancellation Template Modal */}
      <Modal isOpen={!!selectedSubForTemplate} onClose={() => setSelectedSubForTemplate(null)}>
        {selectedSubForTemplate && (
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b t-border pb-3">
              <h3 className="text-lg font-bold t-text font-display flex items-center gap-2">
                <FileText size={18} className="text-brand-purple" /> Cancellation Request Template
              </h3>
              <span className="text-xs font-bold text-brand-purple">{selectedSubForTemplate.name}</span>
            </div>

            <div className="p-4 rounded-xl t-bg-surface border t-border text-xs font-mono t-text leading-relaxed whitespace-pre-wrap">
{`Subject: Cancellation Request for ${selectedSubForTemplate.name} Account

Dear ${selectedSubForTemplate.name} Support Team,

I am writing to request the cancellation of my subscription for ${selectedSubForTemplate.name}.

Subscription Details:
- Service: ${selectedSubForTemplate.name}
- Billing Cycle: ${selectedSubForTemplate.billingCycle}
- Current Cost: ${formatVal(selectedSubForTemplate.cost, selectedSubForTemplate.currency)}

Please confirm receipt and verify that no further recurring charges will be billed to my account.

Thank you,
Sent via OrbitPay Subscription Command`}
            </div>

            <button
              onClick={() => copyCancellationTemplate(selectedSubForTemplate)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-bold transition-all shadow-md"
            >
              <Copy size={14} /> Copy Template to Clipboard
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
