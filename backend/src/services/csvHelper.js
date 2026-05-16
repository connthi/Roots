/**
 * Placeholder CSV schema for financial survey data.
 * Columns can be extended later once user portfolio fields are finalized.
 */

const CSV_COLUMNS = [
  'user_id',
  'timestamp',
  'age',
  'annual_income',
  'monthly_rent',
  'monthly_food',
  'monthly_transport',
  'monthly_entertainment',
  'monthly_subscriptions',
  'monthly_savings',
  'debt_total',
  'debt_monthly_payment',
  'impulse_buy_frequency',
  'budget_tracking',
  'financial_goal',
  'risk_tolerance',
  'personality_code',
  'archetype_name',
];

/**
 * Convert a survey data object into a CSV string (header + one data row).
 * Missing fields default to empty string.
 */
export function toCSV(data) {
  const header = CSV_COLUMNS.join(',');
  const row = CSV_COLUMNS.map((col) => {
    const val = data[col] ?? '';
    // Escape commas and quotes in string values
    const str = String(val);
    return str.includes(',') || str.includes('"')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  }).join(',');
  return `${header}\n${row}\n`;
}

export { CSV_COLUMNS };
