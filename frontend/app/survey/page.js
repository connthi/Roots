'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Quiz from '../../components/quiz/Quiz.jsx';
import { hasDeepDive, hasPersonalityQuiz, loadProfile } from '../../lib/profileSession.js';

export default function SurveyPage() {
  const router = useRouter();

  useEffect(() => {
    const data = loadProfile();
    if (hasDeepDive()) {
      router.replace('/dashboard');
    } else if (hasPersonalityQuiz()) {
      router.replace('/deep-dive');
    }
  }, [router]);

  return <Quiz />;
}
