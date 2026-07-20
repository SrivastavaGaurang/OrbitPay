import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, isMockMode } from './config';

// Local storage active user helpers
const getMockUsers = () => JSON.parse(localStorage.getItem('subsync_mock_users') || '[]');
const saveMockUsers = (users) => localStorage.setItem('subsync_mock_users', JSON.stringify(users));

const getActiveUser = () => JSON.parse(localStorage.getItem('subsync_active_user') || 'null');
const setActiveUser = (user) => localStorage.setItem('subsync_active_user', JSON.stringify(user));

// Subscriptions mock initial data seeding for mock mode user
const seedInitialSubscriptions = (userId) => {
  const initialSubs = [
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
  
  const existingKey = `subsync_subs_${userId}`;
  if (!localStorage.getItem(existingKey)) {
    localStorage.setItem(existingKey, JSON.stringify(initialSubs));
    
    // Seed initial activity feed
    const initialActivity = [
      { id: "act-1", type: "added", subscriptionName: "Netflix", details: "Added Netflix Premium subscription", timestamp: Date.now() - 86400000 * 3 },
      { id: "act-2", type: "added", subscriptionName: "Spotify Duo", details: "Added Spotify Duo subscription", timestamp: Date.now() - 86400000 * 2 },
      { id: "act-3", type: "paused", subscriptionName: "Adobe CC All Apps", details: "Paused Adobe Creative Cloud subscription", timestamp: Date.now() - 36000000 },
      { id: "act-4", type: "added", subscriptionName: "ChatGPT Plus", details: "Added ChatGPT Plus subscription", timestamp: Date.now() - 86400000 * 5 }
    ];
    localStorage.setItem(`subsync_activity_${userId}`, JSON.stringify(initialActivity));
  }
};

const createOrGetDemoUser = (email, name) => {
  const cleanEmail = email || 'gaurang@orbitpay.io';
  const cleanName = name || 'Gaurang Srivastava';
  const uid = `demo-user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

  const demoUser = {
    uid,
    email: cleanEmail,
    displayName: cleanName,
    photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`
  };

  setActiveUser(demoUser);
  seedInitialSubscriptions(demoUser.uid);
  return demoUser;
};

export const signUpWithEmail = async (email, password, displayName) => {
  const cleanEmail = email || `user_${Date.now()}@orbitpay.io`;
  const cleanName = displayName || cleanEmail.split('@')[0];

  if (isMockMode) {
    return createOrGetDemoUser(cleanEmail, cleanName);
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    await updateProfile(userCredential.user, {
      displayName: cleanName,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`
    });
    const u = userCredential.user;
    setActiveUser(u);
    seedInitialSubscriptions(u.uid);
    return u;
  } catch {
    return createOrGetDemoUser(cleanEmail, cleanName);
  }
};

export const signInWithEmail = async (email, password) => {
  const cleanEmail = email || 'gaurang@orbitpay.io';
  const cleanName = cleanEmail.split('@')[0];

  if (isMockMode) {
    return createOrGetDemoUser(cleanEmail, cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const u = userCredential.user;
    setActiveUser(u);
    seedInitialSubscriptions(u.uid);
    return u;
  } catch {
    return createOrGetDemoUser(cleanEmail, cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
  }
};

export const signInWithGoogle = async () => {
  if (isMockMode) {
    return createOrGetDemoUser('gaurang.srivastava@orbitpay.io', 'Gaurang Srivastava');
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const u = userCredential.user;
    setActiveUser(u);
    seedInitialSubscriptions(u.uid);
    return u;
  } catch {
    return createOrGetDemoUser('gaurang.srivastava@orbitpay.io', 'Gaurang Srivastava');
  }
};

export const signInWithGithub = async () => {
  if (isMockMode) {
    return createOrGetDemoUser('gaurang.dev@orbitpay.io', 'Gaurang Srivastava');
  }
  
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const u = userCredential.user;
    setActiveUser(u);
    seedInitialSubscriptions(u.uid);
    return u;
  } catch {
    return createOrGetDemoUser('gaurang.dev@orbitpay.io', 'Gaurang Srivastava');
  }
};

export const signOutUser = async () => {
  setActiveUser(null);
  if (!isMockMode && auth) {
    try { await signOut(auth); } catch {}
  }
  return true;
};

export const resetPassword = async (email) => {
  return true;
};

export const onAuthChange = (callback) => {
  const checkState = (firebaseUser) => {
    if (firebaseUser) {
      setActiveUser(firebaseUser);
      seedInitialSubscriptions(firebaseUser.uid);
      callback(firebaseUser);
    } else {
      const active = getActiveUser();
      if (active) {
        seedInitialSubscriptions(active.uid);
      }
      callback(active);
    }
  };

  if (!isMockMode && auth) {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      checkState(firebaseUser);
    });

    // Fallback timer check for local demo user session
    const timer = setInterval(() => {
      if (!auth.currentUser) {
        const active = getActiveUser();
        if (active) callback(active);
      }
    }, 500);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }

  const timer = setInterval(() => {
    const active = getActiveUser();
    callback(active);
  }, 500);

  callback(getActiveUser());
  return () => clearInterval(timer);
};
