import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AccountType = 'student' | 'instructor';

export interface AuthUser {
  id: string;
  email: string;
  accountType: AccountType;
  phoneNumber?: string;
  ageRange?: string;
  fullName?: string;
  memberSince?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (params: { email: string; password: string; phoneNumber?: string; ageRange?: string; accountType?: AccountType; fullName?: string; memberSince?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getApiHost(): string {
  // Access the environment variable from window
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_HOST) {
    const host = String((window as any).__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || 'http://localhost:3001';
  }
  // Fallback to localhost for development
  return 'http://localhost:3001';
}

// Helper to set server-side session cookie
async function setServerSession(user: AuthUser, token: string) {
  try {
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('token', token);
    formData.append('accountType', user.accountType || '');
    formData.append('email', user.email || '');
    formData.append('fullName', user.fullName || '');
    formData.append('phoneNumber', user.phoneNumber || '');
    formData.append('ageRange', user.ageRange || '');
    formData.append('memberSince', user.memberSince || '');

    const response = await fetch('/api/auth/set-session', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin', // Important: ensure cookies are sent/received
    });
    
    if (!response.ok) {
      console.error('[AuthContext] Failed to set server session:', response.status);
    } else {
      console.log('[AuthContext] Server session set successfully');
    }
  } catch (error) {
    console.error('[AuthContext] Failed to set server session:', error);
    // Don't throw - session cookie is optional, localStorage is primary
  }
}

export const AuthProvider: React.FC<{ 
  children: React.ReactNode;
  initialUser?: AuthUser | null;
  initialToken?: string | null;
}> = ({ children, initialUser = null, initialToken = null }) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount, just mark as hydrated - user/token come from server
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
    
    // Set server-side session cookie
    await setServerSession(data.user, data.token);
    
    // Update local state only after server session is set
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (params: { email: string; password: string; phoneNumber?: string; ageRange?: string; accountType?: AccountType; fullName?: string; memberSince?: string }) => {
    const host = getApiHost();
    const payload = {
      accountType: params.accountType ?? 'student',
      email: params.email,
      password: params.password,
      phoneNumber: params.phoneNumber ?? '',
      ageRange: params.ageRange ?? '',
      fullName: params.fullName ?? '',
      memberSince: params.memberSince
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
    
    // Set server-side session cookie
    await setServerSession(data.user, data.token);
    
    // Update local state only after server session is set
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    // Clear server-side session cookie first
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'same-origin'
      });
    } catch (error) {
      console.error('Failed to clear server session:', error);
    }
    
    // Then clear local state
    setToken(null);
    setUser(null);
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

