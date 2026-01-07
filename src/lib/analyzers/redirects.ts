import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

// Check #18: Redirections trailing slash
export function analyzeTrailingSlash(context: AuditContext): CheckResult {
  const CHECK_ID = 18;
  const CHECK_NAME = 'Redirections trailing slash';
  const CATEGORY = 'technical';

  const { url, pageData } = context;
  const finalUrl = pageData.finalUrl;

  // Parse URLs
  const originalPath = new URL(url).pathname;
  const finalPath = new URL(finalUrl).pathname;

  const originalHasSlash = originalPath.endsWith('/') && originalPath !== '/';
  const finalHasSlash = finalPath.endsWith('/') && finalPath !== '/';

  // Check if there was a redirect related to trailing slash
  const wasRedirected = url !== finalUrl;
  const slashChanged = originalHasSlash !== finalHasSlash;

  if (wasRedirected && slashChanged) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Redirection trailing slash correctement configurée',
      `${url} → ${finalUrl}`
    );
  }

  // For home page, trailing slash is standard
  if (originalPath === '/' || finalPath === '/') {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Configuration trailing slash correcte (page d\'accueil)',
      `URL: ${finalUrl}`
    );
  }

  // Check canonical for consistency
  const canonical = context.$('link[rel="canonical"]').attr('href');
  if (canonical) {
    const canonicalPath = new URL(canonical, finalUrl).pathname;
    const canonicalHasSlash = canonicalPath.endsWith('/') && canonicalPath !== '/';

    if (canonicalHasSlash !== finalHasSlash) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Incohérence trailing slash avec canonical',
        'L\'URL et le canonical devraient avoir la même convention de trailing slash.',
        `URL: ${finalUrl}, Canonical: ${canonical}`
      );
    }
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Configuration trailing slash cohérente',
    `URL: ${finalUrl}`
  );
}

// Check #22: Redirections www/non-www
export function analyzeWwwRedirect(context: AuditContext): CheckResult {
  const CHECK_ID = 22;
  const CHECK_NAME = 'Redirections www/non-www';
  const CATEGORY = 'technical';

  const { url, pageData, domain } = context;
  const finalUrl = pageData.finalUrl;

  const originalHost = new URL(url).hostname;
  const finalHost = new URL(finalUrl).hostname;

  const originalHasWww = originalHost.startsWith('www.');
  const finalHasWww = finalHost.startsWith('www.');

  // Check if redirect happened
  const wasRedirected = originalHost !== finalHost;

  if (wasRedirected && (originalHasWww !== finalHasWww)) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Redirection www/non-www correctement configurée',
      `${originalHost} → ${finalHost}`
    );
  }

  // Check canonical for www preference
  const canonical = context.$('link[rel="canonical"]').attr('href');
  if (canonical) {
    try {
      const canonicalHost = new URL(canonical).hostname;
      const canonicalHasWww = canonicalHost.startsWith('www.');

      if (canonicalHasWww !== finalHasWww) {
        return warning(
          CHECK_ID,
          CHECK_NAME,
          CATEGORY,
          'Incohérence www avec canonical',
          'L\'URL et le canonical devraient utiliser la même version (www ou non-www).',
          `URL: ${finalHost}, Canonical: ${canonicalHost}`
        );
      }
    } catch {
      // Invalid canonical URL
    }
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Configuration www cohérente',
    `Domaine: ${finalHost}`
  );
}

// Check #36: Redirections internes
export function analyzeInternalRedirects(context: AuditContext): CheckResult {
  const CHECK_ID = 36;
  const CHECK_NAME = 'Redirections internes';
  const CATEGORY = 'navigation';

  const { $, domain, pageData } = context;

  // Get all internal links
  const internalLinks: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    try {
      const linkUrl = new URL(href, domain);
      if (linkUrl.origin === new URL(domain).origin) {
        internalLinks.push(href);
      }
    } catch {
      // Invalid URL
    }
  });

  // Check resources that were redirected
  const redirectedResources = pageData.resources.filter(r =>
    r.status >= 300 && r.status < 400
  );

  const internalRedirects = redirectedResources.filter(r => {
    try {
      return new URL(r.url).origin === new URL(domain).origin;
    } catch {
      return false;
    }
  });

  if (internalRedirects.length === 0) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune redirection interne détectée',
      `${internalLinks.length} liens internes analysés`
    );
  }

  const redirectCount = internalRedirects.length;
  const details = internalRedirects.slice(0, 5).map(r => `${r.url} (${r.status})`).join(', ');

  if (redirectCount > 10) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${redirectCount} redirections internes détectées`,
      'Mettez à jour les liens pour pointer directement vers les URLs finales.',
      details + (redirectCount > 5 ? ` et ${redirectCount - 5} autres...` : '')
    );
  }

  if (redirectCount > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${redirectCount} redirection(s) interne(s) détectée(s)`,
      'Mettez à jour ces liens pour pointer directement vers les URLs finales.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Liens internes sans redirections',
    `${internalLinks.length} liens vérifiés`
  );
}

// Check #44: Liens HTTP (mixed content)
export function analyzeHttpLinks(context: AuditContext): CheckResult {
  const CHECK_ID = 44;
  const CHECK_NAME = 'Liens HTTP';
  const CATEGORY = 'technical';

  const { $, url, pageData } = context;

  const isHttpsSite = url.startsWith('https://');

  if (!isHttpsSite) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Site non HTTPS - vérification mixed content non applicable',
      'Migrez d\'abord votre site vers HTTPS.'
    );
  }

  const httpResources: string[] = [];
  const httpLinks: string[] = [];

  // Check loaded resources
  for (const resource of pageData.resources) {
    if (resource.url.startsWith('http://')) {
      httpResources.push(resource.url);
    }
  }

  // Check links in HTML
  $('a[href^="http://"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) httpLinks.push(href);
  });

  // Check src attributes
  $('[src^="http://"]').each((_, el) => {
    const src = $(el).attr('src');
    if (src) httpResources.push(src);
  });

  // Check srcset
  $('[srcset]').each((_, el) => {
    const srcset = $(el).attr('srcset');
    if (srcset && srcset.includes('http://')) {
      httpResources.push('srcset with http://');
    }
  });

  const totalHttpIssues = httpResources.length;

  if (totalHttpIssues > 0) {
    const details = httpResources.slice(0, 5).join(', ');

    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${totalHttpIssues} ressource(s) HTTP sur page HTTPS (mixed content)`,
      'Remplacez toutes les URLs http:// par https:// pour éviter les avertissements de sécurité.',
      details + (totalHttpIssues > 5 ? ` et ${totalHttpIssues - 5} autres...` : '')
    );
  }

  if (httpLinks.length > 10) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${httpLinks.length} liens sortants HTTP détectés`,
      'Envisagez de mettre à jour les liens vers HTTPS quand disponible.',
      `${httpLinks.length} liens http:// vers des sites externes`
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Aucun contenu mixte HTTP/HTTPS détecté',
    'Toutes les ressources sont chargées via HTTPS'
  );
}
