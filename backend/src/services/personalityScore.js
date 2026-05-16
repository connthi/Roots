/**
 * Backend scoring mirror for the 20-question personality quiz.
 * Accepts an array of option indices (0–3) per question, in order.
 */

const AXIS_KEYS = ['axis1', 'axis2', 'axis3', 'axis4'];

const LETTER_MAP = {
  axis1: { pos: 'V', neg: 'E' },
  axis2: { pos: 'S', neg: 'T' },
  axis3: { pos: 'F', neg: 'C' },
  axis4: { pos: 'A', neg: 'R' },
};

/** Minimal deltas keyed by question id (1–20) and option index (0–3). */
export const QUIZ_DELTAS = {
  1: [{ axis1: 2 }, { axis1: 1 }, { axis1: -1 }, { axis1: -2 }],
  2: [{ axis4: -2 }, { axis4: -1 }, { axis4: 1 }, { axis4: 2 }],
  3: [{ axis2: 2 }, { axis2: 1 }, { axis2: -1 }, { axis2: -2 }],
  4: [{ axis3: 2 }, { axis3: 1 }, { axis3: -1 }, { axis3: -2 }],
  5: [{ axis1: 2 }, { axis1: 1 }, { axis1: -1 }, { axis1: -2 }],
  6: [{ axis4: -2 }, { axis4: -1 }, { axis4: 1 }, { axis4: 2 }],
  7: [{ axis2: 2 }, { axis2: 1 }, { axis2: -1 }, { axis2: -2 }],
  8: [{ axis3: 2 }, { axis3: 1 }, { axis3: -1 }, { axis3: -2 }],
  9: [{ axis1: 2 }, { axis1: 1 }, { axis1: -1 }, { axis1: -2 }],
  10: [{ axis4: -2 }, { axis4: -1 }, { axis4: 1 }, { axis4: 2 }],
  11: [{ axis2: 2 }, { axis2: 1 }, { axis2: -1 }, { axis2: -2 }],
  12: [{ axis3: 2 }, { axis3: 1 }, { axis3: -1 }, { axis3: -2 }],
  13: [{ axis1: 2 }, { axis1: 1 }, { axis1: -1 }, { axis1: -2 }],
  14: [{ axis4: -2 }, { axis4: -1 }, { axis4: 1 }, { axis4: 2 }],
  15: [{ axis2: 2 }, { axis2: 1 }, { axis2: -1 }, { axis2: -2 }],
  16: [{ axis3: 2 }, { axis3: 1 }, { axis3: -1 }, { axis3: -2 }],
  17: [{ axis1: 2 }, { axis1: 1 }, { axis1: -1 }, { axis1: -2 }],
  18: [{ axis4: -2 }, { axis4: -1 }, { axis4: 1 }, { axis4: 2 }],
  19: [{ axis2: 2 }, { axis2: 1 }, { axis2: -1 }, { axis2: -2 }],
  20: [{ axis3: 2 }, { axis3: 1 }, { axis3: -1 }, { axis3: -2 }],
};

export function scorePersonality(answers) {
  if (!Array.isArray(answers) || answers.length !== 20) {
    throw new Error('answers must be an array of 20 option indices (0–3)');
  }

  const totals = { axis1: 0, axis2: 0, axis3: 0, axis4: 0 };

  answers.forEach((optionIndex, i) => {
    const deltas = QUIZ_DELTAS[i + 1]?.[optionIndex];
    if (!deltas) throw new Error(`Invalid answer at question ${i + 1}`);
    for (const key of AXIS_KEYS) {
      if (deltas[key] != null) totals[key] += deltas[key];
    }
  });

  const letters = {};
  for (const key of AXIS_KEYS) {
    const map = LETTER_MAP[key];
    letters[key] = totals[key] >= 0 ? map.pos : map.neg;
  }

  const code = AXIS_KEYS.map((k) => letters[k]).join('');

  return { totals, letters, code };
}
