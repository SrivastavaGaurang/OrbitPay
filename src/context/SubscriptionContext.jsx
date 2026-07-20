import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  listenToSubscriptions, 
  listenToActivityLogs,
  getUserProfile,
  updateUserProfile,
  addSubscription,
  updateSubscription,
  deleteSubscription
} from '../firebase/firestore';

const SubscriptionContext = createContext();

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscriptions must be used within a SubscriptionProvider");
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compute analytics
  const [analytics, setAnalytics] = useState({
    totalMonthlySpend: 0,
    activeCount: 0,
    pausedCount: 0,
    upcomingCount: 0,
    savingsPotential: 0,
    categorySpend: {},
    paymentBreakdown: {}
  });

  // Load User Profile Settings
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setSubscriptions([]);
      setActivityLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserProfile(user.uid)
      .then(p => {
        setProfile(p);
      })
      .catch(err => console.error("Error fetching profile: ", err));

    // Listen to subscriptions real-time
    const unsubscribeSubs = listenToSubscriptions(user.uid, (subs) => {
      setSubscriptions(subs);
      setLoading(false);
    });

    // Listen to activity logs real-time
    const unsubscribeActivity = listenToActivityLogs(user.uid, (logs) => {
      setActivityLogs(logs);
    });

    return () => {
      unsubscribeSubs();
      unsubscribeActivity();
    };
  }, [user]);

  // Compute analytics whenever subscriptions change
  useEffect(() => {
    if (subscriptions.length === 0) {
      setAnalytics({
        totalMonthlySpend: 0,
        activeCount: 0,
        pausedCount: 0,
        upcomingCount: 0,
        savingsPotential: 0,
        categorySpend: {},
        paymentBreakdown: {}
      });
      return;
    }

    let totalMonthly = 0;
    let active = 0;
    let paused = 0;
    let savings = 0;
    let upcoming = 0;
    const catSpend = {};
    const payBreakdown = {};

    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    subscriptions.forEach(sub => {
      // Calculate normalized monthly cost
      let monthlyCost = sub.cost;
      if (sub.billingCycle === 'yearly') {
        monthlyCost = sub.cost / 12;
      } else if (sub.billingCycle === 'weekly') {
        monthlyCost = sub.cost * 4.33;
      }

      if (sub.status === 'active') {
        active++;
        totalMonthly += monthlyCost;

        // Categorized spending
        const cat = sub.category || 'other';
        catSpend[cat] = (catSpend[cat] || 0) + monthlyCost;

        // Payment method breakdown
        const pay = sub.paymentMethod || 'Other';
        payBreakdown[pay] = (payBreakdown[pay] || 0) + monthlyCost;

        // Check if renewal is in next 7 days
        if (sub.nextRenewal) {
          const renewalDate = new Date(sub.nextRenewal);
          if (renewalDate >= now && renewalDate <= sevenDaysFromNow) {
            upcoming++;
          }
        }
      } else if (sub.status === 'paused') {
        paused++;
        // Savings potential includes costs of paused subscriptions
        savings += monthlyCost;
      }
    });

    setAnalytics({
      totalMonthlySpend: Math.round(totalMonthly * 100) / 100,
      activeCount: active,
      pausedCount: paused,
      upcomingCount: upcoming,
      savingsPotential: Math.round(savings * 100) / 100,
      categorySpend: catSpend,
      paymentBreakdown: payBreakdown
    });
  }, [subscriptions]);

  // Operations wrappers
  const addSub = async (subData) => {
    if (!user) return;
    return await addSubscription(user.uid, subData);
  };

  const updateSub = async (subId, updates) => {
    if (!user) return;
    return await updateSubscription(user.uid, subId, updates);
  };

  const deleteSub = async (subId, subName) => {
    if (!user) return;
    return await deleteSubscription(user.uid, subId, subName);
  };

  const updateProfileSettings = async (updates) => {
    if (!user) return;
    const p = await updateUserProfile(user.uid, updates);
    setProfile(prev => ({ ...prev, ...p }));
    return p;
  };

  const value = {
    subscriptions,
    activityLogs,
    profile,
    loading,
    analytics,
    addSub,
    updateSub,
    deleteSub,
    updateProfileSettings
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
