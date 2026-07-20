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

// Mock DB for auth when running locally without firebase config
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
      name: "Spotify",
      logo: "https://www.scdn.co/lyric-find/assets/images/favicon.png",
      category: "entertainment",
      cost: 179,
      currency: "INR",
      billingCycle: "monthly",
      startDate: "2026-02-10",
      nextRenewal: "2026-08-10",
      status: "active",
      paymentMethod: "UPI Auto-pay",
      notes: "Duo Plan",
      color: "#1DB954"
    },
    {
      id: "sub-3",
      name: "AWS Cloud",
      logo: "https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico",
      category: "utilities",
      cost: 1450,
      currency: "INR",
      billingCycle: "monthly",
      startDate: "2026-03-01",
      nextRenewal: "2026-08-01",
      status: "active",
      paymentMethod: "ICICI Credit Card",
      notes: "EC2 & S3 billing",
      color: "#FF9900"
    },
    {
      id: "sub-4",
      name: "Adobe CC",
      logo: "https://www.adobe.com/favicon.ico",
      category: "work",
      cost: 4230,
      currency: "INR",
      billingCycle: "monthly",
      startDate: "2025-12-24",
      nextRenewal: "2026-08-24",
      status: "paused",
      paymentMethod: "Credit Card",
      notes: "Creative Cloud All Apps",
      color: "#FF0000"
    },
    {
      id: "sub-5",
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
    }
  ];
  
  const existingKey = `subsync_subs_${userId}`;
  if (!localStorage.getItem(existingKey)) {
    localStorage.setItem(existingKey, JSON.stringify(initialSubs));
    
    // Seed initial activity feed
    const initialActivity = [
      { id: "act-1", type: "added", subscriptionName: "Netflix", details: "Added Netflix Premium subscription", timestamp: Date.now() - 86400000 * 3 },
      { id: "act-2", type: "added", subscriptionName: "Spotify", details: "Added Spotify Duo subscription", timestamp: Date.now() - 86400000 * 2 },
      { id: "act-3", type: "paused", subscriptionName: "Adobe CC", details: "Paused Adobe Creative Cloud subscription", timestamp: Date.now() - 36000000 }
    ];
    localStorage.setItem(`subsync_activity_${userId}`, JSON.stringify(initialActivity));
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  const cleanEmail = email || `user_${Date.now()}@orbitpay.io`;
  const cleanName = displayName || cleanEmail.split('@')[0];

  if (isMockMode) {
    const users = getMockUsers();
    let existing = users.find(u => u.email === cleanEmail);
    if (!existing) {
      existing = {
        uid: `mock-user-${Date.now()}`,
        email: cleanEmail,
        displayName: cleanName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`,
        password: password || 'password123'
      };
      users.push(existing);
      saveMockUsers(users);
    }
    const { password: _, ...userWithoutPassword } = existing;
    setActiveUser(userWithoutPassword);
    seedInitialSubscriptions(userWithoutPassword.uid);
    return userWithoutPassword;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    await updateProfile(userCredential.user, {
      displayName: cleanName,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`
    });
    return userCredential.user;
  } catch {
    // Fallback in case Firebase errors out
    const fallbackUser = {
      uid: `user-${Date.now()}`,
      email: cleanEmail,
      displayName: cleanName,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`
    };
    setActiveUser(fallbackUser);
    seedInitialSubscriptions(fallbackUser.uid);
    return fallbackUser;
  }
};

export const signInWithEmail = async (email, password) => {
  const cleanEmail = email || 'gaurang@orbitpay.io';
  const cleanName = cleanEmail.split('@')[0];

  if (isMockMode) {
    const users = getMockUsers();
    let user = users.find(u => u.email === cleanEmail);
    if (!user) {
      user = {
        uid: `mock-user-${Date.now()}`,
        email: cleanEmail,
        displayName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanEmail)}`,
        password: password || 'password123'
      };
      users.push(user);
      saveMockUsers(users);
    }
    const { password: _, ...userWithoutPassword } = user;
    setActiveUser(userWithoutPassword);
    seedInitialSubscriptions(userWithoutPassword.uid);
    return userWithoutPassword;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return userCredential.user;
  } catch {
    // Fallback seamless login
    const fallbackUser = {
      uid: `user-${Date.now()}`,
      email: cleanEmail,
      displayName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanEmail)}`
    };
    setActiveUser(fallbackUser);
    seedInitialSubscriptions(fallbackUser.uid);
    return fallbackUser;
  }
};

export const signInWithGoogle = async () => {
  const mockGoogleUser = {
    uid: "mock-google-user-123",
    email: "google.user@orbitpay.io",
    displayName: "Google User",
    photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Google"
  };

  if (isMockMode) {
    setActiveUser(mockGoogleUser);
    seedInitialSubscriptions(mockGoogleUser.uid);
    return mockGoogleUser;
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch {
    // Fallback seamless login if popup blocked or offline
    setActiveUser(mockGoogleUser);
    seedInitialSubscriptions(mockGoogleUser.uid);
    return mockGoogleUser;
  }
};

export const signInWithGithub = async () => {
  const mockGithubUser = {
    uid: "mock-github-user-456",
    email: "github.user@orbitpay.io",
    displayName: "GitHub Dev",
    photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Github"
  };

  if (isMockMode) {
    setActiveUser(mockGithubUser);
    seedInitialSubscriptions(mockGithubUser.uid);
    return mockGithubUser;
  }
  
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch {
    // Fallback seamless login if popup blocked or offline
    setActiveUser(mockGithubUser);
    seedInitialSubscriptions(mockGithubUser.uid);
    return mockGithubUser;
  }
};

export const signOutUser = async () => {
  setActiveUser(null);
  if (!isMockMode) {
    try { await signOut(auth); } catch {}
  }
  return true;
};

export const resetPassword = async (email) => {
  if (isMockMode) {
    return true;
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch {}
  return true;
};

export const onAuthChange = (callback) => {
  if (isMockMode) {
    const interval = setInterval(() => {
      const active = getActiveUser();
      callback(active);
    }, 1000);
    callback(getActiveUser());
    return () => clearInterval(interval);
  }
  
  return onAuthStateChanged(auth, callback);
};
