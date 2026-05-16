import { ARCHETYPES, AXES } from './archetypes.js';
import { QUESTIONS } from './questions.js';

const AXIS_KEYS = ['axis1', 'axis2', 'axis3', 'axis4'];

/**
 * @param {number[]} answers - selected option index per question (0–3)
 */
export function scoreQuiz(answers) {
  const totals = { axis1: 0, axis2: 0, axis3: 0, axis4: 0 };

  answers.forEach((optionIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex];
    const option = question?.options[optionIndex];
    if (!option?.deltas) return;

    for (const key of AXIS_KEYS) {
      if (option.deltas[key] != null) {
        totals[key] += option.deltas[key];
      }
    }
  });

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
