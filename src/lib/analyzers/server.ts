import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 34;
const CHECK_NAME = 'Performance serveur (TTFB)';
const CATEGORY = 'performance';

export function analyzeServerPerformance(context: AuditContext): CheckResult {
  const { pageData } = context;

  const ttfb = pageData.ttfb;
  const totalLoadTime = pageData.loadTime;

  // Check server headers for insights
  const server = pageData.headers['server'];
  const poweredBy = pageData.headers['x-powered-by'];
  const responseTime = pageData.headers['x-response-time'];

  // Check for CDN indicators
  const cdnHeaders = {
    'cf-ray': 'Cloudflare',
    'x-vercel-id': 'Vercel',
    'x-amz-cf-id': 'CloudFront',
    'x-fastly-request-id': 'Fastly',
    'x-cache': 'CDN',
  };

  let cdn: string | null = null;
  for (const [header, name] of Object.entries(cdnHeaders)) {
    if (pageData.headers[header]) {
      cdn = name;
      break;
    }
  }

  // Check for compression
  const contentEncoding = pageData.headers['content-encoding'];
  const hasCompression = contentEncoding && ['gzip', 'br', 'deflate'].some(c =>
    contentEncoding.includes(c)
  );

  // Check for HTTP/2 or HTTP/3 (via headers or URL patterns)
  // Note: This is limited - we can't directly detect protocol
  const hasAltSvc = pageData.headers['alt-svc'];

  // Build details
  const details = [
    `TTFB: ${ttfb}ms`,
    `Temps total: ${totalLoadTime}ms`,
    cdn ? `CDN: ${cdn}` : '',
    hasCompression ? `Compression: ${contentEncoding}` : '',
    server ? `Serveur: ${server}` : '',
  ].filter(Boolean).join('. ');

  // TTFB thresholds (Google recommends < 200ms for good, < 500ms for needs improvement)
  if (ttfb > 1000) {
    const issues = [
      `TTFB très élevé: ${ttfb}ms`,
      !cdn ? 'Pas de CDN détecté' : '',
      !hasCompression ? 'Pas de compression' : '',
    ].filter(Boolean);

    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Performance serveur insuffisante',
      issues.join('. ') + '. Optimisez votre serveur, utilisez un CDN et activez la compression.',
      details
    );
  }

  if (ttfb > 500) {
    const suggestions: string[] = [];
    if (!cdn) suggestions.push('Utilisez un CDN');
    if (!hasCompression) suggestions.push('Activez la compression');
    suggestions.push('Optimisez le temps de réponse serveur');

    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `TTFB à améliorer: ${ttfb}ms`,
      suggestions.join('. ') + '. Cible: < 200ms.',
      details
    );
  }

  if (ttfb > 200) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `TTFB acceptable: ${ttfb}ms`,
      'Pour une performance optimale, visez < 200ms.',
      details
    );
  }

  // Excellent TTFB
  const goodPoints: string[] = [`Excellent TTFB: ${ttfb}ms`];
  if (cdn) goodPoints.push(`CDN ${cdn} actif`);
  if (hasCompression) goodPoints.push('Compression active');

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    goodPoints.join('. '),
    details
  );
}
