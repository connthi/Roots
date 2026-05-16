/**
 * Personalized copy for the personality → deep-dive financial quiz transition.
 * Primary hook: axis1 (V = Visionary, E = Experiential).
 * Secondary flourishes: axis2 (S/T), axis3 (F/C), axis4 (A/R).
 */

/** @typedef {{ code: string, name: string, vibe: string, traits?: string[] }} Archetype */

const TIME_HOOKS = {
  V: {
    eyebrow: 'Your blueprint is locked in',
    headline: (name) => `${name}, your long-game instincts are showing.`,
    subhead:
      'You think in decades — we think in dollars. Plug in your real income, burn rate, and debt so we can render your actual 10-year compounding curves and Projected Earnings Report (PER).',
    bullets: [
      'See how today’s habits compound (or quietly tax) your net worth through age 65',
      'Get a Personalized Finance Analysis (PFA) tuned to your Visionary time horizon',
      'Stress-test “what if I invested more” vs. your current path — in real charts, not vibes',
    ],
    ctaPrimary: 'Unlock My 10-Year Curves',
    ctaSecondary: 'I’ll vibe-check numbers later',
    chartLabel: 'Projected path · 10 years',
  },
  E: {
    eyebrow: 'Your vibe profile is locked in',
    headline: (name) => `${name}, let’s protect the lifestyle you actually live.`,
    subhead:
      'You optimize for cash flow and the now — fair. Ten quick number inputs let us map your monthly freedom, guilt-free spend, and where small leaks are eating your daily energy.',
    bullets: [
      'Dial in discretionary burn without killing the experiences you care about',
      'Get a PFA that respects your present-moment priorities — not a lecture',
      'See your PER: what your current rhythm costs you by next year (and how to fix it)',
    ],
    ctaPrimary: 'Map My Monthly Freedom',
    ctaSecondary: 'Skip for now',
    chartLabel: 'Cash flow · optimized vs. now',
  },
};

const EXEC_FLOURISH = {
  S: 'We’ll match your Strategic brain — itemized sliders, zero fluff.',
  T: 'No spreadsheet homework — ~2 minutes, mostly taps.',
};

const BUDGET_FLOURISH = {
  F: 'Built for your Focus-Inward boundaries — your numbers stay yours.',
  C: 'We’ll factor in your Community-Outward generosity without shaming the group tab.',
};

const RISK_FLOURISH = {
  A: 'Risk appetite noted — projections can reflect a growth-weighted path.',
  R: 'Steady-compounder mode — we’ll anchor charts to resilient, lower-volatility assumptions.',
};

const ARCHETYPE_CALLOUTS = {
  VSFR: 'Architects like you need real structural data before the fortress gets built.',
  VSFA: 'Quants don’t guess — feed the model your actual cash engine.',
  VSCR: 'Syndicate planners protect legacies with numbers, not hope.',
  VSCA: 'Venture minds move fast — your PER shows which bets your baseline can fund.',
  VTFR: 'Fortress builders automate best when the pipes have real flow rates.',
  VTFA: 'Oracles trust the future — give us the present income to forecast it.',
  VTCR: 'Guardians provide for the circle — let’s quantify the safety net.',
  VTCA: 'Catalysts scale momentum — map the capital that unlocks the next collective move.',
  ESFR: 'Machinists run tight ships — your sliders should reflect every dollar in motion.',
  ESFA: 'Day Traders need liquidity truth — discretionary burn is your real runway.',
  ESCR: 'Connoisseurs fund incredible nights out — let’s make sure the math still slaps.',
  ESCA: 'Mavericks ride the wave — see what today’s spend steals from tomorrow’s leap.',
  ETFR: 'Minimalists want peace, not paperwork — ten inputs, then back to living.',
  ETFA: 'Nomads pivot fast — cash-flow clarity is your superpower.',
  ETCR: 'Hosts keep the circle fed — we’ll budget generosity without the guilt spiral.',
  ETCA: 'Trailblazers move spontaneous — know your floor before the next adventure.',
};

/**
 * @param {Archetype} archetype
 */
export function getDeepDiveTransition(archetype) {
  const code = archetype.code ?? '';
  const name = archetype.name ?? 'Your archetype';
  const timeLetter = code[0] === 'E' ? 'E' : 'V';
  const execLetter = code[1] === 'T' ? 'T' : 'S';
  const budgetLetter = code[2] === 'C' ? 'C' : 'F';
  const riskLetter = code[3] === 'A' ? 'A' : 'R';

  const time = TIME_HOOKS[timeLetter];

  return {
    code,
    timeLetter,
    eyebrow: time.eyebrow,
    headline: time.headline(name.replace(/^The\s+/i, 'The ')),
    subhead: time.subhead,
    bullets: time.bullets,
    callout: ARCHETYPE_CALLOUTS[code] ?? null,
    flourishes: [
      EXEC_FLOURISH[execLetter],
      BUDGET_FLOURISH[budgetLetter],
      RISK_FLOURISH[riskLetter],
    ].filter(Boolean),
    ctaPrimary: time.ctaPrimary,
    ctaSecondary: time.ctaSecondary,
    chartLabel: time.chartLabel,
    trustLine: 'Private by design · No bank linking · ~2 min · 10 inputs',
    stepLabel: 'Step 2 of 2 — Real numbers',
  };
}
