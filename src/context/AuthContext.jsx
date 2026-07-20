import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithGithub, 
  signOutUser, 
  onAuthChange 
} from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    setLoading(true);
    try {
      const u = await signUpWithEmail(email, password, displayName);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const u = await signInWithEmail(email, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const u = await signInWithGoogle();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setLoading(true);
    try {
      const u = await signInWithGithub();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPhoto = (newPhotoURL) => {
    setUser(prev => prev ? { ...prev, photoURL: newPhotoURL } : null);
    const active = JSON.parse(localStorage.getItem('subsync_active_user') || '{}');
    if (active && active.uid) {
      active.photoURL = newPhotoURL;
      localStorage.setItem('subsync_active_user', JSON.stringify(active));
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    setUser,
    updateUserPhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
