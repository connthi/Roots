'use client';

import { useState } from 'react';
import Link from 'next/link';
import DeepDiveTransition from '../deep-dive/DeepDiveTransition.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { clearProfile, loadProfile, saveProfile } from '../../lib/profileSession.js';
import { syncProgressToServer } from '../../lib/syncProgress.js';
import { DISPLAY_QUESTIONS, LIKERT_LABELS } from '../../lib/quiz/questions.js';
import { scoreQuiz } from '../../lib/quiz/score.js';
import styles from './Quiz.module.css';

export default function Quiz() {
  const { updateOnboardingStep } = useAuth();
  const [phase, setPhase] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

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

    await syncProgressToServer('deep_dive', {
      archetype: finalResult,
      personalityComplete: true,
      personalityAnswers: finalAnswers,
    });
    updateOnboardingStep('deep_dive');
    setPhase('reveal');
  }

  function goBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  async function restart() {
    clearProfile();
    await syncProgressToServer('none', {});
    updateOnboardingStep('none');
    setPhase('welcome');
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
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
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={async () => {
                await syncProgressToServer('personality', loadProfile() ?? {});
                updateOnboardingStep('personality');
                setPhase('quiz');
              }}
            >
              Start quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'reveal' && result) {
    const { archetype, axisResults, code } = result;
    return (
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.brand}>Your archetype</p>
          <h1 className={styles.title} style={{ fontSize: '1.35rem' }}>
            Step 1 complete — unlock your numbers next
          </h1>
        </header>
        <div className={styles.card}>
          <div className={styles.resultHero}>
            <span className={styles.resultCode}>{code}</span>
            <h2 className={styles.resultName}>{archetype.name}</h2>
            <p className={styles.resultVibe}>{archetype.vibe}</p>
            <div className={styles.traitPills}>
              {archetype.traits.map((t) => (
                <span key={t} className={styles.traitPill}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <DeepDiveTransition archetype={{ ...archetype, code }} className={styles.deepDiveHook} />

          <details className={styles.axisDetails}>
            <summary className={styles.axisSummary}>View your four axes</summary>
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
          </details>

          <div className={styles.actions}>
            <Link
              href="/deep-dive"
              className={styles.btnPrimary}
              style={{ textAlign: 'center', lineHeight: '2.4', flex: 2 }}
            >
              Continue to Deep Dive →
            </Link>
            <button type="button" className={styles.btnSecondary} onClick={restart}>
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

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
