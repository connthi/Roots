export const AXES = {
  axis1: {
    key: 'axis1',
    name: 'Time Horizon',
    positive: { letter: 'V', label: 'Visionary', description: 'Long-term builder — retirement, generational wealth, compound growth' },
    negative: { letter: 'E', label: 'Experiential', description: 'Present-moment optimizer — cash flow, agility, utility today' },
  },
  axis2: {
    key: 'axis2',
    name: 'Execution Style',
    positive: { letter: 'S', label: 'Strategic', description: 'Detail maximizer — analytical, research-driven, deliberate' },
    negative: { letter: 'T', label: 'Trusting', description: 'Low-friction automator — convenience, simplicity, automation' },
  },
  axis3: {
    key: 'axis3',
    name: 'Budget Architecture',
    positive: { letter: 'F', label: 'Focus-Inward', description: 'Self-reliance — personal safety net and individual growth first' },
    negative: { letter: 'C', label: 'Community-Outward', description: 'Shared wealth — gifting, experiences, generosity' },
  },
  axis4: {
    key: 'axis4',
    name: 'Asset Risk',
    positive: { letter: 'A', label: 'Adaptable', description: 'Dynamic explorer — calculated risk, innovation, upside' },
    negative: { letter: 'R', label: 'Resilient', description: 'Steady compounder — predictable, low-volatility growth' },
  },
};

/** @type {Record<string, { code: string, name: string, vibe: string, traits: string[] }>} */
export const ARCHETYPES = {
  VSFR: {
    code: 'VSFR',
    name: 'The Architect',
    vibe: 'Calculates every step. Builds bulletproof personal wealth through optimized, steady, historic indexing.',
    traits: ['Visionary', 'Strategic', 'Focus-Inward', 'Resilient'],
  },
  VSFA: {
    code: 'VSFA',
    name: 'The Quant',
    vibe: 'Analytical but cutting-edge. Optimizes private accounts using data-driven, high-growth, or innovative market assets.',
    traits: ['Visionary', 'Strategic', 'Focus-Inward', 'Adaptable'],
  },
  VSCR: {
    code: 'VSCR',
    name: 'The Syndicate',
    vibe: 'The reliable family planner. Uses calculated, low-volatility strategies to build long-term safety nets and legacies for loved ones.',
    traits: ['Visionary', 'Strategic', 'Community-Outward', 'Resilient'],
  },
  VSCA: {
    code: 'VSCA',
    name: 'The Venture Capitalist',
    vibe: 'Spotting the future early. Uses analytical precision to pool resources into high-upside, emerging opportunities with an inner circle.',
    traits: ['Visionary', 'Strategic', 'Community-Outward', 'Adaptable'],
  },
  VTFR: {
    code: 'VTFR',
    name: 'The Fortress',
    vibe: 'Set-it-and-forget-it security. Relies entirely on automated index fund contributions to build an unshakeable individual future.',
    traits: ['Visionary', 'Trusting', 'Focus-Inward', 'Resilient'],
  },
  VTFA: {
    code: 'VTFA',
    name: 'The Oracle',
    vibe: 'Intuitive futurist. Automatically routes private capital into broad innovation sectors, trusting the long-term upward trajectory of tech.',
    traits: ['Visionary', 'Trusting', 'Focus-Inward', 'Adaptable'],
  },
  VTCR: {
    code: 'VTCR',
    name: 'The Guardian',
    vibe: 'Pure peace of mind for the group. Automates reliable, low-stress savings accounts dedicated entirely to protecting and providing for family.',
    traits: ['Visionary', 'Trusting', 'Community-Outward', 'Resilient'],
  },
  VTCA: {
    code: 'VTCA',
    name: 'The Catalyst',
    vibe: 'Group momentum builder. Seamlessly automates growth-focused investments that unlock future collective freedom and big dynamic moves.',
    traits: ['Visionary', 'Trusting', 'Community-Outward', 'Adaptable'],
  },
  ESFR: {
    code: 'ESFR',
    name: 'The Machinist',
    vibe: 'Hyper-optimizing daily life. Meticulously tracks cash flow to ensure high individual liquid safety while fully capitalizing on the present.',
    traits: ['Experiential', 'Strategic', 'Focus-Inward', 'Resilient'],
  },
  ESFA: {
    code: 'ESFA',
    name: 'The Day Trader',
    vibe: 'Highly agile operator. Deeply researches current market swings to capture immediate, high-upside personal liquidity.',
    traits: ['Experiential', 'Strategic', 'Focus-Inward', 'Adaptable'],
  },
  ESCR: {
    code: 'ESCR',
    name: 'The Connoisseur',
    vibe: 'Calculated hospitality. Strategically structures budgets to fund incredible present-day group experiences and dinners without sacrificing rock-solid safety.',
    traits: ['Experiential', 'Strategic', 'Community-Outward', 'Resilient'],
  },
  ESCA: {
    code: 'ESCA',
    name: 'The Maverick',
    vibe: 'Lives for the current wave. Researches and strikes hot, high-growth opportunities to fuel a dynamic, shared lifestyle right now.',
    traits: ['Experiential', 'Strategic', 'Community-Outward', 'Adaptable'],
  },
  ETFR: {
    code: 'ETFR',
    name: 'The Minimalist',
    vibe: 'Effortless personal freedom. Automates a simple, steady baseline safety net so they can completely ignore financial stress and live peacefully in the now.',
    traits: ['Experiential', 'Trusting', 'Focus-Inward', 'Resilient'],
  },
  ETFA: {
    code: 'ETFA',
    name: 'The Nomad',
    vibe: 'Ultimate lifestyle agility. Uses friction-free automated tools to pool dynamic capital, ready to pivot or take a bold leap at a moment\'s notice.',
    traits: ['Experiential', 'Trusting', 'Focus-Inward', 'Adaptable'],
  },
  ETCR: {
    code: 'ETCR',
    name: 'The Host',
    vibe: 'The heartbeat of the circle. Automates a reliable social budget so they can generously treat friends and create memories 100% guilt-free.',
    traits: ['Experiential', 'Trusting', 'Community-Outward', 'Resilient'],
  },
  ETCA: {
    code: 'ETCA',
    name: 'The Trailblazer',
    vibe: 'Absolute spontaneous energy. Relies on simple automation to keep a liquid baseline, allowing them to dive headfirst into the latest experiences with their crew.',
    traits: ['Experiential', 'Trusting', 'Community-Outward', 'Adaptable'],
  },
};
