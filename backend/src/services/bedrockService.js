import {
  BedrockRuntimeClient,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID;

/**
 * Build a structured financial analysis prompt from survey + quiz data.
 */
function buildPrompt(surveyData) {
  return `You are a certified financial analyst AI for the "Roots" platform — a financial literacy tool for young adults.

Given the following user financial profile and spending personality quiz result, produce a comprehensive Personalized Finance Analysis (PFA).

=== USER DATA ===
Age: ${surveyData.age ?? 'not provided'}
Annual Income: $${surveyData.annual_income ?? 'not provided'}
Monthly Rent: $${surveyData.monthly_rent ?? 0}
Monthly Food: $${surveyData.monthly_food ?? 0}
Monthly Transport: $${surveyData.monthly_transport ?? 0}
Monthly Entertainment: $${surveyData.monthly_entertainment ?? 0}
Monthly Subscriptions: $${surveyData.monthly_subscriptions ?? 0}
Monthly Savings: $${surveyData.monthly_savings ?? 0}
Total Debt: $${surveyData.debt_total ?? 0}
Monthly Debt Payment: $${surveyData.debt_monthly_payment ?? 0}
Impulse Buy Frequency: ${surveyData.impulse_buy_frequency ?? 'not provided'}
Budget Tracking Method: ${surveyData.budget_tracking ?? 'not provided'}
Financial Goal: ${surveyData.financial_goal ?? 'not provided'}
Risk Tolerance: ${surveyData.risk_tolerance ?? 'not provided'}
Spending Personality Code: ${surveyData.personality_code ?? 'not provided'}
Archetype: ${surveyData.archetype_name ?? 'not provided'}

=== DEEP DIVE (if provided) ===
Monthly Net Income: $${surveyData.monthly_income ?? 'not provided'}
Liquid Cash: $${surveyData.liquid_cash ?? 'not provided'}
Fixed Monthly Expenses: $${surveyData.fixed_expenses ?? 'not provided'}
Discretionary Weekly Spend: $${surveyData.discretionary_weekly ?? 'not provided'}
Credit Card Debt: $${surveyData.credit_card_debt ?? 'not provided'}
Long-Term Debt: $${surveyData.long_term_debt ?? 'not provided'}
Total Invested: $${surveyData.total_invested ?? 'not provided'}
Monthly Savings/Investment Rate: $${surveyData.monthly_savings_rate ?? 'not provided'}
Runway (months): ${surveyData.runway_months ?? 'not provided'}
Emergency Threshold Bracket: ${surveyData.emergency_threshold ?? 'not provided'}

=== INSTRUCTIONS ===
Return a JSON object with exactly this structure:
{
  "personality_summary": "2-3 sentence summary of their financial personality",
  "spending_analysis": {
    "total_monthly_expenses": <number>,
    "total_monthly_income": <number>,
    "savings_rate_percent": <number>,
    "expense_breakdown": { "category": <amount>, ... },
    "top_concern": "string"
  },
  "savings_score": <number 1-100>,
  "financial_health_grade": "<A/B/C/D/F>",
  "recommendations": [
    { "title": "string", "description": "string", "impact": "high/medium/low", "timeframe": "string" }
  ],
  "projections": {
    "1_week": { "current_path": <number>, "optimized_path": <number> },
    "1_month": { "current_path": <number>, "optimized_path": <number> },
    "1_year": { "current_path": <number>, "optimized_path": <number> },
    "10_years": { "current_path": <number>, "optimized_path": <number> },
    "retirement_65": { "current_path": <number>, "optimized_path": <number> }
  },
  "habit_changes": [
    { "habit": "string", "monthly_savings": <number>, "annual_impact": <number> }
  ]
}

Return ONLY valid JSON, no markdown fences or extra text.`;
}

/**
 * Call AWS Bedrock to generate a financial profile from survey data.
 * Falls back to mock data if DRY_RUN=true or if no model ID is configured.
 */
export async function generateProfile(surveyData) {
  // Dry-run mode for local testing without AWS credentials
  if (process.env.DRY_RUN === 'true' || !MODEL_ID) {
    console.log('[Bedrock] DRY_RUN mode — returning mock profile');
    return getMockProfile(surveyData);
  }

  const prompt = buildPrompt(surveyData);

  const command = new ConverseCommand({
    modelId: MODEL_ID,
    messages: [
      {
        role: 'user',
        content: [{ text: prompt }],
      },
    ],
    inferenceConfig: {
      maxTokens: 2048,
      temperature: 0.3,
    },
  });

  const response = await client.send(command);
  const rawText = response.output?.message?.content?.[0]?.text;

  if (!rawText) {
    throw new Error('Bedrock returned an empty response');
  }

  // Parse the JSON from the response (strip markdown fences if present)
  const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const profile = JSON.parse(cleaned);
  return profile;
}

/**
 * Mock profile for testing without Bedrock access.
 */
function getMockProfile(surveyData) {
  const monthlyIncome =
    surveyData.monthly_income ??
    (surveyData.annual_income ? surveyData.annual_income / 12 : 45000 / 12);
  const totalExpenses =
    surveyData.fixed_expenses ??
    (surveyData.monthly_rent || 0) +
      (surveyData.monthly_food || 0) +
      (surveyData.monthly_transport || 0) +
      (surveyData.monthly_entertainment || 0) +
      (surveyData.monthly_subscriptions || 0) +
      (surveyData.debt_monthly_payment || 0);
  const savingsRate =
    surveyData.monthly_savings_rate ?? surveyData.monthly_savings ?? 0;

  return {
    personality_summary: `Based on your ${surveyData.archetype_name || 'financial'} profile, you show a balanced approach to money management with room for optimization.`,
    spending_analysis: {
      total_monthly_expenses: totalExpenses,
      total_monthly_income: Math.round(monthlyIncome),
      savings_rate_percent: Math.round(
        (savingsRate / Math.max(monthlyIncome, 1)) * 100,
      ),
      expense_breakdown: {
        housing: surveyData.monthly_rent || Math.round(totalExpenses * 0.42),
        food: surveyData.monthly_food || 0,
        transport: surveyData.monthly_transport || 0,
        entertainment: surveyData.monthly_entertainment || 0,
        subscriptions: surveyData.monthly_subscriptions || 0,
        debt: surveyData.debt_monthly_payment || 0,
        current_savings: savingsRate,
      },
      top_concern: 'Optimizing discretionary spending',
    },
    savings_score: 62,
    financial_health_grade: 'B',
    recommendations: [
      { title: 'Build emergency fund', description: 'Aim for 3-6 months of expenses in a high-yield savings account.', impact: 'high', timeframe: '6 months' },
      { title: 'Reduce subscriptions', description: 'Audit recurring charges and cancel unused services.', impact: 'medium', timeframe: '1 week' },
      { title: 'Automate savings', description: 'Set up automatic transfers to savings on payday.', impact: 'high', timeframe: '1 day' },
    ],
    projections: {
      '1_week': { current_path: Math.round(monthlyIncome * 0.25 * 0.23), optimized_path: Math.round(monthlyIncome * 0.25 * 0.35) },
      '1_month': { current_path: Math.round(monthlyIncome * 0.23), optimized_path: Math.round(monthlyIncome * 0.35) },
      '1_year': { current_path: Math.round(monthlyIncome * 0.23 * 12), optimized_path: Math.round(monthlyIncome * 0.35 * 12) },
      '10_years': { current_path: Math.round(monthlyIncome * 0.23 * 120 * 1.07), optimized_path: Math.round(monthlyIncome * 0.35 * 120 * 1.07) },
      'retirement_65': { current_path: Math.round(monthlyIncome * 0.23 * 12 * 43 * 1.07), optimized_path: Math.round(monthlyIncome * 0.35 * 12 * 43 * 1.07) },
    },
    habit_changes: [
      { habit: 'Cook at home 3x more per week', monthly_savings: 150, annual_impact: 1800 },
      { habit: 'Cancel unused subscriptions', monthly_savings: 35, annual_impact: 420 },
    ],
    _mock: true,
  };
}
