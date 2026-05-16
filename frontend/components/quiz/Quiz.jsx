'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DISPLAY_QUESTIONS, LIKERT_LABELS } from '../../lib/quiz/questions.js';
import { scoreQuiz } from '../../lib/quiz/score.js';
import styles from './Quiz.module.css';

export default function Quiz() {
  const [phase, setPhase] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const question = DISPLAY_QUESTIONS[currentIndex];
  const selected = question ? (answers[question.id] ?? null) : null;
  const progress = ((currentIndex + (phase === 'quiz' ? 1 : 0)) / DISPLAY_QUESTIONS.length) * 100;

  function selectLikert(likertIndex) {
    const next = { ...answers, [question.id]: likertIndex };
    setAnswers(next);

    if (currentIndex < DISPLAY_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 180);
    } else {
      finishQuiz(next);
    }
  }

  async function finishQuiz(finalAnswers) {
    const finalResult = scoreQuiz(finalAnswers);
    setResult(finalResult);
    setPhase('analyzing');
    setError(null);

    try {
      const payload = {
        age: 22,
        annual_income: 45000,
        monthly_rent: 1200,
        monthly_food: 400,
        monthly_transport: 150,
        monthly_entertainment: 200,
        monthly_subscriptions: 60,
        monthly_savings: 300,
        debt_total: 12000,
        debt_monthly_payment: 250,
        personality_code: finalResult.code,
        archetype_name: finalResult.archetype.name,
      };

      const res = await fetch('http://localhost:4000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate profile');
      }

      sessionStorage.setItem(
        'roots_profile',
        JSON.stringify({
          archetype: finalResult,
          bedrock: data,
        }),
      );

      router.push('/dashboard');
    } catch (err) {
      console.error('Analysis Error:', err);
      setError(err.message);
      setPhase('results');
    }
  }

  function goBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function restart() {
    setPhase('welcome');
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
  }

  if (phase === 'analyzing') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.brand}>Roots</p>
          <h1 className={styles.title}>Analyzing your profile...</h1>
          <p className={styles.subtitle}>
            Our AI is crunching the numbers to generate your personalized financial breakdown.
            This may take 10–30 seconds.
          </p>
        </header>
        <div className={styles.card} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (phase === 'welcome') {
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.brand}>Roots</p>
          <h1 className={styles.title}>Financial Personality Quiz</h1>
          <p className={styles.subtitle}>
            20 quick statements — agree or disagree. About 3 minutes.
          </p>
        </header>
        <div className={styles.card}>
          <p className={styles.subtitle} style={{ margin: 0 }}>
            Discover which of 16 spending archetypes fits you. No right or wrong answers — just
            be honest.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary} onClick={() => setPhase('quiz')}>
              Start quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && result) {
    const { archetype, axisResults, code } = result;
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.brand}>Your archetype</p>
        </header>
        <div className={styles.card}>
          <div className={styles.resultHero}>
            <span className={styles.resultCode}>{code}</span>
            <h1 className={styles.resultName}>{archetype.name}</h1>
            <p className={styles.resultVibe}>{archetype.vibe}</p>
            <div className={styles.traitPills}>
              {archetype.traits.map((t) => (
                <span key={t} className={styles.traitPill}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h2 className={styles.title} style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Your four axes
          </h2>
          <div className={styles.axisGrid}>
            {axisResults.map((axis) => (
              <div key={axis.key} className={styles.axisRow}>
                <p className={styles.axisLabel}>{axis.name}</p>
                <p className={styles.axisValue}>
                  {axis.letter} — {axis.label}
                </p>
                <p className={styles.axisScore}>
                  Score: {axis.score > 0 ? '+' : ''}
                  {axis.score}
                </p>
                <p className={styles.axisDesc}>{axis.description}</p>
              </div>
            ))}
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={restart}>
              Retake quiz
            </button>
            <Link href="/" className={styles.btnPrimary} style={{ textAlign: 'center', lineHeight: '2.4' }}>
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.brand}>Roots</p>
      </header>

      <div className={styles.progressWrap}>
        <div className={styles.progressMeta}>
          <span>
            {currentIndex + 1} of {DISPLAY_QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.card} key={question.id}>
        <p className={styles.questionText}>{question.text}</p>

        <div className={styles.likertLabels}>
          <span>Agree</span>
          <span>Disagree</span>
        </div>

        <div className={styles.likertRow} role="group" aria-label="Agreement scale">
          {LIKERT_LABELS.map((label, i) => (
            <button
              key={i}
              type="button"
              title={label}
              aria-label={label}
              className={`${styles.likertBubble} ${styles[`likertBubble${i}`]} ${
                selected === i ? styles.likertBubbleSelected : ''
              }`}
              onClick={() => selectLikert(i)}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={goBack}
            disabled={currentIndex === 0}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
