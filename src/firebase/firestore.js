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

// --- MOCK STORAGE IMPLEMENTATION ---
const getMockData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveMockData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- USER PROFILE CRUD ---
export const createUserProfile = async (userId, data) => {
  if (isMockMode) {
    const profile = {
      uid: userId,
      displayName: data.displayName || "",
      email: data.email || "",
      photoURL: data.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`,
      currency: "INR",
      theme: "dark",
      plan: "free",
      createdAt: new Date().toISOString(),
      notifications: {
        email: true,
        push: true,
        renewalReminder: 3
      }
    };
    saveMockData(`subsync_profile_${userId}`, profile);
    return profile;
  }
  
  const userRef = doc(db, 'users', userId);
  const profile = {
    uid: userId,
    displayName: data.displayName || "",
    email: data.email || "",
    photoURL: data.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`,
    currency: "INR",
    theme: "dark",
    plan: "free",
    createdAt: new Date().toISOString(),
    notifications: {
      email: true,
      push: true,
      renewalReminder: 3
    }
  };
  await setDoc(userRef, profile);
  return profile;
};

export const getUserProfile = async (userId) => {
  if (isMockMode) {
    let profile = localStorage.getItem(`subsync_profile_${userId}`);
    if (!profile) {
      const active = JSON.parse(localStorage.getItem('subsync_active_user'));
      profile = await createUserProfile(userId, { 
        displayName: active?.displayName || "", 
        email: active?.email || "" 
      });
      return profile;
    }
    return JSON.parse(profile);
  }
  
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // Try to create profile
    const active = auth?.currentUser;
    return await createUserProfile(userId, { 
      displayName: active?.displayName || "", 
      email: active?.email || "" 
    });
  }
};

export const updateUserProfile = async (userId, updates) => {
  if (isMockMode) {
    const profile = await getUserProfile(userId);
    const updated = { ...profile, ...updates };
    saveMockData(`subsync_profile_${userId}`, updated);
    
    // update display name in active session
    const active = JSON.parse(localStorage.getItem('subsync_active_user') || '{}');
    if (active && active.uid === userId) {
      if (updates.displayName) active.displayName = updates.displayName;
      if (updates.photoURL) active.photoURL = updates.photoURL;
      localStorage.setItem('subsync_active_user', JSON.stringify(active));
    }
    return updated;
  }
  
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
  return updates;
};

// --- SUBSCRIPTIONS CRUD ---
export const addSubscription = async (userId, subscription) => {
  const newSub = {
    ...subscription,
    cost: parseFloat(subscription.cost) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (isMockMode) {
    const key = `subsync_subs_${userId}`;
    const subs = getMockData(key);
    newSub.id = `sub-${Date.now()}`;
    subs.push(newSub);
    saveMockData(key, subs);
    
    // Add activity log
    await addActivityLog(userId, {
      type: 'added',
      subscriptionName: newSub.name,
      details: `Added ${newSub.name} subscription`
    });
    
    return newSub;
  }
  
  const subsRef = collection(db, 'users', userId, 'subscriptions');
  const docRef = await addDoc(subsRef, newSub);
  const addedSub = { ...newSub, id: docRef.id };
  
  // Add activity log
  await addActivityLog(userId, {
    type: 'added',
    subscriptionName: newSub.name,
    details: `Added ${newSub.name} subscription`
  });
  
  return addedSub;
};

export const getSubscriptions = async (userId) => {
  if (isMockMode) {
    return getMockData(`subsync_subs_${userId}`);
  }
  
  const subsRef = collection(db, 'users', userId, 'subscriptions');
  const q = query(subsRef, orderBy('name', 'asc'));
  const querySnapshot = await getDocs(q);
  const subs = [];
  querySnapshot.forEach((doc) => {
    subs.push({ id: doc.id, ...doc.data() });
  });
  return subs;
};

export const updateSubscription = async (userId, subId, updates) => {
  const finalUpdates = {
    ...updates,
    cost: updates.cost !== undefined ? parseFloat(updates.cost) : undefined,
    updatedAt: new Date().toISOString()
  };
  // remove undefined
  Object.keys(finalUpdates).forEach(key => finalUpdates[key] === undefined && delete finalUpdates[key]);

  if (isMockMode) {
    const key = `subsync_subs_${userId}`;
    const subs = getMockData(key);
    const index = subs.findIndex(s => s.id === subId);
    if (index !== -1) {
      const oldSub = subs[index];
      subs[index] = { ...oldSub, ...finalUpdates };
      saveMockData(key, subs);
      
      let details = `Updated ${oldSub.name}`;
      let type = 'updated';
      if (updates.status && updates.status !== oldSub.status) {
        type = updates.status; // 'paused' or 'active' or 'cancelled'
        details = `${updates.status.toUpperCase()} ${oldSub.name} subscription`;
      }
      
      await addActivityLog(userId, {
        type,
        subscriptionName: oldSub.name,
        details
      });
      return subs[index];
    }
    throw new Error("Subscription not found");
  }
  
  const subRef = doc(db, 'users', userId, 'subscriptions', subId);
  const snap = await getDoc(subRef);
  const oldSub = snap.data();
  
  await updateDoc(subRef, finalUpdates);
  
  let details = `Updated ${oldSub?.name || 'subscription'}`;
  let type = 'updated';
  if (updates.status && updates.status !== oldSub?.status) {
    type = updates.status;
    details = `${updates.status.toUpperCase()} ${oldSub?.name || 'subscription'} subscription`;
  }
  
  await addActivityLog(userId, {
    type,
    subscriptionName: oldSub?.name || 'subscription',
    details
  });
  
  return { id: subId, ...finalUpdates };
};

export const deleteSubscription = async (userId, subId, subName) => {
  if (isMockMode) {
    const key = `subsync_subs_${userId}`;
    const subs = getMockData(key);
    const filtered = subs.filter(s => s.id !== subId);
    saveMockData(key, filtered);
    
    await addActivityLog(userId, {
      type: 'cancelled',
      subscriptionName: subName || "Subscription",
      details: `Deleted ${subName || "subscription"} tracker`
    });
    return true;
  }
  
  const subRef = doc(db, 'users', userId, 'subscriptions', subId);
  await deleteDoc(subRef);
  
  await addActivityLog(userId, {
    type: 'cancelled',
    subscriptionName: subName || "Subscription",
    details: `Deleted ${subName || "subscription"} tracker`
  });
  return true;
};

// --- ACTIVITY LOGS CRUD ---
export const addActivityLog = async (userId, log) => {
  const newLog = {
    ...log,
    timestamp: Date.now()
  };
  
  if (isMockMode) {
    const key = `subsync_activity_${userId}`;
    const logs = getMockData(key);
    newLog.id = `act-${Date.now()}`;
    logs.unshift(newLog);
    // Keep last 50 activities
    if (logs.length > 50) logs.pop();
    saveMockData(key, logs);
    return newLog;
  }
  
  const activityRef = collection(db, 'users', userId, 'activity');
  await addDoc(activityRef, newLog);
  return newLog;
};

export const getActivityLogs = async (userId) => {
  if (isMockMode) {
    return getMockData(`subsync_activity_${userId}`);
  }
  
  const activityRef = collection(db, 'users', userId, 'activity');
  const q = query(activityRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  const logs = [];
  querySnapshot.forEach((doc) => {
    logs.push({ id: doc.id, ...doc.data() });
  });
  return logs;
};

// --- REAL-TIME LISTENERS ---
export const listenToSubscriptions = (userId, callback) => {
  if (isMockMode) {
    // Simulate real-time by checking local storage
    const interval = setInterval(() => {
      const subs = getMockData(`subsync_subs_${userId}`);
      callback(subs);
    }, 1500);
    
    callback(getMockData(`subsync_subs_${userId}`));
    return () => clearInterval(interval);
  }
  
  const subsRef = collection(db, 'users', userId, 'subscriptions');
  const q = query(subsRef, orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const subs = [];
    snapshot.forEach((doc) => {
      subs.push({ id: doc.id, ...doc.data() });
    });
    callback(subs);
  }, (error) => {
    console.error("Firestore listen error: ", error);
  });
};

export const listenToActivityLogs = (userId, callback) => {
  if (isMockMode) {
    const interval = setInterval(() => {
      const logs = getMockData(`subsync_activity_${userId}`);
      callback(logs);
    }, 2000);
    callback(getMockData(`subsync_activity_${userId}`));
    return () => clearInterval(interval);
  }
  
  const activityRef = collection(db, 'users', userId, 'activity');
  const q = query(activityRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const logs = [];
    snapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    callback(logs);
  });
};
