import type { CheckResult } from '@/types/audit';
import { CHECKS } from '@/config/checks';

export interface AuditSummary {
  passed: number;
  warnings: number;
  critical: number;
  notApplicable: number;
}

export function calculateScore(checks: CheckResult[]): number {
  // Filter out manual and N/A checks from scoring
  const scorableChecks = checks.filter(
    (c) => c.status !== 'manual' && c.status !== 'na'
  );

  if (scorableChecks.length === 0) {
    return 0;
  }

  // Calculate weighted score
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const check of scorableChecks) {
    const checkConfig = CHECKS[check.id];
    const weight = checkConfig?.weight || 1;

    totalWeightedScore += check.score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    return 0;
  }

  // Return score as percentage (0-100)
  return Math.round((totalWeightedScore / totalWeight) * 100);
}

export function calculateSummary(checks: CheckResult[]): AuditSummary {
  return {
    passed: checks.filter((c) => c.status === 'pass').length,
    warnings: checks.filter((c) => c.status === 'warning').length,
    critical: checks.filter((c) => c.status === 'fail').length,
    notApplicable: checks.filter((c) => c.status === 'na' || c.status === 'manual').length,
  };
}

export function getScoreGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { grade: 'A', label: 'Excellent', color: 'success' };
  }
  if (score >= 80) {
    return { grade: 'B', label: 'Bon', color: 'success' };
  }
  if (score >= 70) {
    return { grade: 'C', label: 'Correct', color: 'warning' };
  }
  if (score >= 50) {
    return { grade: 'D', label: 'À améliorer', color: 'warning' };
  }
  return { grade: 'F', label: 'Critique', color: 'destructive' };
}

export function getCategoryScore(checks: CheckResult[]): number {
  const scorableChecks = checks.filter(
    (c) => c.status !== 'manual' && c.status !== 'na'
  );

  if (scorableChecks.length === 0) {
    return 100; // No checks to fail = perfect score
  }

  const totalScore = scorableChecks.reduce((sum, c) => sum + c.score, 0);
  return Math.round((totalScore / scorableChecks.length) * 100);
}
