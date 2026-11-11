'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError } from './api';

export interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  profile?: UserProfile | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get<{ user: User }>('/api/v1/auth/me');
      setUser(res.user);
    } catch (err: any) {
      if (err?.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('careercraft_token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ user: User; accessToken?: string }>('/api/v1/auth/login', { email, password });
    if (res?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('careercraft_token', res.accessToken);
    }
    setUser(res.user);
  };

  const register = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const res = await api.post<{ user: User; accessToken?: string }>('/api/v1/auth/register', data);
    if (res?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('careercraft_token', res.accessToken);
    }
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('careercraft_token');
      }
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
