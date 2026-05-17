'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext.jsx';
import { getOnboardingRoute } from '../lib/syncProgress.js';
import styles from '../components/auth/auth.module.css';

export default function RootPage() {
  const { isAuthenticated, loading, onboardingStep } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace('/login');
    else router.replace(getOnboardingRoute(onboardingStep));
  }, [loading, isAuthenticated, onboardingStep, router]);

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner} />
    </div>
  );
}
