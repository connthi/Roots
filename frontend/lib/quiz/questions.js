/**
 * ROOTS 20-question financial personality model (16Personalities-style).
 *
 * axis1: Time Horizon (V+ / E-)
 * axis2: Execution Style (S+ / T-)
 * axis3: Budget Architecture (F+ / C-)
 * axis4: Asset Risk (A+ / R-)
 *
 * Likert indices 0–5 (no neutral): Strongly Agree → Strongly Disagree
 * Base deltas: [+3, +2, +1, -1, -2, -3]. Reverse items multiply by -1.
 */

/** @typedef {'axis1' | 'axis2' | 'axis3' | 'axis4'} AxisKey */

/** @type {readonly number[]} */
export const LIKERT_DELTAS = [3, 2, 1, -1, -2, -3];

export const LIKERT_LABELS = [
  'Strongly agree',
  'Agree',
  'Slightly agree',
  'Slightly disagree',
  'Disagree',
  'Strongly disagree',
];

/**
 * @param {1 | -1} polarity
 * @param {number} likertIndex 0–5
 */
export function likertDelta(polarity, likertIndex) {
  return polarity * LIKERT_DELTAS[likertIndex];
}

/**
 * @typedef {{ id: number, text: string, axis: AxisKey, polarity: 1 | -1 }} Question
 */

/** @type {Question[]} */
export const QUESTIONS = [
  {
    id: 1,
    text: 'I frequently think about long-term financial milestones like early retirement or generational wealth.',
    axis: 'axis1',
    polarity: 1,
  },
  {
    id: 2,
    text: 'I would gladly lock my money away for 5 years if it guaranteed high compound growth.',
    axis: 'axis1',
    polarity: 1,
  },
  {
    id: 3,
    text: 'When I get unexpected cash, my first instinct is to invest it rather than spend it on something today.',
    axis: 'axis1',
    polarity: 1,
  },
  {
    id: 4,
    text: 'I prioritize maximizing my current lifestyle and monthly cash flow over saving for decades down the line.',
    axis: 'axis1',
    polarity: -1,
  },
  {
    id: 5,
    text: 'When making a major purchase, I care much more about its immediate daily utility than its 10-year resale value.',
    axis: 'axis1',
    polarity: -1,
  },
  {
    id: 6,
    text: 'I enjoy tracking my daily expenses using spreadsheets or budgeting apps.',
    axis: 'axis2',
    polarity: 1,
  },
  {
    id: 7,
    text: 'I always read the fine print and compare APY rates thoroughly before opening a bank account.',
    axis: 'axis2',
    polarity: 1,
  },
  {
    id: 8,
    text: 'I regularly audit my bank statements to manually log recurring subscriptions.',
    axis: 'axis2',
    polarity: 1,
  },
  {
    id: 9,
    text: 'I prefer to automate all my savings and direct deposits so I never have to look at them.',
    axis: 'axis2',
    polarity: -1,
  },
  {
    id: 10,
    text: 'I find hyper-analyzing budgets to be more stressful than helpful.',
    axis: 'axis2',
    polarity: -1,
  },
  {
    id: 11,
    text: 'My personal financial boundaries always come first, even if it means missing a major event with friends.',
    axis: 'axis3',
    polarity: 1,
  },
  {
    id: 12,
    text: 'True financial security means being completely self-reliant and independent of others.',
    axis: 'axis3',
    polarity: 1,
  },
  {
    id: 13,
    text: 'I am highly meticulous about calculating the exact total for what I personally ordered when splitting a group dinner bill.',
    axis: 'axis3',
    polarity: 1,
  },
  {
    id: 14,
    text: 'I frequently spend extra money to treat my friends or cover the tab at group gatherings.',
    axis: 'axis3',
    polarity: -1,
  },
  {
    id: 15,
    text: 'I would happily push back a monthly savings goal to buy a high-end gift for someone I care about.',
    axis: 'axis3',
    polarity: -1,
  },
  {
    id: 16,
    text: 'I am completely comfortable investing in highly volatile assets that swing wildly week to week.',
    axis: 'axis4',
    polarity: 1,
  },
  {
    id: 17,
    text: 'Seeing my investment portfolio dip 15% in a single week would make me feel deeply anxious.',
    axis: 'axis4',
    polarity: -1,
  },
  {
    id: 18,
    text: 'I prefer sticking to proven, historically steady index funds over chasing trendy or emerging asset classes.',
    axis: 'axis4',
    polarity: -1,
  },
  {
    id: 19,
    text: 'I view market downturns as a great opportunity to buy high-upside assets at a discount.',
    axis: 'axis4',
    polarity: 1,
  },
  {
    id: 20,
    text: 'I value absolute peace of mind and guaranteed protection of my principal balance over high-risk returns.',
    axis: 'axis4',
    polarity: -1,
  },
];

/** Fixed shuffle so axes are interleaved (pattern-resistant). */
export const QUESTION_DISPLAY_ORDER = [
  15, 8, 2, 19, 11, 6, 20, 4, 17, 1, 13, 9, 16, 3, 12, 7, 14, 5, 18, 10,
];

const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

/** Questions in presentation order. */
export const DISPLAY_QUESTIONS = QUESTION_DISPLAY_ORDER.map((id) => byId[id]);
