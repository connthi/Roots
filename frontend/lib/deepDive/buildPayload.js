/**
 * Maps deep-dive answers + personality result into the /api/analyze payload.
 */

/**
 * @param {object} archetypeResult - personality quiz score result
 * @param {Record<string, string | number>} answers
 */
export function buildAnalyzePayload(archetypeResult, answers) {
  const monthlyIncome = num(answers.monthly_income);
  const liquidCash = num(answers.liquid_cash);
  const fixedExpenses = num(answers.fixed_expenses);
  const discretionaryWeekly = num(answers.discretionary_weekly);
  const discretionaryMonthly = Math.round(discretionaryWeekly * 4.33);
  const creditDebt = num(answers.credit_card_debt);
  const longTermDebt = num(answers.long_term_debt);
  const totalInvested = num(answers.total_invested);
  const monthlySavings = num(answers.monthly_savings_rate);
  const runwayMonths = num(answers.runway_months);

  const meta = archetypeResult.archetype ?? archetypeResult;

  return {
    personality_code: archetypeResult.code,
    archetype_name: meta.name,
    age: 22,

    monthly_income: monthlyIncome,
    liquid_cash: liquidCash,
    fixed_expenses: fixedExpenses,
    discretionary_weekly: discretionaryWeekly,
    credit_card_debt: creditDebt,
    long_term_debt: longTermDebt,
    total_invested: totalInvested,
    monthly_savings_rate: monthlySavings,
    runway_months: runwayMonths,
    emergency_threshold: answers.emergency_threshold ?? '',

    annual_income: monthlyIncome * 12,
    monthly_rent: Math.round(fixedExpenses * 0.42),
    monthly_food: Math.round(fixedExpenses * 0.28 + discretionaryMonthly * 0.35),
    monthly_transport: Math.round(fixedExpenses * 0.08),
    monthly_entertainment: discretionaryMonthly,
    monthly_subscriptions: Math.round(fixedExpenses * 0.12),
    monthly_savings: monthlySavings,
    debt_total: creditDebt + longTermDebt,
    debt_monthly_payment: Math.round((creditDebt * 0.02 + longTermDebt * 0.01) / 2) || 0,
    risk_tolerance: archetypeResult.code?.[3] === 'A' ? 'moderate-high' : 'moderate-low',
    budget_tracking: archetypeResult.code?.[1] === 'S' ? 'detailed' : 'automated',
  };
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
