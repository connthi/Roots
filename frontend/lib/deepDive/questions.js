/**
 * Deep-dive financial quiz — 10 questions, 5 categories.
 * Each `key` maps 1:1 to a backend variable.
 */

/** @typedef {'currency' | 'currency_slider' | 'credit_debt' | 'runway' | 'bracket'} QuestionType */

/**
 * @typedef {Object} DeepDiveQuestion
 * @property {number} id
 * @property {string} categoryId
 * @property {string} categoryLabel
 * @property {string} text
 * @property {string} hint
 * @property {string} key
 * @property {QuestionType} type
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [step]
 * @property {string} [suffix]
 * @property {{ label: string, value: string }[]} [options]
 */

/** @type {{ id: string, label: string }[]} */
export const DEEP_DIVE_CATEGORIES = [
  { id: 'A', label: 'Income & Liquid Velocity' },
  { id: 'B', label: 'Fixed Overhead vs. Discretionary Burn' },
  { id: 'C', label: 'Debt Structure & Compound Drag' },
  { id: 'D', label: 'Asset Allocation Growth' },
  { id: 'E', label: 'Financial Runway & Shock Resistance' },
];

/** @type {DeepDiveQuestion[]} */
export const DEEP_DIVE_QUESTIONS = [
  {
    id: 1,
    categoryId: 'A',
    categoryLabel: 'Income & Liquid Velocity',
    text: 'What is your estimated total monthly net income (take-home pay after taxes)?',
    hint: 'Paychecks + side gigs — after tax, what actually hits your account.',
    key: 'monthly_income',
    type: 'currency',
    min: 0,
    max: 50000,
    step: 50,
  },
  {
    id: 2,
    categoryId: 'A',
    categoryLabel: 'Income & Liquid Velocity',
    text: 'Roughly how much cash do you keep easily accessible in checking and savings combined?',
    hint: 'Money you could tap this week without selling investments.',
    key: 'liquid_cash',
    type: 'currency',
    min: 0,
    max: 500000,
    step: 100,
  },
  {
    id: 3,
    categoryId: 'B',
    categoryLabel: 'Fixed Overhead vs. Discretionary Burn',
    text: 'How much do you spend monthly on essential fixed costs?',
    hint: 'Rent/dorm, utilities, groceries, insurance, mandatory subscriptions.',
    key: 'fixed_expenses',
    type: 'currency_slider',
    min: 0,
    max: 8000,
    step: 50,
  },
  {
    id: 4,
    categoryId: 'B',
    categoryLabel: 'Fixed Overhead vs. Discretionary Burn',
    text: 'On an average week, how much do you spend on discretionary “vibe” items?',
    hint: 'Eating out, boba, drinks, shopping, concerts, spontaneous plans.',
    key: 'discretionary_weekly',
    type: 'currency_slider',
    min: 0,
    max: 1500,
    step: 10,
    suffix: '/week',
  },
  {
    id: 5,
    categoryId: 'C',
    categoryLabel: 'Debt Structure & Compound Drag',
    text: 'Do you carry a credit card balance month-to-month? If so, what’s the total?',
    hint: 'Revolving balance only — not cards you pay off in full.',
    key: 'credit_card_debt',
    type: 'credit_debt',
    min: 0,
    max: 100000,
    step: 100,
  },
  {
    id: 6,
    categoryId: 'C',
    categoryLabel: 'Debt Structure & Compound Drag',
    text: 'What is your total outstanding balance on long-term loans?',
    hint: 'Student loans, car financing, personal loans.',
    key: 'long_term_debt',
    type: 'currency',
    min: 0,
    max: 500000,
    step: 500,
  },
  {
    id: 7,
    categoryId: 'D',
    categoryLabel: 'Asset Allocation Growth',
    text: 'How much do you have in long-term investments?',
    hint: 'Stocks, index funds, retirement accounts, crypto — total current value.',
    key: 'total_invested',
    type: 'currency',
    min: 0,
    max: 2000000,
    step: 500,
  },
  {
    id: 8,
    categoryId: 'D',
    categoryLabel: 'Asset Allocation Growth',
    text: 'On average, how much do you transfer into savings or investments each month?',
    hint: 'Automatic transfers + manual deposits — your intentional rate.',
    key: 'monthly_savings_rate',
    type: 'currency_slider',
    min: 0,
    max: 10000,
    step: 25,
  },
  {
    id: 9,
    categoryId: 'E',
    categoryLabel: 'Financial Runway & Shock Resistance',
    text: 'If your income stopped today, how many months could you survive on cash savings alone?',
    hint: 'No new borrowing — just checking, savings, and liquid cash.',
    key: 'runway_months',
    type: 'runway',
    min: 0,
    max: 12,
    step: 1,
  },
  {
    id: 10,
    categoryId: 'E',
    categoryLabel: 'Financial Runway & Shock Resistance',
    text: 'What’s the largest emergency expense you could pay tomorrow in full — without putting it on a card?',
    hint: 'Car breakdown, medical bill, sudden travel — honest ceiling.',
    key: 'emergency_threshold',
    type: 'bracket',
    options: [
      { label: 'Under $500', value: 'under_500' },
      { label: '$500 – $1k', value: '500_1000' },
      { label: '$1k – $5k', value: '1000_5000' },
      { label: '$5k+', value: '5000_plus' },
    ],
  },
];
