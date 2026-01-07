import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

interface InternalLink {
  href: string;
  text: string;
  isNofollow: boolean;
  isInNav: boolean;
  isInFooter: boolean;
  isInContent: boolean;
}

function extractInternalLinks(context: AuditContext): InternalLink[] {
  const { $, domain } = context;
  const links: InternalLink[] = [];
  const domainUrl = new URL(domain);

  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';

    // Skip non-navigable links
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    try {
      const linkUrl = new URL(href, domain);

      // Check if internal
      if (linkUrl.origin !== domainUrl.origin) {
        return;
      }

      const rel = $el.attr('rel') || '';
      const isNofollow = rel.toLowerCase().includes('nofollow');

      // Check link location
      const isInNav = $el.closest('nav, header, [role="navigation"]').length > 0;
      const isInFooter = $el.closest('footer, [role="contentinfo"]').length > 0;
      const isInContent = !isInNav && !isInFooter;

      links.push({
        href: linkUrl.pathname + linkUrl.search,
        text: $el.text().trim(),
        isNofollow,
        isInNav,
        isInFooter,
        isInContent,
      });
    } catch {
      // Invalid URL
    }
  });

  return links;
}

// Check #32: Liens internes spam
export function analyzeInternalLinksSpam(context: AuditContext): CheckResult {
  const CHECK_ID = 32;
  const CHECK_NAME = 'Liens internes spam';
  const CATEGORY = 'content';

  const links = extractInternalLinks(context);
  const contentLinks = links.filter(l => l.isInContent);

  if (contentLinks.length === 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun lien interne dans le contenu principal',
      'Ajoutez des liens internes contextuels dans votre contenu pour améliorer le maillage interne.'
    );
  }

  // Check for duplicate links to same destination
  const linksByHref = new Map<string, number>();
  contentLinks.forEach(link => {
    linksByHref.set(link.href, (linksByHref.get(link.href) || 0) + 1);
  });

  const duplicateLinks = Array.from(linksByHref.entries())
    .filter(([, count]) => count > 3)
    .map(([href, count]) => `${href} (${count}x)`);

  // Check link density
  const { $ } = context;
  const contentText = $('main, article, .content, #content').text() || $('body').text();
  const wordCount = (contentText.match(/[\wÀ-ÿ]+/g) || []).length;
  const linkDensity = wordCount > 0 ? contentLinks.length / (wordCount / 100) : 0;

  const issues: string[] = [];

  if (duplicateLinks.length > 0) {
    issues.push(`Liens répétés: ${duplicateLinks.slice(0, 3).join(', ')}`);
  }

  if (linkDensity > 5) {
    issues.push(`Densité de liens élevée: ${linkDensity.toFixed(1)} liens/100 mots`);
  }

  if (contentLinks.length > 100) {
    issues.push(`Trop de liens internes: ${contentLinks.length}`);
  }

  const details = `${contentLinks.length} liens internes dans le contenu, ${linkDensity.toFixed(1)} liens/100 mots`;

  if (issues.length > 1 || linkDensity > 10) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Risque de liens internes spam',
      issues.join('. ') + '. Réduisez le nombre de liens ou améliorez leur pertinence.',
      details
    );
  }

  if (issues.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Liens internes à optimiser',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Bonne utilisation des liens internes',
    details
  );
}

// Check #35: Pages orphelines (from this page's perspective)
export function analyzeOrphanRisk(context: AuditContext): CheckResult {
  const CHECK_ID = 35;
  const CHECK_NAME = 'Pages orphelines';
  const CATEGORY = 'content';

  const links = extractInternalLinks(context);
  const { sitemapData } = context;

  // This check analyzes if the current page might be orphan or contribute to orphan pages
  const uniqueLinkedPages = new Set(links.map(l => l.href.split('?')[0]));
  const contentLinks = links.filter(l => l.isInContent);
  const navLinks = links.filter(l => l.isInNav);

  // If page has no outbound internal links, it's a dead end
  if (uniqueLinkedPages.size === 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Page sans liens internes sortants (cul-de-sac)',
      'Ajoutez des liens vers d\'autres pages de votre site pour améliorer le maillage interne.'
    );
  }

  // Check if page links to a reasonable portion of the sitemap
  if (sitemapData.exists && sitemapData.urls.length > 0) {
    const sitemapUrls = new Set(sitemapData.urls.map(u => {
      try {
        return new URL(u).pathname;
      } catch {
        return u;
      }
    }));

    const linkedToSitemap = Array.from(uniqueLinkedPages).filter(p => sitemapUrls.has(p)).length;
    const linkCoverage = linkedToSitemap / Math.min(sitemapUrls.size, 50);

    if (linkCoverage < 0.05 && sitemapUrls.size > 20) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Faible couverture du maillage interne',
        'Cette page ne lie que vers peu de pages du sitemap. Améliorez le maillage interne.',
        `${linkedToSitemap} pages liées sur ${sitemapUrls.size} dans le sitemap`
      );
    }
  }

  // Good internal linking
  const details = `${uniqueLinkedPages.size} pages uniques liées (${navLinks.length} navigation, ${contentLinks.length} contenu)`;

  if (contentLinks.length === 0 && navLinks.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Liens internes uniquement dans la navigation',
      'Ajoutez des liens contextuels dans le contenu pour un meilleur maillage.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Bon maillage interne depuis cette page',
    details
  );
}

// Check #41: Liens nofollow internes
export function analyzeInternalNofollow(context: AuditContext): CheckResult {
  const CHECK_ID = 41;
  const CHECK_NAME = 'Liens nofollow internes';
  const CATEGORY = 'navigation';

  const links = extractInternalLinks(context);
  const nofollowLinks = links.filter(l => l.isNofollow);

  if (nofollowLinks.length === 0) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun lien interne nofollow détecté',
      `${links.length} liens internes analysés, tous en dofollow`
    );
  }

  const nofollowRatio = nofollowLinks.length / links.length;
  const nofollowUrls = nofollowLinks.slice(0, 5).map(l => l.href);

  const details = `${nofollowLinks.length}/${links.length} liens internes en nofollow`;

  // A few nofollow internal links might be intentional (login, cart, etc.)
  const acceptableNofollowPaths = ['/login', '/signin', '/cart', '/panier', '/checkout', '/compte', '/account', '/search'];
  const legitimateNofollow = nofollowLinks.filter(l =>
    acceptableNofollowPaths.some(path => l.href.includes(path))
  ).length;

  if (nofollowRatio > 0.3) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Trop de liens internes en nofollow',
      'Les liens internes devraient généralement être en dofollow pour transmettre le PageRank.',
      details + `. Exemples: ${nofollowUrls.join(', ')}`
    );
  }

  if (nofollowLinks.length > legitimateNofollow + 2) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Liens internes nofollow détectés',
      'Vérifiez si ces nofollow sont intentionnels. Les liens internes devraient généralement être dofollow.',
      details + `. URLs: ${nofollowUrls.join(', ')}`
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Utilisation appropriée des nofollow internes',
    details + ' (probablement intentionnel pour login/panier)'
  );
}
