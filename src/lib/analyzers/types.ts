import type { CheerioAPI } from 'cheerio';
import type { PageData, RobotsData, SitemapData } from '@/lib/scraper';
import type { CheckResult, CheckStatus } from '@/types/audit';

export interface AuditContext {
  url: string;
  domain: string;
  pageData: PageData;
  rawHtml: { html: string; statusCode: number; headers: Record<string, string> };
  robotsData: RobotsData;
  sitemapData: SitemapData;
  $: CheerioAPI;
  $raw: CheerioAPI;
}

export type Analyzer = (context: AuditContext) => Promise<CheckResult[]> | CheckResult[];

export function createCheckResult(
  id: number,
  name: string,
  category: string,
  status: CheckStatus,
  score: number,
  message: string,
  options?: {
    details?: string;
    recommendation?: string;
    learnMoreUrl?: string;
  }
): CheckResult {
  return {
    id,
    name,
    category,
    status,
    score,
    message,
    ...options,
  };
}

export function pass(
  id: number,
  name: string,
  category: string,
  message: string,
  details?: string
): CheckResult {
  return createCheckResult(id, name, category, 'pass', 1, message, { details });
}

export function warning(
  id: number,
  name: string,
  category: string,
  message: string,
  recommendation: string,
  details?: string
): CheckResult {
  return createCheckResult(id, name, category, 'warning', 0.5, message, { details, recommendation });
}

export function fail(
  id: number,
  name: string,
  category: string,
  message: string,
  recommendation: string,
  details?: string
): CheckResult {
  return createCheckResult(id, name, category, 'fail', 0, message, { details, recommendation });
}

export function notApplicable(
  id: number,
  name: string,
  category: string,
  message: string
): CheckResult {
  return createCheckResult(id, name, category, 'na', 0, message);
}

export function manual(
  id: number,
  name: string,
  category: string,
  message: string,
  recommendation: string
): CheckResult {
  return createCheckResult(id, name, category, 'manual', 0, message, { recommendation });
}
