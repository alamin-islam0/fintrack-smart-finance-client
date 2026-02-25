'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/services/api/auth';
import { AuthUser } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { name: string; email: string; photoUrl?: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const token = localStorage.getItem('fintrack_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      localStorage.removeItem('fintrack_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('fintrack_token', data.token);
      setUser(data.user);
      toast.success('Welcome back');
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      return true;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || 'Login failed';
      toast.error(status ? `${message} (HTTP ${status})` : message);
      return false;
    }
  };

  const register = async (payload: { name: string; email: string; photoUrl?: string; password: string }) => {
    try {
      const { data } = await authApi.register(payload);
      localStorage.setItem('fintrack_token', data.token);
      setUser(data.user);
      toast.success('Account created');
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      return true;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(status ? `${message} (HTTP ${status})` : message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    setUser(null);
    router.push('/auth/login');
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
