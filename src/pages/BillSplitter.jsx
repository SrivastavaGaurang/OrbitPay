import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useCurrency } from '../context/CurrencyContext';
import { calculateMonthlyCost } from '../utils/helpers';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Modal } from '../components/ui/Modal';
import { 
  Users, 
  Plus, 
  Share2, 
  MessageSquare, 
  Copy, 
  Check, 
  Trash2, 
  UserPlus, 
  DollarSign, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function BillSplitter() {
  const { subscriptions } = useSubscriptions();
  const { formatVal } = useCurrency();

  // Shared state in localStorage
  const [splits, setSplits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orbitpay_bill_splits')) || {};
    } catch { return {}; }
  });

  const [selectedSubId, setSelectedSubId] = useState(subscriptions[0]?.id || '');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', upiId: '' });

  const activeSubs = useMemo(() => {
    return subscriptions.filter(s => s.status === 'active');
  }, [subscriptions]);

  const currentSub = activeSubs.find(s => s.id === selectedSubId) || activeSubs[0];

  const subMonthlyCost = currentSub ? calculateMonthlyCost(currentSub.cost, currentSub.billingCycle) : 0;

  // Split members for current sub
  const currentMembers = splits[selectedSubId] || [
    { id: 'm-1', name: 'You (Owner)', sharePercent: 50 },
    { id: 'm-2', name: 'Alex', sharePercent: 50, upiId: 'alex@upi' }
  ];

  const saveSplits = (newSplits) => {
    setSplits(newSplits);
    localStorage.setItem('orbitpay_bill_splits', JSON.stringify(newSplits));
  };

  const handleAddMember = () => {
    if (!memberForm.name.trim()) return;
    const newMember = {
      id: `m-${Date.now()}`,
      name: memberForm.name.trim(),
      sharePercent: 0,
      upiId: memberForm.upiId.trim()
    };
    
    // Equal split re-calculation
    const updated = [...currentMembers, newMember];
    const equalShare = Math.round(100 / updated.length);
    const finalMembers = updated.map(m => ({ ...m, sharePercent: equalShare }));

    saveSplits({ ...splits, [selectedSubId]: finalMembers });
    setMemberForm({ name: '', upiId: '' });
    setShowMemberModal(false);
    toast.success(`Added ${memberForm.name} to ${currentSub.name} split!`);
  };

  const handleDeleteMember = (memberId) => {
    const updated = currentMembers.filter(m => m.id !== memberId);
    const equalShare = updated.length > 0 ? Math.round(100 / updated.length) : 100;
    const finalMembers = updated.map(m => ({ ...m, sharePercent: equalShare }));

    saveSplits({ ...splits, [selectedSubId]: finalMembers });
    toast.success("Member removed from split.");
  };

  const handleCopyPaymentRequest = (member, amount) => {
    const text = `Hey ${member.name}! 🚀 Your monthly share for ${currentSub.name} is ${formatVal(amount, currentSub.currency)}.
Please transfer to my UPI: ${member.upiId || 'gaurang@upi'}. Thanks!
Sent via OrbitPay Family Vault`;

    navigator.clipboard.writeText(text);
    toast.success(`Payment request for ${member.name} copied to clipboard!`);
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold t-text font-display flex items-center gap-2.5">
            <Users className="text-brand-cyan" size={28} /> Family Vault & Bill Splitter
          </h2>
          <p className="t-text-secondary text-sm mt-1 leading-relaxed">
            Split shared subscriptions with friends or family and generate 1-click payment request messages.
          </p>
        </div>

        <GradientButton onClick={() => setShowMemberModal(true)}>
          <UserPlus size={16} /> Add Split Member
        </GradientButton>
      </div>

      {/* Select Subscription Pill Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {activeSubs.map(sub => {
          const isSelected = sub.id === selectedSubId;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubId(sub.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-brand-purple/20 border-brand-purple t-text shadow-md shadow-brand-purple/20'
                  : 't-bg-surface t-border t-text-secondary hover:t-text'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color || '#8b5cf6' }} />
              {sub.name}
              <span className="t-text-muted">({formatVal(calculateMonthlyCost(sub.cost, sub.billingCycle))})</span>
            </button>
          );
        })}
      </div>

      {currentSub && (
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* Main Split Breakdown Card */}
          <GlassCard className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b t-border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold t-text uppercase"
                  style={{ backgroundColor: (currentSub.color || '#8b5cf6') + '22', border: `1px solid ${currentSub.color || '#8b5cf6'}44` }}
                >
                  {currentSub.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold t-text text-lg font-display">{currentSub.name} Split Breakdown</h3>
                  <span className="text-xs t-text-muted">Total Bill: {formatVal(subMonthlyCost, currentSub.currency)} / month</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-brand-cyan/15 text-brand-cyan text-xs font-extrabold border border-brand-cyan/20">
                {currentMembers.length} Members
              </span>
            </div>

            {/* Member List */}
            <div className="flex flex-col gap-3 my-2">
              {currentMembers.map(member => {
                const memberAmount = (subMonthlyCost * member.sharePercent) / 100;
                const isOwner = member.id === 'm-1';

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3.5 rounded-xl t-bg-surface border t-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-bold flex items-center justify-center text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold t-text text-sm font-display flex items-center gap-1.5">
                          {member.name}
                          {isOwner && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple font-extrabold uppercase">You</span>}
                        </h4>
                        <span className="text-[10px] t-text-muted font-medium">{member.sharePercent}% Share • {member.upiId || 'No UPI ID'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-brand-cyan font-display">
                        {formatVal(memberAmount, currentSub.currency)}
                      </span>

                      {!isOwner && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyPaymentRequest(member, memberAmount)}
                            className="p-1.5 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 text-xs font-bold transition-colors flex items-center gap-1"
                            title="Copy Payment Request"
                          >
                            <Copy size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-1.5 rounded-lg t-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* Quick Request Preview Panel */}
          <GlassCard className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="font-extrabold t-text text-base font-display flex items-center gap-2 border-b t-border pb-3">
              <Share2 size={16} className="text-brand-purple" /> 1-Click Request Generator
            </h3>

            <div className="p-3.5 rounded-xl t-bg-surface border t-border text-xs t-text leading-relaxed font-mono whitespace-pre-wrap">
{`Hey Alex! 🚀 Your monthly share for ${currentSub.name} is ${formatVal(subMonthlyCost / currentMembers.length)}.

Please transfer to my UPI: gaurang@upi. Thanks!
Sent via OrbitPay Family Vault`}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`Hey Alex! 🚀 Your monthly share for ${currentSub.name} is ${formatVal(subMonthlyCost / currentMembers.length)}. Please transfer to my UPI: gaurang@upi. Thanks!`);
                toast.success("Generic payment request copied!");
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-bold transition-all shadow-md"
            >
              <Copy size={14} /> Copy Generic Payment Link
            </button>
          </GlassCard>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)}>
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-lg font-bold t-text font-display flex items-center gap-2">
            <UserPlus size={18} className="text-brand-purple" /> Add Split Member
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold t-text-muted mb-1 uppercase tracking-wider">Member Name</label>
              <input
                type="text"
                value={memberForm.name}
                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3.5 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm outline-none focus:border-brand-purple/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold t-text-muted mb-1 uppercase tracking-wider">UPI Handle (Optional)</label>
              <input
                type="text"
                value={memberForm.upiId}
                onChange={e => setMemberForm({ ...memberForm, upiId: e.target.value })}
                placeholder="e.g. sarah@okaxis"
                className="w-full px-3.5 py-2.5 rounded-xl t-bg-surface border t-border t-text text-sm outline-none focus:border-brand-purple/40"
              />
            </div>

            <GradientButton onClick={handleAddMember} className="mt-2 font-bold">
              Add to {currentSub?.name} Split
            </GradientButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
