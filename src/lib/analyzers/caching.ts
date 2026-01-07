import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 15;
const CHECK_NAME = 'Stratégie de cache';
const CATEGORY = 'performance';

export function analyzeCaching(context: AuditContext): CheckResult {
  const { pageData } = context;

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Check main document caching
  const cacheControl = pageData.headers['cache-control'];
  const etag = pageData.headers['etag'];
  const lastModified = pageData.headers['last-modified'];
  const expires = pageData.headers['expires'];

  // Analyze cache-control header
  if (cacheControl) {
    if (cacheControl.includes('no-store')) {
      // Might be intentional for dynamic pages
    } else if (cacheControl.includes('no-cache')) {
      goodPractices.push('Cache avec revalidation (no-cache)');
    } else if (cacheControl.includes('max-age')) {
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
      if (maxAgeMatch) {
        const maxAge = parseInt(maxAgeMatch[1], 10);
        if (maxAge >= 86400) {
          goodPractices.push(`Cache long (${Math.round(maxAge / 86400)} jours)`);
        } else if (maxAge >= 3600) {
          goodPractices.push(`Cache moyen (${Math.round(maxAge / 3600)} heures)`);
        }
      }
    }
  }

  // Check for ETag or Last-Modified
  if (etag) {
    goodPractices.push('ETag présent');
  }
  if (lastModified) {
    goodPractices.push('Last-Modified présent');
  }

  if (!cacheControl && !etag && !lastModified && !expires) {
    issues.push('Aucun header de cache sur la page HTML');
  }

  // Analyze static resources caching
  const staticTypes = ['stylesheet', 'script', 'font', 'image'];
  const staticResources = pageData.resources.filter(r =>
    staticTypes.includes(r.type) && r.status === 200
  );

  // We can't directly check cache headers of sub-resources,
  // but we can check if they have cache-busting patterns
  const cacheBustedResources = staticResources.filter(r =>
    /[?&](v|ver|version|hash|h)=/.test(r.url) ||
    /\.[a-f0-9]{6,}\.(js|css)/.test(r.url) ||
    /-([\da-f]{8}|[\d]+)\.(js|css)/.test(r.url)
  );

  if (cacheBustedResources.length > 0) {
    goodPractices.push(`${cacheBustedResources.length} ressource(s) avec cache-busting`);
  }

  // Check for immutable hint (CDN often)
  if (cacheControl?.includes('immutable')) {
    goodPractices.push('Cache immutable');
  }

  // Check for CDN indicators
  const cdnHeaders = ['x-cache', 'cf-cache-status', 'x-cdn', 'x-served-by', 'x-fastly-request-id', 'x-vercel-cache'];
  const hasCdn = cdnHeaders.some(h => pageData.headers[h]);

  if (hasCdn) {
    goodPractices.push('CDN détecté');
  }

  // Check for vary header (important for caching)
  const vary = pageData.headers['vary'];
  if (vary && vary.includes('Accept-Encoding')) {
    goodPractices.push('Vary: Accept-Encoding');
  }

  // Build details
  const details = [
    cacheControl ? `Cache-Control: ${cacheControl}` : 'Pas de Cache-Control',
    staticResources.length > 0 ? `${staticResources.length} ressources statiques` : '',
    goodPractices.length > 0 ? goodPractices.join(', ') : '',
  ].filter(Boolean).join('. ');

  // Determine result
  if (issues.length >= 2 || (!cacheControl && staticResources.length > 10)) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Stratégie de cache insuffisante',
      issues.join('. ') + '. Configurez Cache-Control et utilisez des URLs versionnées pour les assets.',
      details
    );
  }

  if (issues.length >= 1 || goodPractices.length < 2) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Stratégie de cache à améliorer',
      issues.length > 0 ? issues.join('. ') : 'Optimisez les headers de cache pour de meilleures performances.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Bonne stratégie de cache',
    details
  );
}
