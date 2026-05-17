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
  const emergencyThreshold = answers.emergency_threshold ?? "";

  const meta = archetypeResult.archetype ?? archetypeResult;

  // Calculate derived metrics for guardrail assessment
  const totalMonthlyExpenses = fixedExpenses + discretionaryMonthly;
  const totalDebt = creditDebt + longTermDebt;
  const annualIncome = monthlyIncome * 12;

  const emergencyFundRatio =
    totalMonthlyExpenses > 0 ? liquidCash / totalMonthlyExpenses : 0;
  const debtToIncome = annualIncome > 0 ? totalDebt / annualIncome : 0;

  return {
    // Personality mapping
    personality_code: archetypeResult.code,
    archetype_name: meta.name,
    age: 22,

    // Core deep dive data (10 fields)
    monthly_income: monthlyIncome,
    liquid_cash: liquidCash,
    fixed_expenses: fixedExpenses,
    discretionary_weekly: discretionaryWeekly,
    credit_card_debt: creditDebt,
    long_term_debt: longTermDebt,
    total_invested: totalInvested,
    monthly_savings_rate: monthlySavings,
    runway_months: runwayMonths,
    emergency_threshold: emergencyThreshold,

    // Derived metrics for analysis
    emergency_fund_ratio: emergencyFundRatio,
    debt_to_income: debtToIncome,
    total_monthly_expenses: totalMonthlyExpenses,

    // Annual/calculated fields (for backward compatibility)
    annual_income: annualIncome,
    monthly_rent: Math.round(fixedExpenses * 0.42),
    monthly_food: Math.round(
      fixedExpenses * 0.28 + discretionaryMonthly * 0.35,
    ),
    monthly_transport: Math.round(fixedExpenses * 0.08),
    monthly_entertainment: discretionaryMonthly,
    monthly_subscriptions: Math.round(fixedExpenses * 0.12),
    monthly_savings: monthlySavings,
    debt_total: totalDebt,
    debt_monthly_payment:
      Math.round((creditDebt * 0.02 + longTermDebt * 0.01) / 2) || 0,

    // Archetype-derived behavioral insights
    risk_tolerance:
      archetypeResult.code?.[3] === "A" ? "moderate-high" : "moderate-low",
    budget_tracking:
      archetypeResult.code?.[1] === "S" ? "detailed" : "automated",
    spending_personality: archetypeResult.code,
  };
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
