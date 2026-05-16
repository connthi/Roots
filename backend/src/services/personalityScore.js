/**
 * Backend scoring mirror for the 20-question personality quiz.
 * Accepts { answers: { [questionId]: likertIndex } } where likertIndex is 0–5.
 */

const AXIS_KEYS = ['axis1', 'axis2', 'axis3', 'axis4'];

const LETTER_MAP = {
  axis1: { pos: 'V', neg: 'E' },
  axis2: { pos: 'S', neg: 'T' },
  axis3: { pos: 'F', neg: 'C' },
  axis4: { pos: 'A', neg: 'R' },
};

const LIKERT_DELTAS = [3, 2, 1, -1, -2, -3];

/** questionId → { axis, polarity } */
export const QUIZ_QUESTIONS = {
  1: { axis: 'axis1', polarity: 1 },
  2: { axis: 'axis1', polarity: 1 },
  3: { axis: 'axis1', polarity: 1 },
  4: { axis: 'axis1', polarity: -1 },
  5: { axis: 'axis1', polarity: -1 },
  6: { axis: 'axis2', polarity: 1 },
  7: { axis: 'axis2', polarity: 1 },
  8: { axis: 'axis2', polarity: 1 },
  9: { axis: 'axis2', polarity: -1 },
  10: { axis: 'axis2', polarity: -1 },
  11: { axis: 'axis3', polarity: 1 },
  12: { axis: 'axis3', polarity: 1 },
  13: { axis: 'axis3', polarity: 1 },
  14: { axis: 'axis3', polarity: -1 },
  15: { axis: 'axis3', polarity: -1 },
  16: { axis: 'axis4', polarity: 1 },
  17: { axis: 'axis4', polarity: -1 },
  18: { axis: 'axis4', polarity: -1 },
  19: { axis: 'axis4', polarity: 1 },
  20: { axis: 'axis4', polarity: -1 },
};

function likertDelta(polarity, likertIndex) {
  return polarity * LIKERT_DELTAS[likertIndex];
}

/**
 * @param {Record<string, number> | number[]} answers
 *   Object keyed by question id (1–20) → likert 0–5, OR legacy flat array in display order.
 */
export function scorePersonality(answers) {
  const totals = { axis1: 0, axis2: 0, axis3: 0, axis4: 0 };

  if (Array.isArray(answers)) {
    const displayOrder = [
      15, 8, 2, 19, 11, 6, 20, 4, 17, 1, 13, 9, 16, 3, 12, 7, 14, 5, 18, 10,
    ];
    if (answers.length !== 20) {
      throw new Error('answers must be an array of 20 likert indices (0–5) in display order');
    }
    answers.forEach((likertIndex, i) => {
      const questionId = displayOrder[i];
      const meta = QUIZ_QUESTIONS[questionId];
      if (likertIndex < 0 || likertIndex > 5 || !meta) {
        throw new Error(`Invalid answer at display position ${i + 1}`);
      }
      totals[meta.axis] += likertDelta(meta.polarity, likertIndex);
    });
  } else if (answers && typeof answers === 'object') {
    for (let id = 1; id <= 20; id++) {
      const likertIndex = answers[id] ?? answers[String(id)];
      if (likertIndex == null) {
        throw new Error(`Missing answer for question ${id}`);
      }
      const meta = QUIZ_QUESTIONS[id];
      if (likertIndex < 0 || likertIndex > 5 || !meta) {
        throw new Error(`Invalid answer for question ${id}`);
      }
      totals[meta.axis] += likertDelta(meta.polarity, likertIndex);
    }
  } else {
    throw new Error('answers must be an object keyed by question id or a 20-element array');
  }

  const letters = {};
  for (const key of AXIS_KEYS) {
    const map = LETTER_MAP[key];
    letters[key] = totals[key] >= 0 ? map.pos : map.neg;
  }

  const code = AXIS_KEYS.map((k) => letters[k]).join('');

  return { totals, letters, code };
}
