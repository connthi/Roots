"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/auth/ProtectedRoute.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getArchetypeProfile, loadProfile } from "../../lib/profileSession.js";
import styles from "./dashboard.module.css";

function DashboardContent() {
  const [data, setData] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    setData(loadProfile());
  }, []);

  if (!data) {
    return <div className={styles.loading}>Loading your dashboard...</div>;
  }

  const archetypeProfile = getArchetypeProfile(data);
  const profile = data.bedrock?.profile;

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Regenerating your profile…</div>
        <Link
          href="/deep-dive"
          style={{ color: "var(--accent)", marginTop: "1rem" }}
        >
          Return to deep dive
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <p className={styles.brand}>Roots · Results</p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/survey" className={styles.logoutBtn}>
              Retake Quiz
            </Link>
            <Link href="/home" className={styles.logoutBtn}>
              Home
            </Link>
            <button type="button" className={styles.logoutBtn} onClick={logout}>
              Log out
            </button>
          </div>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroMain}>
            <span className={styles.heroCode}>{archetypeProfile?.code}</span>
            <h1 className={styles.heroTitle}>{archetypeProfile?.name}</h1>
            <p className={styles.heroDesc}>{profile.personality_summary}</p>
          </div>

          <div className={styles.heroScores}>
            <div className={styles.scoreBox}>
              <span className={styles.scoreLabel}>Health Grade</span>
              <span className={styles.scoreValueGrade}>
                {profile.financial_health_grade}
              </span>
            </div>
            <div className={styles.scoreBox}>
              <span className={styles.scoreLabel}>Savings Score</span>
              <span className={styles.scoreValue}>
                {profile.savings_score}/100
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Financial Story</h2>
          <div className={styles.narrativeCard}>
            <p className={styles.narrativeText}>
              {profile.financial_narrative}
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Risk Assessment</h2>
          <div className={styles.riskCard}>
            <div className={styles.riskHeader}>
              <span
                className={`${styles.riskBadge} ${styles[`riskLevel${profile.risk_assessment.overall_risk_level}`]}`}
              >
                {profile.risk_assessment.overall_risk_level.toUpperCase()}
              </span>
              <p className={styles.riskExplanation}>
                {profile.risk_assessment.explanation}
              </p>
            </div>
            {profile.risk_assessment.warning_flags.length > 0 && (
              <div className={styles.flagsGroup}>
                <h4 className={styles.flagsTitle}>⚠️ Warning Flags</h4>
                <ul className={styles.flagsList}>
                  {profile.risk_assessment.warning_flags.map((flag, i) => (
                    <li key={i} className={styles.warningFlag}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.risk_assessment.strength_flags.length > 0 && (
              <div className={styles.flagsGroup}>
                <h4 className={styles.flagsTitle}>✓ Strengths</h4>
                <ul className={styles.flagsList}>
                  {profile.risk_assessment.strength_flags.map((flag, i) => (
                    <li key={i} className={styles.strengthFlag}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Action Timeline</h2>
          <div className={styles.timelineGrid}>
            <div className={styles.timelineBox}>
              <h4 className={styles.timelineHeader}>Next 30 Days</h4>
              <ul className={styles.timelineList}>
                {profile.action_timeline["30_days"]?.map((item, i) => (
                  <li key={i} className={styles.timelineItem}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.timelineBox}>
              <h4 className={styles.timelineHeader}>90 Days</h4>
              <ul className={styles.timelineList}>
                {profile.action_timeline["90_days"]?.map((item, i) => (
                  <li key={i} className={styles.timelineItem}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.timelineBox}>
              <h4 className={styles.timelineHeader}>1 Year</h4>
              <ul className={styles.timelineList}>
                {profile.action_timeline["1_year"]?.map((item, i) => (
                  <li key={i} className={styles.timelineItem}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spending Analysis</h2>
          <div className={styles.analysisCard}>
            <p className={styles.concern}>
              <strong>Top Concern:</strong>{" "}
              {profile.spending_analysis.top_concern}
            </p>
            <div className={styles.incomeExpenseRow}>
              <div className={styles.incomeExpenseItem}>
                <span className={styles.label}>Monthly Income</span>
                <span className={styles.amount}>
                  $
                  {profile.spending_analysis.total_monthly_income.toLocaleString()}
                </span>
              </div>
              <div className={styles.incomeExpenseItem}>
                <span className={styles.label}>Monthly Expenses</span>
                <span className={styles.amount}>
                  $
                  {profile.spending_analysis.total_monthly_expenses.toLocaleString()}
                </span>
              </div>
              <div className={styles.incomeExpenseItem}>
                <span className={styles.label}>Savings Rate</span>
                <span className={`${styles.amount} ${styles.textGreen}`}>
                  {profile.spending_analysis.savings_rate_percent}%
                </span>
              </div>
            </div>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <span className={styles.bdLabel}>Housing</span>
                <span className={styles.bdValue}>
                  ${profile.spending_analysis.expense_breakdown?.housing || 0}
                  /mo
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.bdLabel}>Food & Dining</span>
                <span className={styles.bdValue}>
                  ${profile.spending_analysis.expense_breakdown?.food || 0}/mo
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.bdLabel}>Debt Payments</span>
                <span className={styles.bdValue}>
                  ${profile.spending_analysis.expense_breakdown?.debt || 0}/mo
                </span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.bdLabel}>Other</span>
                <span className={styles.bdValue}>
                  ${profile.spending_analysis.expense_breakdown?.other || 0}/mo
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recommendations</h2>
          <div className={styles.recGrid}>
            {profile.recommendations.map((rec, i) => (
              <div key={i} className={styles.recCard}>
                <div className={styles.recHeader}>
                  <h3 className={styles.recTitle}>{rec.title}</h3>
                  <span
                    className={`${styles.badge} ${styles["badge" + rec.impact]}`}
                  >
                    {rec.impact} impact
                  </span>
                </div>
                <p className={styles.recDesc}>{rec.description}</p>
                <p className={styles.recTime}>Timeframe: {rec.timeframe}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Compound Projections</h2>
          <p className={styles.subtitle}>
            Current trajectory vs. implementing recommendations
          </p>
          <div className={styles.projGrid}>
            <div className={styles.projCard}>
              <h4>1 Year</h4>
              <div className={styles.projCompare}>
                <div>
                  <span>Current</span>
                  <strong>
                    $
                    {profile.projections[
                      "1_year"
                    ].current_path.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>Optimized</span>
                  <strong className={styles.textGreen}>
                    $
                    {profile.projections[
                      "1_year"
                    ].optimized_path.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
            <div className={styles.projCard}>
              <h4>10 Years</h4>
              <div className={styles.projCompare}>
                <div>
                  <span>Current</span>
                  <strong>
                    $
                    {profile.projections[
                      "10_years"
                    ].current_path.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>Optimized</span>
                  <strong className={styles.textGreen}>
                    $
                    {profile.projections[
                      "10_years"
                    ].optimized_path.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
            <div className={styles.projCard}>
              <h4>Retirement (Age 65)</h4>
              <div className={styles.projCompare}>
                <div>
                  <span>Current</span>
                  <strong>
                    $
                    {profile.projections[
                      "retirement_65"
                    ].current_path.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>Optimized</span>
                  <strong className={styles.textGreen}>
                    $
                    {profile.projections[
                      "retirement_65"
                    ].optimized_path.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Compliance & Disclaimers</h2>
          <div className={styles.disclaimerCard}>
            <div className={styles.disclaimerItem}>
              <p className={styles.disclaimerLabel}>
                <strong>About This Analysis:</strong>
              </p>
              <p className={styles.disclaimerText}>
                {profile.guardrail_flags.regulatory_note}
              </p>
            </div>
            <div className={styles.disclaimerItem}>
              <p className={styles.disclaimerLabel}>
                <strong>Your Situation:</strong>
              </p>
              <p className={styles.disclaimerText}>
                {profile.guardrail_flags.vulnerability_note}
              </p>
            </div>
            {profile.guardrail_flags.compliance_checks &&
              profile.guardrail_flags.compliance_checks.length > 0 && (
                <div className={styles.disclaimerItem}>
                  <p className={styles.disclaimerLabel}>
                    <strong>Validation Checks:</strong>
                  </p>
                  <ul className={styles.complianceList}>
                    {profile.guardrail_flags.compliance_checks.map(
                      (check, i) => (
                        <li key={i}>✓ {check}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireComplete>
      <DashboardContent />
    </ProtectedRoute>
  );
}
