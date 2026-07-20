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
  if (isMockMode) {
    const users = getMockUsers();
    if (users.find(u => u.email === email)) {
      throw new Error("Email already in use.");
    }
    const newUser = {
      uid: `mock-user-${Date.now()}`,
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName || email)}`
    };
    users.push({ ...newUser, password });
    saveMockUsers(users);
    setActiveUser(newUser);
    seedInitialSubscriptions(newUser.uid);
    return newUser;
  }
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, {
    displayName: displayName,
    photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName || email)}`
  });
  return userCredential.user;
};

export const signInWithEmail = async (email, password) => {
  if (isMockMode) {
    const users = getMockUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials or user does not exist.");
    }
    const { password: _, ...userWithoutPassword } = user;
    setActiveUser(userWithoutPassword);
    seedInitialSubscriptions(userWithoutPassword.uid);
    return userWithoutPassword;
  }
  
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  if (isMockMode) {
    // Generate a quick mock google login
    const mockGoogleUser = {
      uid: "mock-google-user-123",
      email: "google.user@example.com",
      displayName: "Google Tester",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Google"
    };
    setActiveUser(mockGoogleUser);
    seedInitialSubscriptions(mockGoogleUser.uid);
    return mockGoogleUser;
  }
  
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

export const signInWithGithub = async () => {
  if (isMockMode) {
    const mockGithubUser = {
      uid: "mock-github-user-456",
      email: "github.user@example.com",
      displayName: "Github Dev",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Github"
    };
    setActiveUser(mockGithubUser);
    seedInitialSubscriptions(mockGithubUser.uid);
    return mockGithubUser;
  }
  
  const provider = new GithubAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

export const signOutUser = async () => {
  if (isMockMode) {
    setActiveUser(null);
    return true;
  }
  await signOut(auth);
  return true;
};

export const resetPassword = async (email) => {
  if (isMockMode) {
    const users = getMockUsers();
    if (!users.find(u => u.email === email)) {
      throw new Error("User with this email does not exist.");
    }
    return true;
  }
  await sendPasswordResetEmail(auth, email);
  return true;
};

export const onAuthChange = (callback) => {
  if (isMockMode) {
    // Return unsubscribe function
    const interval = setInterval(() => {
      const active = getActiveUser();
      callback(active);
    }, 1000);
    callback(getActiveUser());
    return () => clearInterval(interval);
  }
  
  return onAuthStateChanged(auth, callback);
};
