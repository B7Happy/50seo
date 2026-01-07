import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 29;
const CHECK_NAME = 'Navigation mobile';
const CATEGORY = 'navigation';

export function analyzeMobileNav(context: AuditContext): CheckResult {
  const { $ } = context;

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Check for mobile-specific navigation patterns
  const mobileNavPatterns = [
    '[class*="mobile-nav"]',
    '[class*="mobile-menu"]',
    '[class*="hamburger"]',
    '[class*="burger"]',
    '[class*="nav-toggle"]',
    '[class*="menu-toggle"]',
    '[class*="off-canvas"]',
    '[class*="drawer"]',
    '[class*="sidebar-nav"]',
    '#mobile-nav',
    '#mobile-menu',
    '.mobile-navigation',
  ];

  let hasMobileNav = false;
  for (const pattern of mobileNavPatterns) {
    if ($(pattern).length > 0) {
      hasMobileNav = true;
      break;
    }
  }

  // Check for hamburger icon (common patterns)
  const hamburgerPatterns = [
    '[class*="hamburger"]',
    '[class*="burger"]',
    '[aria-label*="menu"]',
    'button[aria-expanded]',
    '[class*="menu-icon"]',
    '.fa-bars',
    '[class*="nav-icon"]',
  ];

  let hasHamburger = false;
  for (const pattern of hamburgerPatterns) {
    if ($(pattern).length > 0) {
      hasHamburger = true;
      break;
    }
  }

  // Check for viewport meta (essential for mobile)
  const viewport = $('meta[name="viewport"]').attr('content');
  const hasViewport = !!viewport;
  const hasProperViewport = viewport?.includes('width=device-width');

  if (!hasViewport) {
    issues.push('Meta viewport manquant');
  } else if (!hasProperViewport) {
    issues.push('Meta viewport mal configuré');
  } else {
    goodPractices.push('Meta viewport correct');
  }

  // Check for touch-friendly elements
  const touchTargets = $('a, button, [role="button"]');
  let smallTouchTargets = 0;

  touchTargets.each((_, el) => {
    const $el = $(el);
    // Check for explicit small sizes (rough heuristic)
    const style = $el.attr('style') || '';
    const className = $el.attr('class') || '';

    if (style.match(/font-size:\s*(\d+)px/) || className.includes('small') || className.includes('xs')) {
      // Might be small
      const fontSize = style.match(/font-size:\s*(\d+)px/);
      if (fontSize && parseInt(fontSize[1]) < 12) {
        smallTouchTargets++;
      }
    }
  });

  if (smallTouchTargets > 10) {
    issues.push(`${smallTouchTargets} éléments potentiellement trop petits pour le toucher`);
  }

  // Check for media queries (mobile responsiveness indicator)
  let hasMediaQueries = false;
  $('style').each((_, el) => {
    const css = $(el).html() || '';
    if (css.includes('@media')) {
      hasMediaQueries = true;
    }
  });

  // Check for responsive CSS classes (Tailwind, Bootstrap, etc.)
  const responsivePatterns = [
    /\b(sm|md|lg|xl|2xl):/,  // Tailwind
    /\b(col-xs|col-sm|col-md|col-lg)/,  // Bootstrap
    /\bd-(none|block|flex)/,  // Bootstrap display
    /\bhidden-(xs|sm|md|lg)/,  // Common pattern
  ];

  const bodyHtml = $('body').html() || '';
  const hasResponsiveClasses = responsivePatterns.some(p => p.test(bodyHtml));

  if (hasMediaQueries || hasResponsiveClasses) {
    goodPractices.push('CSS responsive détecté');
  }

  // Check for navigation in both desktop and mobile
  const desktopNav = $('nav:not([class*="mobile"]), header nav').find('a').length;
  const totalNav = $('nav a, header a').length;

  // Check for aria-hidden on mobile nav (should be toggleable)
  const hasAriaOnMobileNav = $(mobileNavPatterns.join(', ')).find('[aria-hidden]').length > 0 ||
                              $(mobileNavPatterns.join(', ')).filter('[aria-hidden]').length > 0;

  // Build details
  const details = [
    hasMobileNav || hasHamburger ? 'Navigation mobile détectée' : 'Pas de navigation mobile spécifique',
    hasViewport ? 'Viewport configuré' : '',
    hasMediaQueries || hasResponsiveClasses ? 'Site responsive' : '',
    `${totalNav} liens de navigation`,
  ].filter(Boolean).join('. ');

  // Evaluate
  if (!hasViewport) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Site non optimisé pour mobile',
      'Ajoutez <meta name="viewport" content="width=device-width, initial-scale=1">',
      details
    );
  }

  if (issues.length >= 2) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Navigation mobile à améliorer',
      issues.join('. '),
      details
    );
  }

  if (!hasMobileNav && !hasHamburger && desktopNav > 10) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Pas de navigation mobile dédiée détectée',
      'Avec ' + desktopNav + ' liens, envisagez une navigation mobile (hamburger menu).',
      details
    );
  }

  if (issues.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Navigation mobile partiellement optimisée',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Navigation mobile bien configurée',
    details
  );
}
