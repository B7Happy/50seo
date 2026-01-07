import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

// Check #10: Liens JavaScript
export function analyzeJsLinks(context: AuditContext): CheckResult {
  const CHECK_ID = 10;
  const CHECK_NAME = 'Liens JavaScript';
  const CATEGORY = 'javascript';

  const { $, $raw } = context;

  // Count links in raw vs rendered HTML
  const rawLinks = new Set<string>();
  const renderedLinks = new Set<string>();

  $raw('a[href]').each((_, el) => {
    const href = $raw(el).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      rawLinks.add(href);
    }
  });

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      renderedLinks.add(href);
    }
  });

  // Find JS-only links
  const jsOnlyLinks = Array.from(renderedLinks).filter(link => !rawLinks.has(link));

  // Check for problematic link patterns
  const issues: string[] = [];

  // Check for javascript: href
  const jsHrefLinks = $('a[href^="javascript:"]').length;
  if (jsHrefLinks > 0) {
    issues.push(`${jsHrefLinks} lien(s) avec href="javascript:"`);
  }

  // Check for onclick without href
  const onclickNoHref = $('a[onclick]:not([href]), a[href="#"][onclick], a[href=""][onclick]').length;
  if (onclickNoHref > 0) {
    issues.push(`${onclickNoHref} lien(s) avec onclick sans href valide`);
  }

  // Check for SPA router links without proper href
  const routerLinks = $('a[routerlink], a[to], a[@click]').length;
  const routerLinksNoHref = $('a[routerlink]:not([href]), a[to]:not([href])').length;
  if (routerLinksNoHref > 0) {
    issues.push(`${routerLinksNoHref} lien(s) router sans href`);
  }

  // Check for button-like elements used as links
  const buttonLinks = $('button[onclick*="location"], button[onclick*="navigate"], div[onclick*="location"]').length;
  if (buttonLinks > 0) {
    issues.push(`${buttonLinks} élément(s) non-<a> utilisé(s) comme liens`);
  }

  // Details
  const details = [
    `${rawLinks.size} liens dans HTML initial`,
    `${renderedLinks.size} liens après JS`,
    jsOnlyLinks.length > 0 ? `${jsOnlyLinks.length} liens ajoutés par JS` : '',
  ].filter(Boolean).join('. ');

  // Evaluate
  if (issues.length >= 3 || jsHrefLinks > 5) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Problèmes majeurs avec les liens JavaScript',
      issues.join('. ') + '. Utilisez des balises <a> avec des href valides pour tous les liens.',
      details
    );
  }

  if (issues.length >= 1 || jsOnlyLinks.length > renderedLinks.size * 0.5) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Liens JavaScript à optimiser',
      issues.join('. ') || `${jsOnlyLinks.length} liens dépendent du JavaScript. Assurez-vous qu'ils sont crawlables.`,
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Liens bien implémentés pour le SEO',
    details
  );
}

// Check #47: Liens JS intelligents (smart JS links)
export function analyzeSmartJsLinks(context: AuditContext): CheckResult {
  const CHECK_ID = 47;
  const CHECK_NAME = 'Liens JS intelligents';
  const CATEGORY = 'javascript';

  const { $, domain } = context;

  let wellImplemented = 0;
  let poorlyImplemented = 0;
  const issues: string[] = [];

  // Check all links for proper implementation
  $('a').each((_, el) => {
    const $link = $(el);
    const href = $link.attr('href');
    const onclick = $link.attr('onclick');
    const dataHref = $link.attr('data-href') || $link.attr('data-url');

    // Good: has valid href
    if (href && !href.startsWith('#') && !href.startsWith('javascript:') && href !== '') {
      wellImplemented++;
      return;
    }

    // Check for data attributes with URLs
    if (dataHref) {
      try {
        new URL(dataHref, domain);
        // Has data-href but not href - could be progressive enhancement
        if (!href || href === '#') {
          poorlyImplemented++;
        }
      } catch {
        // Invalid URL
      }
    }

    // onclick navigation without href
    if (onclick && onclick.match(/location|navigate|router|history/i)) {
      poorlyImplemented++;
    }
  });

  // Check for event delegation patterns (harder to crawl)
  const hasEventDelegation = $('[data-action*="link"], [data-action*="navigate"]').length > 0;

  // Check for Next.js Link, Nuxt-link, router-link (good patterns)
  const hasFrameworkLinks = $('a[data-nlink], nuxt-link, router-link').length > 0;

  // Check for pushState usage indicators
  const scriptContent = $('script:not([src])').text();
  const hasPushState = scriptContent.includes('pushState') || scriptContent.includes('replaceState');

  const totalLinks = wellImplemented + poorlyImplemented;
  const goodRatio = totalLinks > 0 ? wellImplemented / totalLinks : 1;

  const details = [
    `${wellImplemented} liens bien implémentés`,
    `${poorlyImplemented} liens problématiques`,
    hasFrameworkLinks ? 'Framework SPA détecté' : '',
    hasPushState ? 'Navigation pushState utilisée' : '',
  ].filter(Boolean).join('. ');

  // Evaluate
  if (poorlyImplemented > 10 || goodRatio < 0.7) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Implémentation des liens JS non optimale pour le SEO',
      `${poorlyImplemented} liens sans href valide. Utilisez des <a href="..."> même avec JavaScript.`,
      details
    );
  }

  if (poorlyImplemented > 3 || goodRatio < 0.9) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Certains liens JS à améliorer',
      `${poorlyImplemented} liens pourraient être mieux implémentés. Ajoutez des href crawlables.`,
      details
    );
  }

  if (hasFrameworkLinks || (hasPushState && wellImplemented > 5)) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Liens JavaScript bien implémentés avec progressive enhancement',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Bonne implémentation des liens',
    details
  );
}
