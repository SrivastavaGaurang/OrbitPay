import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { formatCurrency, daysUntilRenewal, calculateMonthlyCost, getCategoryName } from '../utils/helpers';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Grid, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter,
  Plus,
  CheckCircle2,
  Sparkles,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Calendar() {
  const { subscriptions } = useSubscriptions();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'timeline'
  const [filterCategory, setFilterCategory] = useState('all');
  const [paidStatus, setPaidStatus] = useState({});

  // Active subscriptions with nextRenewal
  const activeSubs = useMemo(() => {
    return subscriptions.filter(s => s.status === 'active' && s.nextRenewal);
  }, [subscriptions]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOffset = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOffset(year, month);

  // Today's date string
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;

  // Calendar cells generation with prev/next month padding
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const cells = [];
  
  // Previous month trailing days
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push({ day, dateStr: null, isOtherMonth: true });
  }
  
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDay = d.toString().padStart(2, '0');
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const dateObj = new Date(year, month, d);
    const dayNameShort = dayNames[dateObj.getDay()];
    cells.push({ day: d, dayNameShort, dateStr, isOtherMonth: false });
  }
  
  // Next month leading days
  const remaining = 35 - cells.length > 0 ? 35 - cells.length : (42 - cells.length > 0 ? 42 - cells.length : 0);
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, dateStr: null, isOtherMonth: true });
  }

  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  // Subscriptions on a specific date (matching day & month of nextRenewal)
  const getSubsForDate = (dateStr) => {
    if (!dateStr) return [];
    return activeSubs.filter(sub => {
      if (!sub.nextRenewal) return false;
      const subDate = new Date(sub.nextRenewal);
      const calendarDate = new Date(dateStr);
      return subDate.getDate() === calendarDate.getDate() &&
             subDate.getMonth() === calendarDate.getMonth() &&
             subDate.getFullYear() === calendarDate.getFullYear();
    });
  };

  // Monthly spending total
  const monthlyTotal = useMemo(() => {
    return activeSubs.reduce((acc, sub) => acc + calculateMonthlyCost(sub.cost, sub.billingCycle), 0);
  }, [activeSubs]);

  // All renewals in selected month
  const monthRenewals = useMemo(() => {
    const renewals = activeSubs.filter(sub => {
      if (!sub.nextRenewal) return false;
      const d = new Date(sub.nextRenewal);
      return d.getMonth() === month && d.getFullYear() === year;
    }).map(sub => ({
      ...sub,
      daysLeft: daysUntilRenewal(sub.nextRenewal),
      renewalDay: new Date(sub.nextRenewal).getDate(),
      renewalDayName: dayNames[new Date(sub.nextRenewal).getDay()]
    })).sort((a, b) => a.renewalDay - b.renewalDay);

    if (filterCategory !== 'all') {
      return renewals.filter(r => r.category === filterCategory);
    }
    return renewals;
  }, [activeSubs, month, year, filterCategory]);

  // Urgency stats
  const urgencyStats = useMemo(() => {
    let overdue = 0, dueThisWeek = 0, upcoming = 0;
    activeSubs.forEach(sub => {
      const d = daysUntilRenewal(sub.nextRenewal);
      if (d < 0) overdue++;
      else if (d <= 7) dueThisWeek++;
      else upcoming++;
    });
    return { overdue, dueThisWeek, upcoming };
  }, [activeSubs]);

  // Categories
  const uniqueCategories = useMemo(() => {
    return [...new Set(subscriptions.map(s => s.category))].filter(Boolean);
  }, [subscriptions]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => { setCurrentDate(new Date()); setSelectedDateStr(todayStr); };

  const selectedDaySubs = getSubsForDate(selectedDateStr);
  const selectedDateTotal = selectedDaySubs.reduce((acc, sub) => acc + sub.cost, 0);

  const handleMarkPaid = (subId) => {
    setPaidStatus(prev => ({ ...prev, [subId]: true }));
    toast.success('Payment recorded for this billing cycle!');
  };

  const handleRemind = (subName) => {
    toast.success(`Reminder set for ${subName}!`);
  };

  // Format selected date nicely
  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateStr) return '';
    const d = new Date(selectedDateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, [selectedDateStr]);

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2.5">
            <CalendarIcon className="text-brand-purple" size={28} /> Renewals Calendar
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Track subscription dates, day-by-day renewals, and upcoming payment schedules.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl t-bg-surface border t-border">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20' : 't-text-secondary hover:t-text'
              }`}
            >
              <Grid size={14} /> Grid View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline' ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20' : 't-text-secondary hover:t-text'
              }`}
            >
              <List size={14} /> Timeline View
            </button>
          </div>

          <button
            onClick={() => navigate('/subscriptions/add')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-bold hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
          >
            <Plus size={14} /> Add Renewal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="flex items-center gap-3 !p-4" delay={0}>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span className="text-2xl font-bold t-text font-display">{urgencyStats.overdue}</span>
            <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Overdue</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3 !p-4" delay={0.05}>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-2xl font-bold t-text font-display">{urgencyStats.dueThisWeek}</span>
            <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Due This Week</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3 !p-4" delay={0.1}>
          <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
            <TrendingUp size={18} />
          </div>
          <div>
            <span className="text-2xl font-bold t-text font-display">{monthRenewals.length}</span>
            <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Renewals This Month</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-3 !p-4" delay={0.15}>
          <div className="p-2.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
            <DollarSign size={18} />
          </div>
          <div>
            <span className="text-xl font-bold t-text font-display">{formatCurrency(monthlyTotal)}</span>
            <span className="text-[10px] t-text-muted block uppercase tracking-wider font-semibold mt-0.5">Monthly Total</span>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'calendar' ? (
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-12 gap-5 items-start"
          >
            {/* Calendar Main Grid */}
            <GlassCard className="lg:col-span-8 !p-4 sm:!p-6">
              
              {/* Navigation Header */}
              <div className="flex justify-between items-center mb-5 pb-4 border-b t-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold font-display">
                    {month + 1}
                  </div>
                  <div>
                    <h4 className="font-extrabold t-text text-xl font-display">
                      {monthNames[month]} {year}
                    </h4>
                    <span className="text-xs t-text-secondary">
                      {monthRenewals.length} subscription payment{monthRenewals.length !== 1 ? 's' : ''} scheduled
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handlePrevMonth} className="p-2 rounded-xl t-text-secondary hover:t-text hover:bg-brand-purple/10 border t-border transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={handleToday} className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider t-text-secondary hover:t-text hover:bg-brand-purple/10 border t-border transition-colors">
                    Today
                  </button>
                  <button onClick={handleNextMonth} className="p-2 rounded-xl t-text-secondary hover:t-text hover:bg-brand-purple/10 border t-border transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Day Headers (Sun, Mon, Tue, etc.) */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider t-text-muted">
                {dayNames.map(d => (
                  <div key={d} className="py-1.5 rounded-lg t-bg-surface border t-border">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Grid with Subscriptions inside */}
              <div className="grid grid-cols-7 gap-2">
                {cells.map((cell, idx) => {
                  if (cell.isOtherMonth) {
                    return (
                      <div
                        key={`other-${idx}`}
                        className="min-h-[85px] sm:min-h-[105px] rounded-xl p-2 opacity-25 t-bg-surface border t-border flex flex-col justify-between"
                      >
                        <span className="text-xs font-bold font-display text-gray-500">{cell.day}</span>
                      </div>
                    );
                  }

                  const isSelected = selectedDateStr === cell.dateStr;
                  const isToday = todayStr === cell.dateStr;
                  const dateSubs = getSubsForDate(cell.dateStr);
                  const hasRenewals = dateSubs.length > 0;
                  const dayTotal = dateSubs.reduce((a, s) => a + s.cost, 0);

                  return (
                    <div
                      key={cell.dateStr}
                      onClick={() => setSelectedDateStr(cell.dateStr)}
                      className={`min-h-[90px] sm:min-h-[110px] rounded-xl border p-2 cursor-pointer transition-all flex flex-col justify-between relative group overflow-hidden ${
                        isSelected
                          ? 'bg-brand-purple/20 border-brand-purple shadow-[0_0_18px_rgba(139,92,246,0.3)] ring-1 ring-brand-purple'
                          : isToday
                          ? 'bg-brand-cyan/10 border-brand-cyan/40 ring-1 ring-brand-cyan/30'
                          : hasRenewals
                          ? 't-bg-surface border-brand-purple/25 hover:border-brand-purple/50 hover:bg-brand-purple/10'
                          : 't-bg-surface t-border hover:border-brand-purple/20 hover:t-bg-card'
                      }`}
                    >
                      {/* Top Bar: Date Number + Weekday + Today Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className={`text-xs sm:text-sm font-extrabold font-display ${
                            isToday ? 'text-brand-cyan' : isSelected ? 'text-white font-bold' : 't-text'
                          }`}>
                            {cell.day}
                          </span>
                          <span className="text-[9px] t-text-muted font-semibold uppercase">
                            {cell.dayNameShort}
                          </span>
                        </div>

                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan text-[8px] font-extrabold uppercase tracking-wider">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Subscriptions List directly on the Date Cell */}
                      {hasRenewals ? (
                        <div className="flex flex-col gap-1 my-1 flex-1 justify-end">
                          {dateSubs.slice(0, 2).map(sub => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-1 rounded-md text-[9px] font-semibold transition-transform group-hover:scale-[1.02]"
                              style={{
                                backgroundColor: (sub.color || '#8b5cf6') + '22',
                                border: `1px solid ${sub.color || '#8b5cf6'}44`,
                                color: '#ffffff'
                              }}
                            >
                              <div className="flex items-center gap-1 truncate max-w-[70%]">
                                <span
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: sub.color || '#8b5cf6' }}
                                />
                                <span className="truncate text-white font-bold">{sub.name}</span>
                              </div>
                              <span className="text-[8px] font-extrabold text-brand-cyan">
                                {formatCurrency(sub.cost, sub.currency)}
                              </span>
                            </div>
                          ))}

                          {dateSubs.length > 2 && (
                            <span className="text-[8px] font-extrabold text-brand-purple bg-brand-purple/15 px-1.5 py-0.5 rounded-md text-center">
                              +{dateSubs.length - 2} more ({formatCurrency(dayTotal)})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] t-text-muted font-semibold flex items-center gap-0.5">
                            <Plus size={10} /> Add
                          </span>
                        </div>
                      )}

                      {/* Cell Footer Cost Total */}
                      {hasRenewals && (
                        <div className="pt-1 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-brand-purple">
                          <span>Total</span>
                          <span>{formatCurrency(dayTotal)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t t-border text-xs t-text-muted">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                    <span>Selected Date</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-purple/40 border border-brand-purple" />
                    <span>Has Subscription</span>
                  </div>
                </div>

                <span className="text-[10px] italic">
                  💡 Click any date cell to inspect subscription details or record payment.
                </span>
              </div>

            </GlassCard>

            {/* Selected Date Detail Panel */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* Selected Day Subscriptions */}
              <GlassCard>
                <div className="flex justify-between items-center mb-4 pb-3 border-b t-border">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-cyan block">
                      Selected Schedule
                    </span>
                    <h4 className="font-bold t-text text-base font-display mt-0.5">
                      {selectedDateFormatted}
                    </h4>
                  </div>
                  {selectedDaySubs.length > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-brand-purple/15 text-brand-purple text-xs font-bold border border-brand-purple/20">
                      {formatCurrency(selectedDateTotal)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 min-h-[220px]">
                  {selectedDaySubs.map((sub) => {
                    const daysLeft = daysUntilRenewal(sub.nextRenewal);
                    const isPaid = paidStatus[sub.id];

                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3.5 rounded-xl t-bg-surface border t-border flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden p-1"
                              style={{ backgroundColor: (sub.color || '#8b5cf6') + '15', border: `1px solid ${sub.color || '#8b5cf6'}33` }}
                            >
                              {sub.logo ? (
                                <img src={sub.logo} alt={sub.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white uppercase" style={{ display: sub.logo ? 'none' : 'flex' }}>
                                {sub.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-bold t-text text-sm font-display">{sub.name}</h5>
                              <span className="text-[10px] t-text-muted capitalize">{getCategoryName(sub.category)} • {sub.billingCycle}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold t-text block font-display">
                              {formatCurrency(sub.cost, sub.currency)}
                            </span>
                            <span className={`text-[9px] font-bold block ${
                              daysLeft === 0 ? 'text-brand-cyan' : daysLeft < 0 ? 'text-rose-400' : 'text-brand-purple'
                            }`}>
                              {daysLeft === 0 ? 'Due Today' : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `In ${daysLeft} days`}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t t-border">
                          {isPaid ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={14} /> Paid for this cycle
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkPaid(sub.id)}
                              className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 size={13} /> Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleRemind(sub.name)}
                            className="p-1.5 rounded-lg t-bg-surface border t-border t-text-secondary hover:t-text hover:bg-brand-purple/10 text-xs transition-colors"
                            title="Remind Me"
                          >
                            <BellRing size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {selectedDaySubs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center t-text-muted gap-2 flex-1">
                      <CalendarIcon size={32} className="opacity-30" />
                      <span className="text-sm font-semibold">No renewals on this date</span>
                      <span className="text-xs t-text-muted">Click any date with subscription tags to inspect.</span>
                      <button
                        onClick={() => navigate('/subscriptions/add')}
                        className="mt-2 text-xs text-brand-purple font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Schedule a renewal here
                      </button>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Month Renewal Schedule Quick List */}
              <GlassCard>
                <h4 className="font-bold t-text text-sm font-display mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-purple" /> {monthNames[month]} Renewal Roster
                </h4>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {monthRenewals.length > 0 ? (
                    monthRenewals.map(sub => (
                      <div
                        key={sub.id}
                        onClick={() => {
                          const dateStr = sub.nextRenewal.split('T')[0];
                          setSelectedDateStr(dateStr);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg t-bg-surface border t-border hover:border-brand-purple/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sub.color || '#8b5cf6' }}
                          />
                          <div>
                            <span className="text-xs font-bold t-text block truncate max-w-[110px]">{sub.name}</span>
                            <span className="text-[9px] t-text-muted">{sub.renewalDayName}, {monthNames[month].slice(0,3)} {sub.renewalDay}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-cyan">{formatCurrency(sub.cost, sub.currency)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs t-text-muted text-center py-4">No payments scheduled this month.</p>
                  )}
                </div>
              </GlassCard>

            </div>
          </motion.div>
        ) : (
          /* ===================== TIMELINE VIEW ===================== */
          <motion.div
            key="timeline-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Category Filter Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 t-text-muted text-xs font-bold">
                <Filter size={14} /> Filter Category:
              </div>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                  filterCategory === 'all' ? 'bg-brand-purple border-brand-purple text-white' : 't-bg-surface t-border t-text-secondary hover:t-text'
                }`}
              >
                All Categories
              </button>
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors border ${
                    filterCategory === cat ? 'bg-brand-purple border-brand-purple text-white' : 't-bg-surface t-border t-text-secondary hover:t-text'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>

            {/* Timeline List */}
            <div className="flex flex-col gap-3">
              {monthRenewals.length > 0 ? (
                monthRenewals.map((sub, idx) => {
                  const isPast = sub.daysLeft < 0;
                  const isToday = sub.daysLeft === 0;
                  const isSoon = sub.daysLeft > 0 && sub.daysLeft <= 3;
                  const isPaid = paidStatus[sub.id];

                  return (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <GlassCard className="!p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Date Badge showing Date & Day */}
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">{sub.renewalDayName}</span>
                            <span className="text-xl font-extrabold t-text font-display leading-none">{sub.renewalDay}</span>
                          </div>

                          {/* Sub Info */}
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden p-1"
                              style={{ backgroundColor: (sub.color || '#8b5cf6') + '15', border: `1px solid ${sub.color || '#8b5cf6'}33` }}
                            >
                              {sub.logo ? (
                                <img src={sub.logo} alt={sub.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white uppercase" style={{ display: sub.logo ? 'none' : 'flex' }}>
                                {sub.name.charAt(0)}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-extrabold t-text text-base font-display">{sub.name}</h5>
                              <span className="text-xs t-text-muted capitalize">{getCategoryName(sub.category)} • {sub.billingCycle}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 t-border">
                          <div className="text-left sm:text-right">
                            <span className="text-lg font-extrabold t-text font-display block">
                              {formatCurrency(sub.cost, sub.currency)}
                            </span>
                            <span className={`text-xs font-bold block ${
                              isPast ? 'text-rose-400' : isToday ? 'text-brand-cyan' : isSoon ? 'text-amber-400' : 'text-brand-purple'
                            }`}>
                              {isPast ? `${Math.abs(sub.daysLeft)}d overdue` : isToday ? '🔔 Due Today' : isSoon ? `⚠️ ${sub.daysLeft}d left` : `In ${sub.daysLeft} days`}
                            </span>
                          </div>

                          {isPaid ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 size={14} /> Paid
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkPaid(sub.id)}
                              className="px-3 py-1.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 size={14} /> Pay
                            </button>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center t-text-muted gap-2">
                  <CalendarIcon size={32} className="opacity-30" />
                  <span className="text-sm font-semibold">No renewals matching category filter</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
