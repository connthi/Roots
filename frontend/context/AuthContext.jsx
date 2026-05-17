'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchMe,
  postLogin,
  postSignup,
  setToken,
  getToken,
} from '../lib/api.js';
import { clearProfile } from '../lib/profileSession.js';
import { getOnboardingRoute, hydrateSessionFromServer } from '../lib/syncProgress.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState('none');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const applySession = useCallback((data) => {
    setUser(data.user);
    setOnboardingStep(data.onboarding_step || 'none');
    hydrateSessionFromServer(data.profile);
  }, []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setOnboardingStep('none');
      setLoading(false);
      return null;
    }
    try {
      const data = await fetchMe();
      applySession(data);
      return data;
    } catch {
      setToken(null);
      setUser(null);
      setOnboardingStep('none');
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function login(email, password) {
    const data = await postLogin({ email, password });
    setToken(data.token);
    applySession(data);
    router.push(getOnboardingRoute(data.onboarding_step));
    return data;
  }

  async function signup(name, email, password) {
    const data = await postSignup({ name, email, password });
    setToken(data.token);
    applySession(data);
    router.push('/home');
    return data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    setOnboardingStep('none');
    clearProfile();
    router.push('/login');
  }

  function updateOnboardingStep(step) {
    setOnboardingStep(step);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        onboardingStep,
        loading,
        login,
        signup,
        logout,
        refresh,
        updateOnboardingStep,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
