'use client';

import ProtectedRoute from '../../components/auth/ProtectedRoute.jsx';
import Quiz from '../../components/quiz/Quiz.jsx';

export default function SurveyPage() {
  return (
    <ProtectedRoute>
      <Quiz />
    </ProtectedRoute>
  );
}
