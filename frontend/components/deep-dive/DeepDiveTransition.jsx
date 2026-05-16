'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getDeepDiveTransition } from '../../lib/deepDive/transitionCopy.js';
import styles from './DeepDiveTransition.module.css';

const DISMISS_KEY = 'roots_deep_dive_dismissed';

/**
 * Interstitial hook: personality reveal → 10-question deep-dive (real $ inputs).
 *
 * @param {{ archetype: { code: string, name: string, vibe: string, traits?: string[] }, className?: string }} props
 */
export default function DeepDiveTransition({ archetype, className = '' }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  });

  if (!archetype?.code) return null;

  const copy = getDeepDiveTransition(archetype);
  const barHeights =
    copy.timeLetter === 'V'
      ? ['35%', '48%', '62%', '78%', '92%']
      : ['55%', '62%', '68%', '74%', '82%'];

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  if (dismissed) {
    return (
      <div className={`${styles.card} ${styles.dismissed} ${className}`}>
        <p className={styles.trust}>
          Deep-dive paused.{' '}
          <Link href="/deep-dive" style={{ color: '#6bcf8a' }}>
            Resume when ready →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <section
      className={`${styles.card} ${className}`}
      aria-labelledby="deep-dive-transition-heading"
    >
      <div className={styles.glow} aria-hidden />

      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>
            <span className={styles.stepPill}>{copy.stepLabel}</span>
          </p>
          <h2 id="deep-dive-transition-heading" className={styles.headline}>
            {copy.headline}
          </h2>
          <p className={styles.subhead}>{copy.subhead}</p>

          {copy.callout && <p className={styles.callout}>{copy.callout}</p>}

          <ul className={styles.bullets}>
            {copy.bullets.map((item) => (
              <li key={item} className={styles.bullet}>
                <span className={styles.bulletIcon} aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className={styles.flourishes}>
            {copy.flourishes.map((line) => (
              <p key={line} className={styles.flourish}>
                {line}
              </p>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/deep-dive" className={styles.ctaPrimary}>
              {copy.ctaPrimary}
              <span aria-hidden>→</span>
            </Link>
            <button type="button" className={styles.ctaSecondary} onClick={handleDismiss}>
              {copy.ctaSecondary}
            </button>
          </div>

          <p className={styles.trust}>{copy.trustLine}</p>
        </div>

        <div className={styles.visual} aria-hidden>
          <p className={styles.visualLabel}>{copy.chartLabel}</p>
          <div className={styles.chart}>
            {barHeights.map((h, i) => (
              <div
                key={i}
                className={`${styles.barNow} ${i === barHeights.length - 1 ? styles.barTall : ''}`}
                style={{ height: i < 3 ? h : '40%' }}
              />
            ))}
            <div
              className={`${styles.barOptimized} ${styles.barTall}`}
              style={{ height: copy.timeLetter === 'V' ? '95%' : '88%' }}
            />
          </div>
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.dotNow} /> Current path
            </span>
            <span className={styles.legendItem}>
              <span className={styles.dotOpt} /> With your real data
            </span>
          </div>
          <p className={styles.locked}>🔒 Unlocks after 10 inputs</p>
        </div>
      </div>
    </section>
  );
}
