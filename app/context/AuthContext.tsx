import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AccountType = 'student' | 'instructor';

export interface AuthUser {
  id: string;
  email: string;
  accountType: AccountType;
  phoneNumber?: string;
  ageRange?: string;
  fullName?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (params: { email: string; password: string; phoneNumber?: string; ageRange?: string; accountType?: AccountType; fullName?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'auth_state_v1';

function getApiHost(): string {
  // Access the environment variable from window
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_HOST) {
    const host = String((window as any).__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || window.location.origin;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setToken(parsed.token ?? null);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } catch {}
  }, [user, token, isHydrated]);

  const login = useCallback(async (email: string, password: string) => {
    const host = getApiHost();
    const res = await fetch(`${host}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.error || data?.message || 'Login failed';
      throw new Error(message);
    }
    setToken(data.token);
    setUser(data.user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, token: data.token })); } catch {}
  }, []);

  const signup = useCallback(async (params: { email: string; password: string; phoneNumber?: string; ageRange?: string; accountType?: AccountType; fullName?: string }) => {
    const host = getApiHost();
    const payload = {
      accountType: params.accountType ?? 'student',
      email: params.email,
      password: params.password,
      phoneNumber: params.phoneNumber ?? '',
      ageRange: params.ageRange ?? '',
      fullName: params.fullName ?? ''
    };
    const res = await fetch(`${host}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.error || data?.message || 'Signup failed';
      throw new Error(message);
    }
    setToken(data.token);
    setUser(data.user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, token: data.token })); } catch {}
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    signup,
    logout,
  }), [user, token, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

