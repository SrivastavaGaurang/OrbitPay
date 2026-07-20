import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, isMockMode } from './config';

// Helper to detect demo/mock users
const isDemoUser = (userId) => isMockMode || !userId || userId.startsWith('demo-user-') || userId.startsWith('mock-user-') || userId.startsWith('user-');

// --- MOCK STORAGE IMPLEMENTATION ---
const getMockData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveMockData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initial seed data fallback
const SEED_SUBS = [
  {
    id: "sub-1",
    name: "Netflix",
    logo: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico",
    category: "entertainment",
    cost: 649,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-01-15",
    nextRenewal: "2026-08-15",
    status: "active",
    paymentMethod: "HDFC Card",
    notes: "4K UHD Premium Plan",
    color: "#E50914"
  },
  {
    id: "sub-2",
    name: "Spotify Duo",
    logo: "https://www.scdn.co/lyric-find/assets/images/favicon.png",
    category: "entertainment",
    cost: 179,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-02-10",
    nextRenewal: "2026-08-10",
    status: "active",
    paymentMethod: "UPI Auto-pay",
    notes: "Duo Premium Music",
    color: "#1DB954"
  },
  {
    id: "sub-3",
    name: "AWS Cloud Services",
    logo: "https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico",
    category: "utilities",
    cost: 1450,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-03-01",
    nextRenewal: "2026-08-01",
    status: "active",
    paymentMethod: "ICICI Credit Card",
    notes: "EC2 & S3 server hosting",
    color: "#FF9900"
  },
  {
    id: "sub-4",
    name: "ChatGPT Plus",
    logo: "https://chatgpt.com/favicon.ico",
    category: "work",
    cost: 1999,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-01-20",
    nextRenewal: "2026-08-20",
    status: "active",
    paymentMethod: "HDFC Card",
    notes: "GPT-4o & Canvas access",
    color: "#10a37f"
  },
  {
    id: "sub-5",
    name: "YouTube Premium",
    logo: "https://www.youtube.com/s/desktop/f5af2f78/img/favicon.ico",
    category: "entertainment",
    cost: 149,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-02-05",
    nextRenewal: "2026-08-05",
    status: "active",
    paymentMethod: "UPI Auto-pay",
    notes: "Ad-free & Music Background",
    color: "#ff0000"
  },
  {
    id: "sub-6",
    name: "Adobe CC All Apps",
    logo: "https://www.adobe.com/favicon.ico",
    category: "work",
    cost: 4230,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2025-12-24",
    nextRenewal: "2026-08-24",
    status: "paused",
    paymentMethod: "Credit Card",
    notes: "Photoshop, Illustrator & Premiere",
    color: "#FF0000"
  },
  {
    id: "sub-7",
    name: "GitHub Copilot Pro",
    logo: "https://github.githubassets.com/favicons/favicon.png",
    category: "work",
    cost: 830,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-01-10",
    nextRenewal: "2026-08-10",
    status: "active",
    paymentMethod: "Debit Card",
    notes: "AI pair programming agent",
    color: "#6e40c9"
  },
  {
    id: "sub-8",
    name: "Gym Membership",
    logo: "https://www.anytimefitness.com/favicon.ico",
    category: "health",
    cost: 15000,
    currency: "INR",
    billingCycle: "yearly",
    startDate: "2026-01-01",
    nextRenewal: "2027-01-01",
    status: "active",
    paymentMethod: "Net Banking",
    notes: "Anytime Fitness annual pass",
    color: "#ff5252"
  },
  {
    id: "sub-9",
    name: "iCloud 200GB Storage",
    logo: "https://www.apple.com/favicon.ico",
    category: "cloud",
    cost: 219,
    currency: "INR",
    billingCycle: "monthly",
    startDate: "2026-02-18",
    nextRenewal: "2026-08-18",
    status: "active",
    paymentMethod: "Apple Pay",
    notes: "Family Cloud Backup",
    color: "#0070c9"
  },
  {
    id: "sub-10",
    name: "Disney+ Hotstar VIP",
    logo: "https://www.hotstar.com/favicons/favicon.ico",
    category: "entertainment",
    cost: 1499,
    currency: "INR",
    billingCycle: "yearly",
    startDate: "2025-11-12",
    nextRenewal: "2026-11-12",
    status: "active",
    paymentMethod: "UPI Auto-pay",
    notes: "Live Sports & Marvel movies",
    color: "#1f80e0"
  }
];

const getStoredSubs = (userId) => {
  const key = `subsync_subs_${userId}`;
  let data = getMockData(key);
  if (data.length === 0) {
    saveMockData(key, SEED_SUBS);
    data = SEED_SUBS;
  }
  return data;
};

// --- USER PROFILE CRUD ---
export const createUserProfile = async (userId, data) => {
  const profile = {
    uid: userId,
    displayName: data.displayName || "Gaurang Srivastava",
    email: data.email || "gaurang@orbitpay.io",
    photoURL: data.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.displayName || 'Gaurang')}`,
    currency: "INR",
    theme: "dark",
    plan: "pro",
    createdAt: new Date().toISOString(),
    notifications: {
      email: true,
      push: true,
      renewalReminder: 3
    }
  };

  if (isDemoUser(userId)) {
    saveMockData(`subsync_profile_${userId}`, profile);
    return profile;
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, profile);
    return profile;
  } catch {
    saveMockData(`subsync_profile_${userId}`, profile);
    return profile;
  }
};

export const getUserProfile = async (userId) => {
  if (isDemoUser(userId)) {
    let profile = localStorage.getItem(`subsync_profile_${userId}`);
    if (!profile) {
      const active = JSON.parse(localStorage.getItem('subsync_active_user') || '{}');
      return await createUserProfile(userId, { 
        displayName: active?.displayName || "Gaurang Srivastava", 
        email: active?.email || "gaurang@orbitpay.io" 
      });
    }
    return JSON.parse(profile);
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      const active = JSON.parse(localStorage.getItem('subsync_active_user') || '{}');
      return await createUserProfile(userId, { 
        displayName: active?.displayName || "Gaurang Srivastava", 
        email: active?.email || "gaurang@orbitpay.io" 
      });
    }
  } catch {
    return await createUserProfile(userId, {});
  }
};

export const updateUserProfile = async (userId, updates) => {
  const profile = await getUserProfile(userId);
  const updated = { ...profile, ...updates };
  saveMockData(`subsync_profile_${userId}`, updated);
  
  if (!isDemoUser(userId) && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updates);
    } catch {}
  }
  return updated;
};

// --- SUBSCRIPTIONS CRUD ---
export const addSubscription = async (userId, subscription) => {
  const newSub = {
    ...subscription,
    cost: parseFloat(subscription.cost) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const key = `subsync_subs_${userId}`;
  const subs = getStoredSubs(userId);
  newSub.id = `sub-${Date.now()}`;
  subs.push(newSub);
  saveMockData(key, subs);
  
  await addActivityLog(userId, {
    type: 'added',
    subscriptionName: newSub.name,
    details: `Added ${newSub.name} subscription`
  });
  
  if (!isDemoUser(userId) && db) {
    try {
      const subsRef = collection(db, 'users', userId, 'subscriptions');
      await addDoc(subsRef, newSub);
    } catch {}
  }
  
  return newSub;
};

export const getSubscriptions = async (userId) => {
  const localSubs = getStoredSubs(userId);
  if (isDemoUser(userId)) {
    return localSubs;
  }
  
  try {
    const subsRef = collection(db, 'users', userId, 'subscriptions');
    const q = query(subsRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const subs = [];
    querySnapshot.forEach((doc) => {
      subs.push({ id: doc.id, ...doc.data() });
    });
    return subs.length > 0 ? subs : localSubs;
  } catch {
    return localSubs;
  }
};

export const updateSubscription = async (userId, subId, updates) => {
  const key = `subsync_subs_${userId}`;
  const subs = getStoredSubs(userId);
  const index = subs.findIndex(s => s.id === subId);
  if (index !== -1) {
    const oldSub = subs[index];
    subs[index] = { ...oldSub, ...updates };
    saveMockData(key, subs);
    
    let details = `Updated ${oldSub.name}`;
    let type = 'updated';
    if (updates.status && updates.status !== oldSub.status) {
      type = updates.status;
      details = `${updates.status.toUpperCase()} ${oldSub.name} subscription`;
    }
    
    await addActivityLog(userId, {
      type,
      subscriptionName: oldSub.name,
      details
    });
  }

  if (!isDemoUser(userId) && db) {
    try {
      const subRef = doc(db, 'users', userId, 'subscriptions', subId);
      await updateDoc(subRef, updates);
    } catch {}
  }

  return { id: subId, ...updates };
};

export const deleteSubscription = async (userId, subId, subName) => {
  const key = `subsync_subs_${userId}`;
  const subs = getStoredSubs(userId);
  const filtered = subs.filter(s => s.id !== subId);
  saveMockData(key, filtered);
  
  await addActivityLog(userId, {
    type: 'cancelled',
    subscriptionName: subName || "Subscription",
    details: `Deleted ${subName || "subscription"} tracker`
  });

  if (!isDemoUser(userId) && db) {
    try {
      const subRef = doc(db, 'users', userId, 'subscriptions', subId);
      await deleteDoc(subRef);
    } catch {}
  }
  return true;
};

// --- ACTIVITY LOGS CRUD ---
export const addActivityLog = async (userId, log) => {
  const newLog = {
    ...log,
    id: `act-${Date.now()}`,
    timestamp: Date.now()
  };
  
  const key = `subsync_activity_${userId}`;
  const logs = getMockData(key);
  logs.unshift(newLog);
  if (logs.length > 50) logs.pop();
  saveMockData(key, logs);
  
  return newLog;
};

export const getActivityLogs = async (userId) => {
  const key = `subsync_activity_${userId}`;
  let logs = getMockData(key);
  if (logs.length === 0) {
    logs = [
      { id: "act-1", type: "added", subscriptionName: "Netflix", details: "Added Netflix Premium subscription", timestamp: Date.now() - 86400000 * 3 },
      { id: "act-2", type: "added", subscriptionName: "Spotify Duo", details: "Added Spotify Duo subscription", timestamp: Date.now() - 86400000 * 2 },
      { id: "act-3", type: "paused", subscriptionName: "Adobe CC All Apps", details: "Paused Adobe Creative Cloud subscription", timestamp: Date.now() - 36000000 },
      { id: "act-4", type: "added", subscriptionName: "ChatGPT Plus", details: "Added ChatGPT Plus subscription", timestamp: Date.now() - 86400000 * 5 }
    ];
    saveMockData(key, logs);
  }
  return logs;
};

// --- REAL-TIME LISTENERS ---
export const listenToSubscriptions = (userId, callback) => {
  const fetchAndDeliver = () => {
    const subs = getStoredSubs(userId);
    callback(subs);
  };

  if (isDemoUser(userId) || !db) {
    const interval = setInterval(fetchAndDeliver, 1000);
    fetchAndDeliver();
    return () => clearInterval(interval);
  }

  try {
    const subsRef = collection(db, 'users', userId, 'subscriptions');
    const q = query(subsRef, orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const subs = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() });
      });
      if (subs.length > 0) {
        callback(subs);
      } else {
        fetchAndDeliver();
      }
    }, (error) => {
      fetchAndDeliver();
    });
  } catch {
    const interval = setInterval(fetchAndDeliver, 1000);
    fetchAndDeliver();
    return () => clearInterval(interval);
  }
};

export const listenToActivityLogs = (userId, callback) => {
  const fetchLogs = () => {
    const key = `subsync_activity_${userId}`;
    let logs = getMockData(key);
    if (logs.length === 0) {
      logs = [
        { id: "act-1", type: "added", subscriptionName: "Netflix", details: "Added Netflix Premium subscription", timestamp: Date.now() - 86400000 * 3 },
        { id: "act-2", type: "added", subscriptionName: "Spotify Duo", details: "Added Spotify Duo subscription", timestamp: Date.now() - 86400000 * 2 },
        { id: "act-3", type: "paused", subscriptionName: "Adobe CC All Apps", details: "Paused Adobe Creative Cloud subscription", timestamp: Date.now() - 36000000 },
        { id: "act-4", type: "added", subscriptionName: "ChatGPT Plus", details: "Added ChatGPT Plus subscription", timestamp: Date.now() - 86400000 * 5 }
      ];
      saveMockData(key, logs);
    }
    callback(logs);
  };

  const interval = setInterval(fetchLogs, 1500);
  fetchLogs();
  return () => clearInterval(interval);
};
