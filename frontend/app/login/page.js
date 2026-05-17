'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/auth/AuthForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getOnboardingRoute } from '../../lib/syncProgress.js';
import styles from '../../components/auth/auth.module.css';

export default function LoginPage() {
  const { isAuthenticated, loading, onboardingStep } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      router.replace(getOnboardingRoute(onboardingStep));
    }
  }, [loading, isAuthenticated, onboardingStep, router]);

  if (loading || isAuthenticated) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return <AuthForm />;
}
