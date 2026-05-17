'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './auth.module.css';

export default function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.brandPanel}>
        <div className={styles.brandGlow} aria-hidden />
        <h1 className={styles.brandTitle}>Grow your wealth with clarity.</h1>
        <p className={styles.brandTagline}>
          Roots combines AI-powered insights with behavioral finance to help you understand
          how you spend, save, and plan for the long game.
        </p>
        <ul className={styles.featureList}>
          <li>Financial personality profiling</li>
          <li>Personalized analysis & projections</li>
          <li>Progress saved across sessions</li>
        </ul>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <p className={styles.logo}>Roots</p>
          <h2 className={styles.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className={styles.formSubtitle}>
            {mode === 'login'
              ? 'Sign in to continue your financial journey.'
              : 'Start building your personalized financial profile.'}
          </p>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
              onClick={() => {
                setMode('signup');
                setError('');
              }}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p className={styles.error}>{error}</p>}

            {mode === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                required
                minLength={mode === 'signup' ? 8 : undefined}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
