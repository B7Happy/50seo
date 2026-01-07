import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 50;
const CHECK_NAME = 'Liens cassés';
const CATEGORY = 'errors';

const MAX_LINKS_TO_CHECK = 50; // Limit to avoid timeout
const REQUEST_TIMEOUT = 5000; // 5 seconds per request

interface LinkCheckResult {
  url: string;
  status: number;
  error?: string;
}

async function checkLink(url: string): Promise<LinkCheckResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD for efficiency
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; 50SEO-Bot/1.0)',
      },
    });

    clearTimeout(timeout);

    return {
      url,
      status: response.status,
    };
  } catch (error) {
    // Try GET if HEAD fails (some servers don't support HEAD)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; 50SEO-Bot/1.0)',
        },
      });

      clearTimeout(timeout);

      return {
        url,
        status: response.status,
      };
    } catch (getError) {
      return {
        url,
        status: 0,
        error: getError instanceof Error ? getError.message : 'Unknown error',
      };
    }
  }
}

export async function analyzeBrokenLinks(context: AuditContext): Promise<CheckResult> {
  const { $, domain } = context;

  // Collect internal links
  const internalLinks = new Set<string>();
  const domainUrl = new URL(domain);

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    // Skip non-http links
    if (href.startsWith('#') || href.startsWith('javascript:') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    try {
      const linkUrl = new URL(href, domain);

      // Only check internal links
      if (linkUrl.origin === domainUrl.origin) {
        // Normalize URL
        const normalized = linkUrl.origin + linkUrl.pathname + linkUrl.search;
        internalLinks.add(normalized);
      }
    } catch {
      // Invalid URL - skip
    }
  });

  // Limit the number of links to check
  const linksToCheck = Array.from(internalLinks).slice(0, MAX_LINKS_TO_CHECK);
  const totalLinks = internalLinks.size;

  if (linksToCheck.length === 0) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun lien interne à vérifier',
      'Page sans liens internes détectés'
    );
  }

  // Check links in parallel (with concurrency limit)
  const CONCURRENCY = 5;
  const results: LinkCheckResult[] = [];

  for (let i = 0; i < linksToCheck.length; i += CONCURRENCY) {
    const batch = linksToCheck.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkLink));
    results.push(...batchResults);
  }

  // Analyze results
  const brokenLinks = results.filter(r => r.status === 404 || r.status === 410);
  const errorLinks = results.filter(r => r.status === 0 || r.status >= 500);
  const redirectedLinks = results.filter(r => r.status >= 300 && r.status < 400);
  const okLinks = results.filter(r => r.status >= 200 && r.status < 300);

  // Build details
  const details = [
    `${linksToCheck.length}/${totalLinks} liens vérifiés`,
    `${okLinks.length} OK`,
    brokenLinks.length > 0 ? `${brokenLinks.length} cassé(s)` : '',
    errorLinks.length > 0 ? `${errorLinks.length} erreur(s)` : '',
    redirectedLinks.length > 0 ? `${redirectedLinks.length} redirection(s)` : '',
  ].filter(Boolean).join(', ');

  // Get broken link URLs for the message
  const brokenUrlSamples = brokenLinks
    .slice(0, 5)
    .map(l => new URL(l.url).pathname)
    .join(', ');

  // Evaluate
  if (brokenLinks.length > 5 || brokenLinks.length > linksToCheck.length * 0.1) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${brokenLinks.length} lien(s) cassé(s) détecté(s)`,
      `URLs: ${brokenUrlSamples}${brokenLinks.length > 5 ? '...' : ''}. Corrigez ou supprimez ces liens.`,
      details
    );
  }

  if (brokenLinks.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${brokenLinks.length} lien(s) cassé(s) détecté(s)`,
      `URLs: ${brokenUrlSamples}. Corrigez ces liens pour améliorer l'expérience utilisateur.`,
      details
    );
  }

  if (errorLinks.length > 3) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${errorLinks.length} liens avec erreurs serveur`,
      'Certains liens retournent des erreurs. Vérifiez le serveur.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Aucun lien cassé détecté',
    details
  );
}
