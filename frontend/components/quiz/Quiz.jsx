'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '../../lib/quiz/questions.js';
import { scoreQuiz } from '../../lib/quiz/score.js';
import styles from './Quiz.module.css';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const [phase, setPhase] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(QUESTIONS.length).fill(null));
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const question = QUESTIONS[currentIndex];
  const selected = answers[currentIndex];
  const progress = ((currentIndex + (phase === 'quiz' ? 1 : 0)) / QUESTIONS.length) * 100;

  function selectOption(index) {
    const next = [...answers];
    next[currentIndex] = index;
    setAnswers(next);
  }

  async function goNext() {
    if (selected == null) return;
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Quiz finished, score it
      const finalResult = scoreQuiz(answers);
      setResult(finalResult);
      setPhase('analyzing');
      setIsAnalyzing(true);
      setError(null);

      // Call Backend API with mock financial data + real archetype
      try {
        const payload = {
          // Mock Financial Data for Hackathon
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
          // Real Quiz Data
          personality_code: finalResult.code,
          archetype_name: finalResult.archetype.name
        };

        const res = await fetch('http://localhost:4000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate profile');
        }

        // Save result to session storage to pass to Dashboard
        sessionStorage.setItem('roots_profile', JSON.stringify({
          archetype: finalResult,
          bedrock: data
        }));

        // Redirect to dashboard
        router.push('/dashboard');
        
      } catch (err) {
        console.error("Analysis Error:", err);
        setError(err.message);
        setPhase('results'); // Fallback to basic results if API fails
      } finally {
        setIsAnalyzing(false);
      }
    }
  }

  function goBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function restart() {
    setPhase('welcome');
    setCurrentIndex(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
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
            This may take 10-30 seconds.
          </p>
        </header>
        <div className={styles.card} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
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
            20 questions across four axes — discover which of 16 spending archetypes fits you.
          </p>
        </header>
        <div className={styles.card}>
          <p className={styles.subtitle} style={{ margin: 0 }}>
            The Roots Personality Matrix maps how you think about time, execution, community, and risk.
          </p>
          <ul className={styles.welcomeList}>
            <li>Time Horizon — Visionary vs. Experiential</li>
            <li>Execution Style — Strategic vs. Trusting</li>
            <li>Budget Architecture — Focus-Inward vs. Community-Outward</li>
            <li>Asset Risk — Resilient vs. Adaptable</li>
          </ul>
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
        <h1 className={styles.title}>Question {question.id}</h1>
      </header>

      <div className={styles.progressWrap}>
        <div className={styles.progressMeta}>
          <span>
            {currentIndex + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.questionText}>{question.text}</p>
        <div className={styles.options}>
          {question.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.option} ${selected === i ? styles.optionSelected : ''}`}
              onClick={() => selectOption(i)}
            >
              <span className={styles.optionLetter}>{LETTERS[i]}</span>
              <span>{opt.label}</span>
            </button>
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
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={goNext}
            disabled={selected == null}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'See results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}


