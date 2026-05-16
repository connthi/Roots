'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DeepDiveQuiz from '../../components/deep-dive/DeepDiveQuiz.jsx';
import {
  getArchetypeProfile,
  hasPersonalityQuiz,
  loadProfile,
} from '../../lib/profileSession.js';

export default function DeepDivePage() {
  const [ready, setReady] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [archetypeProfile, setArchetypeProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = loadProfile();
    if (!hasPersonalityQuiz()) {
      router.replace('/survey');
      return;
    }
    const profile = getArchetypeProfile(data);
    setQuizResult(data.archetype);
    setArchetypeProfile(profile);
    setReady(true);
  }, [router]);

  if (!ready || !quizResult || !archetypeProfile) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#a8b5a0' }}>
        Loading…
      </main>
    );
  }

  return <DeepDiveQuiz archetypeProfile={archetypeProfile} quizResult={quizResult} />;
}
