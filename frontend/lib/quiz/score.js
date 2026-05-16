import { ARCHETYPES, AXES } from './archetypes.js';
import { QUESTIONS, likertDelta } from './questions.js';

const AXIS_KEYS = ['axis1', 'axis2', 'axis3', 'axis4'];

/**
 * @param {Record<number, number>} answersByQuestionId - question id → likert index (0–5)
 */
export function scoreQuiz(answersByQuestionId) {
  const totals = { axis1: 0, axis2: 0, axis3: 0, axis4: 0 };

  for (const question of QUESTIONS) {
    const likertIndex = answersByQuestionId[question.id];
    if (likertIndex == null) continue;
    totals[question.axis] += likertDelta(question.polarity, likertIndex);
  }

  const letters = {
    axis1: totals.axis1 >= 0 ? 'V' : 'E',
    axis2: totals.axis2 >= 0 ? 'S' : 'T',
    axis3: totals.axis3 >= 0 ? 'F' : 'C',
    axis4: totals.axis4 >= 0 ? 'A' : 'R',
  };

  const code = `${letters.axis1}${letters.axis2}${letters.axis3}${letters.axis4}`;
  const archetype = ARCHETYPES[code] ?? {
    code,
    name: 'Unknown Archetype',
    vibe: 'Your profile is unique — we could not map it to a standard archetype.',
    traits: Object.values(letters),
  };

  const axisResults = AXIS_KEYS.map((key) => {
    const axis = AXES[key];
    const score = totals[key];
    const side = score >= 0 ? axis.positive : axis.negative;
    return {
      key,
      name: axis.name,
      score,
      letter: side.letter,
      label: side.label,
      description: side.description,
    };
  });

  return { totals, letters, code, archetype, axisResults };
}
