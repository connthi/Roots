'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './auth.module.css';

/**
 * @param {{ children: import('react').ReactNode, requireComplete?: boolean }} props
 */
export default function ProtectedRoute({ children, requireComplete = false }) {
  const { isAuthenticated, loading, onboardingStep } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (requireComplete && onboardingStep !== 'complete') {
      if (onboardingStep === 'deep_dive') router.replace('/deep-dive');
      else if (onboardingStep === 'personality') router.replace('/survey');
      else router.replace('/home');
    }
  }, [loading, isAuthenticated, onboardingStep, requireComplete, router]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Loading your session…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireComplete && onboardingStep !== 'complete') return null;

  return children;
}

