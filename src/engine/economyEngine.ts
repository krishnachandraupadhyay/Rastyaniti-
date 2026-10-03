import type { NationalMetrics, BudgetAllocation } from '../types/parliament';

export const calculateEconomicTrends = (
  current: NationalMetrics,
  budget: BudgetAllocation
): NationalMetrics => {
  // Budget percentages total 100%
  // Infrastructure + Tech boosts GDP
  const productiveCapital = (budget.infrastructure * 0.4) + (budget.technology * 0.3) + (budget.education * 0.3);
  const gdpShift = (productiveCapital - 30) * 0.04;

  // Heavy social welfare & defence without tax increases can fuel inflation or deficit
  const consumptionSpending = budget.socialWelfare + budget.defence;
  const inflationShift = (consumptionSpending - 25) * 0.03;

  // Education + Tech + Agriculture lowers unemployment
  const jobEngine = (budget.agriculture * 0.3) + (budget.infrastructure * 0.35) + (budget.technology * 0.35);
  const unemploymentShift = -(jobEngine - 30) * 0.03;

  // Public approval correlates with low inflation, good healthcare, education and jobs
  const welfareScore = (budget.healthcare * 1.5) + (budget.education * 1.3) + (budget.agriculture * 1.2);
  const approvalShift = (welfareScore - 35) * 0.25;

  return {
    gdpGrowthRate: Number(Math.min(10.5, Math.max(3.2, current.gdpGrowthRate + gdpShift)).toFixed(2)),
    inflationRate: Number(Math.min(9.8, Math.max(2.5, current.inflationRate + inflationShift)).toFixed(2)),
    unemploymentRate: Number(Math.min(9.5, Math.max(3.0, current.unemploymentRate + unemploymentShift)).toFixed(2)),
    nationalDebtPercent: Number(Math.min(75, Math.max(42, current.nationalDebtPercent + (budget.socialWelfare > 20 ? 0.6 : -0.3))).toFixed(1)),
    publicApproval: Math.min(96, Math.max(30, Math.round(current.publicApproval + approvalShift))),
    fiscalDeficit: Number(Math.min(7.5, Math.max(3.0, current.fiscalDeficit + (gdpShift < 0 ? 0.2 : -0.1))).toFixed(2)),
    foreignReserves: Math.round(current.foreignReserves + (gdpShift > 0 ? 12 : -5)),
  };
};
