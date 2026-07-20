import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { ServiceCatalogue } from '../components/features/ServiceCatalogue';
import { CATEGORIES, CURRENCIES, BILLING_CYCLES } from '../utils/constants';
import { calculateMonthlyCost } from '../utils/helpers';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AddSubscription() {
  const { addSub } = useSubscriptions();
  const navigate = useNavigate();

  // Wizard state: 1 = Catalogue/Name, 2 = Pricing details, 3 = Payment/Notes, 4 = Success
  const [step, setStep] = useState(1);

  // Form Fields state
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [category, setCategory] = useState('entertainment');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextRenewal, setNextRenewal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);

  // Handle service selection from Catalogue
  const handleSelectService = (service) => {
    setName(service.name);
    setLogo(service.logo);
    setColor(service.color || '#8b5cf6');
    setCost(service.defaultCost || '');
    setCurrency(service.defaultCurrency || 'INR');
    setBillingCycle(service.defaultCycle || 'monthly');
    setCategory(service.category || 'entertainment');
    
    // Auto-calculate renewal date (next month)
    const renewal = new Date();
    if (service.defaultCycle === 'yearly') {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }
    setNextRenewal(renewal.toISOString().split('T')[0]);
    
    // Move to next step
    setStep(2);
  };

  const handleCustomService = () => {
    setName('');
    setLogo('');
    setColor('#8b5cf6');
    setCost('');
    setCategory('other');
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!name) {
        toast.error("Please provide a name.");
        return;
      }
      if (!cost || parseFloat(cost) <= 0) {
        toast.error("Please enter a valid cost.");
        return;
      }
      if (!nextRenewal) {
        toast.error("Please select a renewal date.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await addSub({
        name,
        logo,
        color,
        cost: parseFloat(cost),
        currency,
        billingCycle,
        category,
        startDate,
        nextRenewal,
        paymentMethod,
        notes,
        status: 'active'
      });
      setStep(4); // Success step
      toast.success(`${name} subscription added!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save subscription.");
    } finally {
      setLoading(false);
    }
  };

  const stepsIndicators = [
    { num: 1, label: 'Select Service' },
    { num: 2, label: 'Plan Details' },
    { num: 3, label: 'Payment Info' },
  ];

  return (
    <div className="flex flex-col gap-6 text-left select-none max-w-2xl mx-auto">
      
      {/* Back to dashboard */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white cursor-pointer select-none transition-colors mr-auto"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Add Subscription</h2>
        <p className="text-gray-400 text-sm mt-1 leading-relaxed">
          Create a new recurring expense tracker.
        </p>
      </div>

      {/* Progress Wizard Steps */}
      {step < 4 && (
        <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
          {stepsIndicators.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors border ${
                  step === s.num
                    ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.25)]'
                    : step > s.num
                    ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                    : 'bg-transparent border-white/10 text-gray-400'
                }`}>
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  step === s.num ? 'text-white' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < stepsIndicators.length - 1 && (
                <div className={`h-px flex-1 mx-4 ${
                  step > s.num ? 'bg-brand-cyan/40' : 'bg-white/10'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Wizard Step Content panels */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <GlassCard className="flex flex-col gap-4">
                <h4 className="font-bold text-white text-md font-display">Choose a service from Catalogue</h4>
                <ServiceCatalogue onSelectService={handleSelectService} />
              </GlassCard>
              
              <div className="text-center">
                <span className="text-gray-500 text-xs">Or build a custom custom tracker</span>
                <button
                  onClick={handleCustomService}
                  className="block mt-2 mx-auto text-xs text-brand-cyan font-bold hover:underline cursor-pointer"
                >
                  Create Custom Subscription
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="flex flex-col gap-4">
                <h4 className="font-bold text-white text-md font-display">Configure Plan & Cost</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium">Subscription Name</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Premium, Gym"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium">Price (Cost)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="649"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium">Billing Cycle</label>
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                    >
                      {BILLING_CYCLES.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium">Next Renewal Date</label>
                    <input
                      type="date"
                      value={nextRenewal}
                      onChange={(e) => setNextRenewal(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white cursor-pointer select-none transition-colors"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  
                  <GradientButton onClick={handleNextStep} className="flex items-center gap-1 text-xs py-2 px-4">
                    Continue <ArrowRight size={14} />
                  </GradientButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="flex flex-col gap-4">
                <h4 className="font-bold text-white text-md font-display">Configure Payment Method & Reminders</h4>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium">Payment Method / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Credit Card, UPI Autopay, PayPal"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium">Additional Notes</label>
                  <textarea
                    placeholder="Add credentials links, shared account details, or split settings..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm h-28 focus:outline-none focus:border-brand-purple/40 resize-none"
                  />
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white cursor-pointer select-none transition-colors"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  
                  <GradientButton 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center gap-1 text-xs py-2 px-5"
                  >
                    {loading ? 'Saving...' : 'Add Tracker'} <Check size={14} />
                  </GradientButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <GlassCard className="flex flex-col items-center justify-center text-center p-10 gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 animate-bounce">
                  <Check size={28} />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xl font-display">Subscription Added successfully!</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {name} tracker has been successfully registered to your dashboard. We'll alert you before your renewal hits.
                  </p>
                </div>

                <div className="flex gap-3 w-full max-w-sm mt-4 border-t border-white/5 pt-6">
                  <button
                    onClick={() => { setName(''); setStep(1); }}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Add Another
                  </button>
                  <GradientButton 
                    onClick={() => navigate('/dashboard')} 
                    className="flex-1 text-xs py-2.5 font-semibold"
                  >
                    Go to Dashboard
                  </GradientButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
