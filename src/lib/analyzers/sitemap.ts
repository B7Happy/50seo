import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 42;
const CHECK_NAME = 'Sitemap XML';
const CATEGORY = 'technical';

export function analyzeSitemap(context: AuditContext): CheckResult {
  const { sitemapData, robotsData, domain } = context;

  if (!sitemapData.exists) {
    // Check if sitemap is declared in robots.txt but not found
    if (robotsData.sitemaps.length > 0) {
      return fail(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Sitemap déclaré dans robots.txt mais non accessible',
        `Vérifiez que le sitemap est accessible à l'URL: ${robotsData.sitemaps[0]}`,
        `URL(s) testée(s): ${robotsData.sitemaps.join(', ')}`
      );
    }

    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun sitemap.xml trouvé',
      'Créez un sitemap.xml et déclarez-le dans robots.txt et Google Search Console.',
      `URL testée: ${domain}/sitemap.xml`
    );
  }

  const issues: string[] = [];
  const warnings: string[] = [];

  if (sitemapData.isSitemapIndex) {
    // It's a sitemap index
    const childCount = sitemapData.childSitemaps?.length || 0;

    if (childCount === 0) {
      issues.push('Index de sitemap vide');
    } else if (childCount > 500) {
      warnings.push(`Index contient ${childCount} sitemaps (beaucoup)`);
    }

    const details = `Index de sitemap avec ${childCount} sitemap(s) enfant(s)`;

    if (issues.length > 0) {
      return fail(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Problèmes avec l\'index de sitemap',
        issues.join('. '),
        details
      );
    }

    if (warnings.length > 0) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Index de sitemap présent avec avertissement(s)',
        warnings.join('. '),
        details
      );
    }

    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Index de sitemap correctement configuré',
      details
    );
  }

  // Regular sitemap
  const urlCount = sitemapData.urls.length;

  if (urlCount === 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Sitemap vide (aucune URL)',
      'Ajoutez des URLs à votre sitemap.',
      `URL: ${sitemapData.url}`
    );
  }

  if (urlCount > 50000) {
    issues.push(`Sitemap contient ${urlCount} URLs (max recommandé: 50,000)`);
  }

  // Check if sitemap is declared in robots.txt
  const isDeclaredInRobots = robotsData.sitemaps.some(s =>
    s === sitemapData.url || s.includes('sitemap')
  );

  if (!isDeclaredInRobots) {
    warnings.push('Sitemap non déclaré dans robots.txt');
  }

  // Check lastmod presence
  if (!sitemapData.lastmod) {
    warnings.push('Pas de balise lastmod détectée');
  }

  const details = [
    `${urlCount} URL(s)`,
    sitemapData.lastmod ? `Dernière modification: ${sitemapData.lastmod}` : 'Pas de lastmod',
    isDeclaredInRobots ? 'Déclaré dans robots.txt' : 'Non déclaré dans robots.txt',
  ].join('. ');

  if (issues.length > 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Problèmes avec le sitemap',
      issues.join('. '),
      details
    );
  }

  if (warnings.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Sitemap présent avec ${warnings.length} avertissement(s)`,
      warnings.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Sitemap XML correctement configuré',
    details
  );
}
