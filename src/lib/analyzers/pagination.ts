import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail, notApplicable } from './types';

const CHECK_ID = 38;
const CHECK_NAME = 'Pagination';
const CATEGORY = 'navigation';

export function analyzePagination(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  // Detect if page has pagination
  const paginationPatterns = [
    '[class*="pagination"]',
    '[class*="pager"]',
    '[role="navigation"][aria-label*="pagination"]',
    'nav[aria-label*="pagination"]',
    '.page-numbers',
    '.paginate',
    '[class*="page-nav"]',
  ];

  let hasPaginationElement = false;
  let paginationElement: ReturnType<typeof $> | null = null;

  for (const pattern of paginationPatterns) {
    const element = $(pattern);
    if (element.length > 0) {
      hasPaginationElement = true;
      paginationElement = element.first();
      break;
    }
  }

  // Check for rel="prev" and rel="next"
  const relPrev = $('link[rel="prev"]');
  const relNext = $('link[rel="next"]');
  const hasRelPrevNext = relPrev.length > 0 || relNext.length > 0;

  // Check URL for pagination indicators
  const url = pageData.finalUrl;
  const urlHasPagination = /[?&](page|p|paged|offset)=\d+|\/page\/\d+|\/p\/\d+/i.test(url);

  // Check for "load more" or infinite scroll indicators
  const hasLoadMore = $('[class*="load-more"], [class*="loadmore"], button:contains("Charger plus"), button:contains("Load more"), [class*="infinite"]').length > 0;

  // If no pagination detected, might not be applicable
  if (!hasPaginationElement && !hasRelPrevNext && !urlHasPagination && !hasLoadMore) {
    return notApplicable(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune pagination détectée sur cette page.'
    );
  }

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Check rel="prev"/"next" implementation
  if (hasPaginationElement || urlHasPagination) {
    if (hasRelPrevNext) {
      goodPractices.push('rel="prev/next" présent');

      // Validate URLs
      const prevHref = relPrev.attr('href');
      const nextHref = relNext.attr('href');

      if (prevHref) {
        try {
          new URL(prevHref, url);
        } catch {
          issues.push('URL rel="prev" invalide');
        }
      }

      if (nextHref) {
        try {
          new URL(nextHref, url);
        } catch {
          issues.push('URL rel="next" invalide');
        }
      }
    } else {
      issues.push('rel="prev/next" manquant');
    }
  }

  // Check pagination links accessibility
  if (paginationElement) {
    const paginationLinks = paginationElement.find('a');
    const totalPagLinks = paginationLinks.length;

    // Check for aria-current on current page
    const hasAriaCurrent = paginationElement.find('[aria-current]').length > 0;
    const hasActiveClass = paginationElement.find('.active, .current, [class*="active"]').length > 0;

    if (!hasAriaCurrent && hasActiveClass) {
      issues.push('Page active sans aria-current');
    } else if (hasAriaCurrent) {
      goodPractices.push('aria-current pour la page active');
    }

    // Check if pagination links are proper <a> tags with href
    let properLinks = 0;
    let jsLinks = 0;

    paginationLinks.each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        properLinks++;
      } else {
        jsLinks++;
      }
    });

    if (jsLinks > 0 && jsLinks >= properLinks) {
      issues.push(`${jsLinks} liens de pagination sans href valide`);
    }

    if (totalPagLinks > 0 && properLinks === totalPagLinks) {
      goodPractices.push('Liens de pagination avec href');
    }
  }

  // Check for infinite scroll issues
  if (hasLoadMore) {
    const hasLoadMoreLinks = $('a[class*="load-more"], a[class*="loadmore"]').length > 0;
    if (!hasLoadMoreLinks) {
      issues.push('"Charger plus" sans liens crawlables - le contenu pourrait ne pas être indexé');
    } else {
      goodPractices.push('Bouton "Charger plus" avec liens');
    }
  }

  // Check canonical on paginated pages
  const canonical = $('link[rel="canonical"]').attr('href');
  if (urlHasPagination && canonical) {
    const canonicalHasPage = /[?&](page|p|paged|offset)=\d+|\/page\/\d+/i.test(canonical);
    if (!canonicalHasPage && canonical !== url) {
      issues.push('Canonical pointe vers page 1 (peut consolider le contenu paginé)');
    }
  }

  // Build details
  const details = [
    hasPaginationElement ? 'Élément pagination détecté' : '',
    hasRelPrevNext ? 'rel prev/next présent' : '',
    hasLoadMore ? 'Chargement infini/load more' : '',
    urlHasPagination ? 'Page paginée' : '',
    goodPractices.length > 0 ? goodPractices.join(', ') : '',
  ].filter(Boolean).join('. ');

  // Evaluate
  if (issues.length >= 3 || (hasLoadMore && !hasRelPrevNext && issues.length > 0)) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Pagination mal implémentée pour le SEO',
      issues.join('. ') + '. Assurez-vous que toutes les pages sont crawlables.',
      details
    );
  }

  if (issues.length >= 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Pagination à améliorer',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Pagination bien implémentée',
    details
  );
}
