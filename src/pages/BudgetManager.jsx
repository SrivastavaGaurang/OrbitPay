import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, calculateMonthlyCost, getCategoryName, getCategoryColor } from '../utils/helpers';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Modal } from '../components/ui/Modal';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Plus, 
  Pencil, 
  Trash2,
  PiggyBank,
  Zap,
  CircleDollarSign,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BudgetManager() {
  const { subscriptions } = useSubscriptions();
  
  // Load budgets from localStorage
  const [budgets, setBudgets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('subsync_budgets')) || {};
    } catch { return {}; }
  });
  
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetForm, setBudgetForm] = useState({ category: '', amount: '' });

  // Calculate spending by category
  const categorySpending = useMemo(() => {
    const spending = {};
    subscriptions
      .filter(s => s.status === 'active')
      .forEach(sub => {
        const cat = sub.category || 'other';
        const monthly = calculateMonthlyCost(sub.cost, sub.billingCycle);
        spending[cat] = (spending[cat] || 0) + monthly;
      });
    return spending;
  }, [subscriptions]);

  // Total monthly spending
  const totalMonthly = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  
  // Overall budget
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);

  // Budget health score (100 = perfect)
  const healthScore = totalBudget > 0 ? Math.max(0, Math.min(100, Math.round((1 - totalMonthly / totalBudget) * 100))) : 100;

  // All categories with spending
  const allCategories = useMemo(() => {
    const cats = new Set([...Object.keys(categorySpending), ...Object.keys(budgets)]);
    return [...cats].map(cat => ({
      id: cat,
      name: getCategoryName(cat),
      color: getCategoryColor(cat),
      spending: categorySpending[cat] || 0,
      budget: budgets[cat] || 0,
      percentage: budgets[cat] ? Math.round(((categorySpending[cat] || 0) / budgets[cat]) * 100) : 0
    })).sort((a, b) => b.spending - a.spending);
  }, [categorySpending, budgets]);

  // Categories over budget
  const overBudgetCount = allCategories.filter(c => c.budget > 0 && c.spending > c.budget).length;

  // Potential monthly savings
  const potentialSavings = allCategories.reduce((acc, cat) => {
    if (cat.budget > 0 && cat.spending > cat.budget) {
      return acc + (cat.spending - cat.budget);
    }
    return acc;
  }, 0);

  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem('subsync_budgets', JSON.stringify(newBudgets));
  };

  const handleSaveBudget = () => {
    if (!budgetForm.category || !budgetForm.amount) return;
    const newBudgets = { ...budgets, [budgetForm.category]: parseFloat(budgetForm.amount) };
    saveBudgets(newBudgets);
    setBudgetForm({ category: '', amount: '' });
    setShowAddBudget(false);
    setEditingCategory(null);
  };

  const handleDeleteBudget = (cat) => {
    const newBudgets = { ...budgets };
    delete newBudgets[cat];
    saveBudgets(newBudgets);
  };

  const handleEditBudget = (cat) => {
    setBudgetForm({ category: cat, amount: budgets[cat] || '' });
    setEditingCategory(cat);
    setShowAddBudget(true);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-rose-400';
    if (percentage >= 80) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-rose-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display">Budget Manager</h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Set spending limits by category and track your subscription budget health.
          </p>
        </div>
        <GradientButton onClick={() => { setBudgetForm({ category: '', amount: '' }); setEditingCategory(null); setShowAddBudget(true); }}>
          <Plus size={16} /> Set Budget
        </GradientButton>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="!p-4" delay={0}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${healthScore >= 70 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : healthScore >= 40 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <Target size={18} />
            </div>
            <div>
              <span className={`text-2xl font-bold font-display ${healthScore >= 70 ? 'text-emerald-400' : healthScore >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>{healthScore}%</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Health Score</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.05}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
              <CircleDollarSign size={18} />
            </div>
            <div>
              <span className="text-xl font-bold t-text font-display">{formatCurrency(totalMonthly)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Monthly Spend</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <Wallet size={18} />
            </div>
            <div>
              <span className="text-xl font-bold t-text font-display">{formatCurrency(totalBudget)}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Total Budget</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4" delay={0.15}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${overBudgetCount > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
              {overBudgetCount > 0 ? <AlertTriangle size={18} /> : <PiggyBank size={18} />}
            </div>
            <div>
              <span className="text-2xl font-bold t-text font-display">{overBudgetCount}</span>
              <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Over Budget</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Category Budget Breakdown */}
      <GlassCard>
        <h3 className="text-lg font-bold t-text font-display mb-5 flex items-center gap-2">
          <BarChart3 size={18} className="text-brand-purple" /> Category Budgets
        </h3>
        
        <div className="flex flex-col gap-4">
          {allCategories.length > 0 ? allCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-semibold t-text">{cat.name}</span>
                  {cat.budget > 0 && cat.spending > cat.budget && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold uppercase">Over!</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs t-text-muted">
                    {formatCurrency(cat.spending)} {cat.budget > 0 ? `/ ${formatCurrency(cat.budget)}` : ''}
                  </span>
                  {cat.budget > 0 && (
                    <span className={`text-xs font-bold ${getStatusColor(cat.percentage)}`}>{cat.percentage}%</span>
                  )}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditBudget(cat.id)} className="p-1 rounded-lg t-text-muted hover:t-text hover:bg-brand-purple/10 transition-colors">
                      <Pencil size={12} />
                    </button>
                    {cat.budget > 0 && (
                      <button onClick={() => handleDeleteBudget(cat.id)} className="p-1 rounded-lg t-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full t-bg-surface overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cat.budget > 0 ? getBarColor(cat.percentage) : 'bg-brand-purple/40'}`}
                  initial={{ width: 0 }}
                  animate={{ width: cat.budget > 0 ? `${Math.min(cat.percentage, 100)}%` : '100%' }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                />
              </div>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 t-text-muted gap-2">
              <Wallet size={32} className="opacity-30" />
              <span className="text-sm font-semibold">No subscriptions yet</span>
              <span className="text-xs">Add subscriptions to start tracking budgets.</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Smart Recommendations */}
      {potentialSavings > 0 && (
        <GlassCard>
          <h3 className="text-lg font-bold t-text font-display mb-4 flex items-center gap-2">
            <Zap size={18} className="text-amber-400" /> Budget Alerts
          </h3>
          <div className="flex flex-col gap-3">
            {allCategories.filter(c => c.budget > 0 && c.spending > c.budget).map(cat => (
              <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold t-text">
                    {cat.name} is over budget by {formatCurrency(cat.spending - cat.budget)}
                  </p>
                  <p className="text-[10px] t-text-muted mt-0.5">
                    Spending {formatCurrency(cat.spending)}/mo vs {formatCurrency(cat.budget)} budget limit.
                  </p>
                </div>
                <span className="text-rose-400 font-bold text-sm">{cat.percentage}%</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t t-border">
              <span className="text-xs font-semibold t-text-muted">Potential savings if budgets are met</span>
              <span className="text-base font-extrabold text-emerald-400 font-display">{formatCurrency(potentialSavings)}/mo</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Add/Edit Budget Modal */}
      <Modal isOpen={showAddBudget} onClose={() => { setShowAddBudget(false); setEditingCategory(null); }}>
        <h3 className="text-lg font-bold t-text font-display mb-4">
          {editingCategory ? 'Edit Budget' : 'Set Category Budget'}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold t-text-muted mb-1.5 uppercase tracking-wider">Category</label>
            <select
              value={budgetForm.category}
              onChange={e => setBudgetForm({ ...budgetForm, category: e.target.value })}
              disabled={!!editingCategory}
              className="w-full px-4 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:border-brand-purple/50 outline-none transition-colors"
            >
              <option value="">Select a category</option>
              {Object.keys(categorySpending).map(cat => (
                <option key={cat} value={cat}>{getCategoryName(cat)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold t-text-muted mb-1.5 uppercase tracking-wider">Monthly Budget (₹)</label>
            <input
              type="number"
              value={budgetForm.amount}
              onChange={e => setBudgetForm({ ...budgetForm, amount: e.target.value })}
              placeholder="e.g. 2000"
              className="w-full px-4 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm focus:border-brand-purple/50 outline-none transition-colors"
            />
          </div>
          <GradientButton onClick={handleSaveBudget} className="w-full mt-2">
            {editingCategory ? 'Update Budget' : 'Save Budget'}
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
}
