'use client';

import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getOnboardingRoute } from '../../lib/syncProgress.js';
import styles from '../../components/auth/auth.module.css';

const FEATURES = [
  {
    icon: '🧠',
    title: 'Behavioral profiling',
    text: 'Discover your financial personality across time horizon, execution style, budget architecture, and risk.',
  },
  {
    icon: '📊',
    title: 'Real-number deep dive',
    text: 'Map income, burn rate, debt, savings, and runway to power your personalized analysis.',
  },
  {
    icon: '🚀',
    title: 'Growth projections',
    text: 'See how today’s habits compound — or quietly tax — your wealth over 1 year, 10 years, and beyond.',
  },
];

function stepLabel(step) {
  switch (step) {
    case 'personality':
      return 'You left off at the personality quiz — pick up where you stopped.';
    case 'deep_dive':
      return 'Almost there — finish your financial deep dive to unlock your dashboard.';
    case 'complete':
      return 'Your profile is ready — view your full results anytime.';
    default:
      return null;
  }
}

function HomeContent() {
  const { user, logout, onboardingStep } = useAuth();
  const resume = getOnboardingRoute(onboardingStep);
  const banner = stepLabel(onboardingStep);

  return (
    <div className={styles.home}>
      <nav className={styles.homeNav}>
        <Link href="/home" className={styles.navBrand}>
          <span>Roots</span>
        </Link>
        <div className={styles.navActions}>
          <span className={styles.navUser}>Hi, {user?.name?.split(' ')[0]}</span>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            Log out
          </button>
        </div>
      </nav>

      <section className={styles.hero}>
        <span className={styles.heroBadge}>AI-powered financial literacy</span>
        <h1 className={styles.heroTitle}>
          Welcome back, <em>{user?.name?.split(' ')[0]}</em>
        </h1>
        <p className={styles.heroDesc}>
          Roots helps you understand how you think about money — then turns that into a
          personalized finance analysis built for long-term growth.
        </p>

        {banner && (
          <p className={styles.progressBanner}>
            <strong>Continue:</strong> {banner}
          </p>
        )}

        <Link
          href={onboardingStep === 'complete' ? '/dashboard' : resume === '/home' ? '/survey' : resume}
          className={styles.ctaPrimary}
        >
          {onboardingStep === 'complete'
            ? 'View my results →'
            : onboardingStep === 'none'
              ? 'Start my financial analysis →'
              : 'Resume onboarding →'}
        </Link>

        {onboardingStep !== 'none' && onboardingStep !== 'complete' && (
          <Link href="/survey" className={styles.ctaSecondary}>
            Or restart from the beginning
          </Link>
        )}
      </section>

      <section className={styles.cards}>
        {FEATURES.map((f) => (
          <article key={f.title} className={styles.card}>
            <div className={styles.cardIcon}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
