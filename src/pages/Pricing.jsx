import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientButton } from '../components/ui/GradientButton';
import { Sparkles, Check, Globe, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pricing() {
  const plans = [
    {
      name: 'Free Tracker',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for tracking a few basic personal subscriptions.',
      features: [
        'Track up to 5 subscriptions',
        'Standard category distributions',
        'Interactive Galaxy view (max 5 planets)',
        'Basic upcoming email reminder (3 days before)'
      ],
      cta: 'Current Plan',
      variant: 'free',
      color: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.1)'
    },
    {
      name: 'OrbitPay Pro',
      price: '₹149',
      period: 'month',
      description: 'Best for power users and tracking across cards.',
      features: [
        'Track unlimited subscriptions',
        'Advanced monthly spending analytics',
        'Interactive 3D Galaxy with custom sizing',
        'Custom alerts timing (1, 3, 5, 7 days)',
        'Connect up to 3 cards/payment sources',
        'Early savings insights suggestions'
      ],
      cta: 'Upgrade to Pro',
      variant: 'pro',
      color: 'rgba(139, 92, 246, 0.05)',
      borderColor: 'rgba(139, 92, 246, 0.25)'
    },
    {
      name: 'OrbitPay Enterprise',
      price: '₹449',
      period: 'month',
      description: 'Ideal for shared workspaces, startups, and families.',
      features: [
        'Everything in Pro plan',
        'Track multiple accounts/user profiles',
        'Splitting expenses billing indicators',
        'Export spending audits as PDF/CSV',
        '24/7 dedicated support desk',
        'Secure receipt storage integrations'
      ],
      cta: 'Go Enterprise',
      variant: 'enterprise',
      color: 'rgba(6, 182, 212, 0.05)',
      borderColor: 'rgba(6, 182, 212, 0.25)'
    }
  ];

  const handleUpgrade = (planName) => {
    if (planName === 'Free Tracker') return;
    toast.success(`Demo payment initiated for ${planName}!`);
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto my-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Upgrade Options</h2>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Scale your recurring investment tracking and unlock premium galaxy animations.
        </p>
      </div>

      {/* Grid plans */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch mt-4">
        {plans.map((p) => {
          const isPro = p.variant === 'pro';
          return (
            <GlassCard
              key={p.name}
              className="flex flex-col justify-between relative h-full"
              style={{ backgroundColor: p.color, borderColor: p.borderColor }}
            >
              {/* Highlight badge for Pro */}
              {isPro && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-brand-purple/20">
                  <Sparkles size={10} className="animate-spin text-brand-cyan" /> Best Choice
                </span>
              )}

              <div>
                <h4 className="font-bold text-white text-lg font-display">{p.name}</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.description}</p>
                
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white font-display">{p.price}</span>
                  <span className="text-gray-500 text-sm"> / {p.period}</span>
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                  {p.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check size={14} className="text-brand-cyan flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5">
                {isPro ? (
                  <GradientButton onClick={() => handleUpgrade(p.name)} fullWidth className="text-xs font-semibold">
                    {p.cta}
                  </GradientButton>
                ) : (
                  <button
                    onClick={() => handleUpgrade(p.name)}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {p.cta}
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
}
