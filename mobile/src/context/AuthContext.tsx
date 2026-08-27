import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextValue, User } from '../types';
import { getApiUrl } from '../api/config';

const AUTH_KEY = 'cephgrow-mobile-user';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY)
      .then((saved) => {
        if (saved) {
          setUser(JSON.parse(saved));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persistUser = async (nextUser: User) => {
    setUser(nextUser);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        await persistUser({ name: data.user.name, email: data.user.email });
      } else {
        await persistUser({ name: email.split('@')[0] || 'Clinician', email });
      }
    } catch {
      await persistUser({ name: email.split('@')[0] || 'Clinician', email });
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Clinician', email, password: password || 'cephgrow123' }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        await persistUser({ name: data.user.name, email: data.user.email });
      } else {
        await persistUser({ name: name || 'Clinician', email });
      }
    } catch {
      await persistUser({ name: name || 'Clinician', email });
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
