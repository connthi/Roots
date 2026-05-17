'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildAnalyzePayload } from '../../lib/deepDive/buildPayload.js';
import { saveProfile } from '../../lib/profileSession.js';
import { DEEP_DIVE_QUESTIONS } from '../../lib/deepDive/questions.js';
import { getDeepDiveTransition } from '../../lib/deepDive/transitionCopy.js';
import styles from './DeepDiveQuiz.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function formatMoney(n) {
  if (n == null || Number.isNaN(n)) return '0';
  return Math.round(n).toLocaleString('en-US');
}

function parseMoney(raw) {
  const cleaned = String(raw).replace(/[^0-9.]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function isAnswered(question, answers, creditPaidInFull = false) {
  const v = answers[question.key];
  if (question.type === 'credit_debt') {
    if (creditPaidInFull || v === 0) return true;
    return v != null && v !== '' && Number(v) > 0;
  }
  if (question.type === 'bracket') {
    return typeof v === 'string' && v.length > 0;
  }
  if (question.type === 'runway') {
    return v != null && v !== '';
  }
  return v != null && v !== '' && Number(v) >= 0;
}

/**
 * @param {{ archetypeProfile: { code: string, name: string }, quizResult: object }} props
 */
export default function DeepDiveQuiz({ archetypeProfile, quizResult }) {
  const router = useRouter();
  const [phase, setPhase] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [creditNoBalance, setCreditNoBalance] = useState(false);
  const [error, setError] = useState(null);

  const copy = useMemo(
    () => getDeepDiveTransition(archetypeProfile),
    [archetypeProfile],
  );

  const question = DEEP_DIVE_QUESTIONS[currentIndex];
  const progress = ((currentIndex + (phase === 'quiz' ? 1 : 0)) / DEEP_DIVE_QUESTIONS.length) * 100;
  const canContinue = question
    ? isAnswered(
        question,
        answers,
        question.key === 'credit_card_debt' && creditNoBalance,
      )
    : false;

  function setAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (phase !== 'quiz' || !question) return;
    if (question.type === 'runway' && answers[question.key] == null) {
      setAnswer(question.key, 0);
    }
  }, [currentIndex, phase, question?.id]);

  async function finishQuiz(finalAnswers) {
    setPhase('analyzing');
    setError(null);

    const payload = buildAnalyzePayload(quizResult, finalAnswers);

    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || data.detail || text || 'Failed to generate profile');
      }

      saveProfile({
        archetype: quizResult,
        personalityComplete: true,
        deepDive: finalAnswers,
        bedrock: data,
      });
      sessionStorage.removeItem('roots_deep_dive_dismissed');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setPhase('quiz');
    }
  }

  function goNext() {
    if (!canContinue) return;
    if (currentIndex < DEEP_DIVE_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCreditNoBalance(false);
    } else {
      finishQuiz(answers);
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setCreditNoBalance(false);
    }
  }

  if (phase === 'welcome') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.brand}>Roots · Deep Dive</p>
          <h1 className={styles.title}>Map your real math</h1>
          <p className={styles.subtitle}>{copy.subhead}</p>
          <span className={styles.archetypePill}>
            {archetypeProfile.code} · {archetypeProfile.name}
          </span>
        </header>
        <div className={styles.card}>
          <p className={styles.subtitle} style={{ margin: 0 }}>
            Ten inputs power your <strong style={{ color: 'var(--text)' }}>PFA</strong> and{' '}
            <strong style={{ color: 'var(--text)' }}>PER</strong> — tuned to how you actually move money.
          </p>
          <ul className={styles.welcomeList}>
            <li>~2 minutes · estimates are fine</li>
            <li>No bank linking · private on your device</li>
            <li>Unlocks wealth sliders & net-worth charts</li>
          </ul>
          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary} onClick={() => setPhase('quiz')}>
              {copy.ctaPrimary} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'analyzing') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.brand}>Roots</p>
          <h1 className={styles.title}>Building your PFA…</h1>
          <p className={styles.subtitle}>
            Crunching income, burn rate, debt drag, and runway into your personalized report.
          </p>
        </header>
        <div className={`${styles.card} ${styles.analyzingCard}`}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  const value = answers[question.key];

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.brand}>Deep Dive</p>
        <p className={styles.categoryTag}>{question.categoryLabel}</p>
      </header>

      <div className={styles.progressWrap}>
        <div className={styles.progressMeta}>
          <span>
            {currentIndex + 1} of {DEEP_DIVE_QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.card} key={question.id}>
        <p className={styles.questionText}>{question.text}</p>
        <p className={styles.hint}>{question.hint}</p>

        <QuestionInput
          question={question}
          value={value}
          creditNoBalance={creditNoBalance}
          onCreditNoBalanceChange={setCreditNoBalance}
          onChange={setAnswer}
        />

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={goBack}
            disabled={currentIndex === 0}
          >
            Back
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={goNext}
            disabled={!canContinue}
          >
            {currentIndex === DEEP_DIVE_QUESTIONS.length - 1 ? 'Generate my PFA' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionInput({ question, value, creditNoBalance, onCreditNoBalanceChange, onChange }) {
  const { key, type, min = 0, max = 10000, step = 1, suffix = '' } = question;

  if (type === 'currency') {
    return (
      <CurrencyField value={value ?? ''} onChange={(n) => onChange(key, n)} min={min} max={max} />
    );
  }

  if (type === 'currency_slider') {
    const num = Number(value) || 0;
    return (
      <>
        <p className={styles.sliderValue}>
          ${formatMoney(num)}
          {suffix}
        </p>
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          step={step}
          value={num}
          onChange={(e) => onChange(key, Number(e.target.value))}
        />
        <div className={styles.sliderMeta}>
          <span>${formatMoney(min)}</span>
          <span>${formatMoney(max)}+</span>
        </div>
        <CurrencyField value={value ?? ''} onChange={(n) => onChange(key, n)} min={min} max={max} />
      </>
    );
  }

  if (type === 'credit_debt') {
    return (
      <>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${creditNoBalance ? styles.toggleBtnActive : ''}`}
            onClick={() => {
              onCreditNoBalanceChange(true);
              onChange(key, 0);
            }}
          >
            ✓ I pay my cards in full — $0 balance
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${!creditNoBalance && value > 0 ? styles.toggleBtnActive : ''}`}
            onClick={() => onCreditNoBalanceChange(false)}
          >
            I carry a revolving balance
          </button>
        </div>
        {!creditNoBalance && (
          <CurrencyField value={value ?? ''} onChange={(n) => onChange(key, n)} min={min} max={max} />
        )}
      </>
    );
  }

  if (type === 'runway') {
    const months = Number(value) || 0;
    const label = months >= 12 ? '12+ months' : `${months} month${months === 1 ? '' : 's'}`;
    return (
      <>
        <p className={styles.runwayDisplay}>{label}</p>
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          step={step}
          value={months}
          onChange={(e) => onChange(key, Number(e.target.value))}
        />
        <div className={styles.sliderMeta}>
          <span>0 months</span>
          <span>12+ months</span>
        </div>
      </>
    );
  }

  if (type === 'bracket') {
    return (
      <div className={styles.bracketGrid}>
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${styles.bracketBtn} ${value === opt.value ? styles.bracketBtnActive : ''}`}
            onClick={() => onChange(key, opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return null;
}

function CurrencyField({ value, onChange, min, max }) {
  return (
    <div className={styles.currencyWrap}>
      <span className={styles.currencyPrefix}>$</span>
      <input
        type="text"
        inputMode="decimal"
        className={styles.currencyInput}
        placeholder="0"
        value={value === 0 || value ? String(value) : ''}
        onChange={(e) => {
          const n = parseMoney(e.target.value);
          onChange(Math.min(max, Math.max(min, n)));
        }}
        aria-label="Amount in dollars"
      />
    </div>
  );
}
