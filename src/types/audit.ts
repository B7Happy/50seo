export type CheckStatus = 'pass' | 'warning' | 'fail' | 'na' | 'manual';

export interface CheckResult {
  id: number;
  name: string;
  category: string;
  status: CheckStatus;
  score: number; // 0, 0.5, or 1
  message: string;
  details?: string;
  recommendation?: string;
  learnMoreUrl?: string;
}

export interface AuditCategory {
  id: string;
  name: string;
  icon: string;
  checks: CheckResult[];
  score: number;
  maxScore: number;
}

export interface AuditResult {
  id: string;
  url: string;
  domain: string;
  score: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  summary: {
    passed: number;
    warnings: number;
    critical: number;
    notApplicable: number;
  };
  categories: AuditCategory[];
  createdAt: Date;
  completedAt?: Date;
}
