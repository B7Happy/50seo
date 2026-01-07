import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

// Check #48: Balises canonical
export function analyzeCanonical(context: AuditContext): CheckResult {
  const CHECK_ID = 48;
  const CHECK_NAME = 'Balises canonical';
  const CATEGORY = 'technical';

  const { $, url, pageData } = context;

  // Check for canonical in HTML
  const canonicalTag = $('link[rel="canonical"]');
  const canonicalHref = canonicalTag.attr('href');

  // Check for canonical in HTTP header
  const linkHeader = pageData.headers['link'];
  let canonicalFromHeader: string | null = null;

  if (linkHeader) {
    const canonicalMatch = linkHeader.match(/<([^>]+)>;\s*rel="canonical"/i);
    if (canonicalMatch) {
      canonicalFromHeader = canonicalMatch[1];
    }
  }

  // No canonical found
  if (!canonicalHref && !canonicalFromHeader) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune balise canonical trouvée',
      'Ajoutez une balise <link rel="canonical" href="..."> pour éviter les problèmes de contenu dupliqué.'
    );
  }

  // Multiple canonicals
  if (canonicalTag.length > 1) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${canonicalTag.length} balises canonical détectées`,
      'Utilisez une seule balise canonical par page.'
    );
  }

  // Both HTML and header canonical (check consistency)
  if (canonicalHref && canonicalFromHeader && canonicalHref !== canonicalFromHeader) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Canonical HTML et HTTP Header incohérents',
      'Utilisez le même URL dans les deux déclarations ou n\'en utilisez qu\'une.',
      `HTML: ${canonicalHref}, Header: ${canonicalFromHeader}`
    );
  }

  const canonical = canonicalHref || canonicalFromHeader;
  const currentUrl = pageData.finalUrl || url;

  // Validate canonical URL
  let canonicalUrl: URL;
  try {
    canonicalUrl = new URL(canonical!, currentUrl);
  } catch {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'URL canonical invalide',
      'Utilisez une URL absolue valide pour la balise canonical.',
      `Canonical: ${canonical}`
    );
  }

  // Check if self-referencing
  const isSelfReferencing =
    canonicalUrl.href === currentUrl ||
    canonicalUrl.href === url ||
    canonicalUrl.href === currentUrl.replace(/\/$/, '') ||
    canonicalUrl.href === currentUrl + '/';

  if (isSelfReferencing) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Balise canonical auto-référente correctement configurée',
      `Canonical: ${canonical}`
    );
  }

  // Canonical points elsewhere
  return warning(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Canonical pointe vers une autre URL',
    'Vérifiez que c\'est intentionnel. Cette page sera considérée comme une copie de l\'URL canonique.',
    `Page actuelle: ${currentUrl}, Canonical: ${canonical}`
  );
}

// Check #14: Contenu dupliqué (via canonical analysis)
export function analyzeDuplicateContent(context: AuditContext): CheckResult {
  const CHECK_ID = 14;
  const CHECK_NAME = 'Contenu dupliqué';
  const CATEGORY = 'technical';

  const { $, url, pageData } = context;

  const issues: string[] = [];

  // Check canonical
  const canonical = $('link[rel="canonical"]').attr('href');
  const currentUrl = pageData.finalUrl || url;

  if (canonical && canonical !== currentUrl && canonical !== url) {
    issues.push(`Canonical pointe vers ${canonical}`);
  }

  // Check for URL parameters that might cause duplicates
  const urlObj = new URL(currentUrl);
  const params = Array.from(urlObj.searchParams.keys());
  const trackingParams = params.filter(p =>
    /^(utm_|gclid|fbclid|ref|source|campaign)/.test(p.toLowerCase())
  );

  if (trackingParams.length > 0 && !canonical) {
    issues.push(`Paramètres de tracking sans canonical: ${trackingParams.join(', ')}`);
  }

  // Check meta robots for noindex
  const metaRobots = $('meta[name="robots"]').attr('content');
  const hasNoindex = metaRobots?.toLowerCase().includes('noindex');

  // Check for pagination indicators
  const hasPrevNext = $('link[rel="prev"], link[rel="next"]').length > 0;

  if (hasPrevNext && !canonical) {
    issues.push('Page paginée sans canonical défini');
  }

  // Check if accessed with/without www or trailing slash redirects properly
  if (pageData.finalUrl !== url) {
    // There was a redirect - good for duplicate prevention
  }

  const details = [
    canonical ? `Canonical: ${canonical}` : 'Pas de canonical',
    hasNoindex ? 'noindex actif' : '',
    hasPrevNext ? 'rel prev/next présent' : '',
  ].filter(Boolean).join('. ');

  if (issues.length > 0 && !hasNoindex) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${issues.length} risque(s) de contenu dupliqué détecté(s)`,
      issues.join('. ') + '. Assurez-vous que les canonicals sont correctement configurés.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Pas de risque majeur de contenu dupliqué détecté',
    details || 'Configuration standard'
  );
}
