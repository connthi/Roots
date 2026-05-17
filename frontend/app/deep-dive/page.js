'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute.jsx';
import DeepDiveQuiz from '../../components/deep-dive/DeepDiveQuiz.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getArchetypeProfile, hasPersonalityQuiz, loadProfile } from '../../lib/profileSession.js';
import styles from '../../components/auth/auth.module.css';

function DeepDiveContent() {
  const [ready, setReady] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [archetypeProfile, setArchetypeProfile] = useState(null);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    const data = loadProfile();
    if (!hasPersonalityQuiz()) {
      window.location.href = '/survey';
      return;
    }
    const profile = getArchetypeProfile(data);
    setQuizResult(data.archetype);
    setArchetypeProfile(profile);
    setReady(true);
  }, [authLoading]);

  if (!ready || !quizResult || !archetypeProfile) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return <DeepDiveQuiz archetypeProfile={archetypeProfile} quizResult={quizResult} />;
}

export default function DeepDivePage() {
  return (
    <ProtectedRoute>
      <DeepDiveContent />
    </ProtectedRoute>
  );
}
