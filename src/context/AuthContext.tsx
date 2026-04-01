"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, isDummyFirebase } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

const DUMMY_USER_KEY = "forma_dummy_user";

const MOCK_USER = {
  uid: "dummy_user_123",
  displayName: "Mock User",
  email: "mock@example.com",
} as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDummyFirebase || !auth) {
      const stored = localStorage.getItem(DUMMY_USER_KEY);
      if (stored) {
        setUser(MOCK_USER);
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    if (isDummyFirebase || !auth) {
      localStorage.setItem(DUMMY_USER_KEY, "true");
      setUser(MOCK_USER);
      return;
    }

    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (isDummyFirebase || !auth) {
      localStorage.removeItem(DUMMY_USER_KEY);
      setUser(null);
      return;
    }

    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
