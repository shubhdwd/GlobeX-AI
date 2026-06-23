import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, authApi, tokenStore } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Session Restore ───────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      const refresh = localStorage.getItem('globex_refresh_token');
      if (!refresh) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const { data } = await api.post('/auth/refresh', { refreshToken: refresh });
        const { accessToken, refreshToken } = data.data;

        tokenStore.set(accessToken);
        localStorage.setItem('globex_refresh_token', refreshToken);

        // Fetch user profile
        const profileRes = await authApi.getProfile();
        if (isMounted) setUser(profileRes.data.data);
      } catch (err) {
        tokenStore.clear();
        localStorage.removeItem('globex_refresh_token');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    restoreSession();
    return () => { isMounted = false; };
  }, []);

  // ── Sign Up ───────────────────────────────────────────────────────────
  const signup = useCallback(async (userData) => {
    const { data } = await authApi.signup(userData);
    const { user: u, tokens } = data.data;
    
    tokenStore.set(tokens.accessToken);
    localStorage.setItem('globex_refresh_token', tokens.refreshToken);
    setUser(u);
    return u;
  }, []);

  // ── Sign In ───────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const { data } = await authApi.login({ email, password });
    const { user: u, tokens } = data.data;

    tokenStore.set(tokens.accessToken);
    localStorage.setItem('globex_refresh_token', tokens.refreshToken);
    setUser(u);
    return u;
  }, []);

  // ── Google Login ──────────────────────────────────────────────────────
  const googleLogin = useCallback(async (accessToken) => {
    const { data } = await authApi.googleLogin(accessToken);
    const { user: u, tokens } = data.data;

    tokenStore.set(tokens.accessToken);
    localStorage.setItem('globex_refresh_token', tokens.refreshToken);
    setUser(u);
    return u;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore server errors */ }
    tokenStore.clear();
    localStorage.removeItem('globex_refresh_token');
    setUser(null);
  }, []);

  const value = { user, loading, signup, login, googleLogin, logout, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
