import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail, notApplicable } from './types';

const CHECK_ID = 11;
const CHECK_NAME = 'Navigation mega menu';
const CATEGORY = 'navigation';

export function analyzeMegaMenu(context: AuditContext): CheckResult {
  const { $, $raw } = context;

  // Detect navigation structure
  const nav = $('nav, header nav, [role="navigation"]');

  if (nav.length === 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune navigation <nav> détectée',
      'Utilisez la balise <nav> pour structurer votre navigation principale.'
    );
  }

  // Count links in navigation
  const navLinks = nav.find('a[href]');
  const totalNavLinks = navLinks.length;

  // Check for mega menu indicators
  const hasMegaMenu =
    nav.find('[class*="mega"], [class*="dropdown"], [class*="submenu"]').length > 0 ||
    nav.find('ul ul').length > 0;

  // Check nesting depth
  let maxDepth = 0;
  nav.find('ul').each((_, ul) => {
    let depth = 0;
    let parent = $(ul).parent();
    while (parent.length > 0 && parent.closest('nav').length > 0) {
      if (parent.is('ul')) depth++;
      parent = parent.parent();
    }
    maxDepth = Math.max(maxDepth, depth);
  });

  // Check for hidden navigation (common in mega menus)
  const hiddenNavItems = nav.find('[hidden], [style*="display: none"], [style*="visibility: hidden"], .hidden').length;

  // Check for ARIA attributes
  const hasAriaExpanded = nav.find('[aria-expanded]').length > 0;
  const hasAriaPopup = nav.find('[aria-haspopup]').length > 0;
  const hasProperAria = hasAriaExpanded || hasAriaPopup;

  // Check raw HTML for nav links (are they server-rendered?)
  const rawNavLinks = $raw('nav a[href], header a[href]').length;
  const jsRenderedNavLinks = totalNavLinks - rawNavLinks;

  // Check for keyboard accessibility indicators
  const hasFocusStyles = nav.find('[tabindex]').length > 0;

  // Build issues
  const issues: string[] = [];
  const goodPractices: string[] = [];

  if (totalNavLinks > 100) {
    issues.push(`Trop de liens dans la navigation: ${totalNavLinks}`);
  }

  if (maxDepth > 3) {
    issues.push(`Navigation trop profonde: ${maxDepth + 1} niveaux`);
  }

  if (jsRenderedNavLinks > totalNavLinks * 0.5) {
    issues.push(`${jsRenderedNavLinks} liens de navigation rendus par JS`);
  }

  if (hasMegaMenu && !hasProperAria) {
    issues.push('Mega menu sans attributs ARIA');
  }

  // Good practices
  if (hasProperAria) {
    goodPractices.push('Attributs ARIA présents');
  }

  if (rawNavLinks > 0 && jsRenderedNavLinks < totalNavLinks * 0.3) {
    goodPractices.push('Navigation principalement server-rendered');
  }

  // No mega menu detected
  if (!hasMegaMenu && totalNavLinks < 20) {
    return notApplicable(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Navigation simple détectée (pas de mega menu).'
    );
  }

  const details = [
    `${totalNavLinks} liens de navigation`,
    maxDepth > 0 ? `${maxDepth + 1} niveaux de profondeur` : '',
    hasMegaMenu ? 'Mega menu détecté' : '',
    goodPractices.length > 0 ? goodPractices.join(', ') : '',
  ].filter(Boolean).join('. ');

  // Evaluate
  if (issues.length >= 2 || totalNavLinks > 150) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Navigation complexe avec problèmes SEO',
      issues.join('. ') + '. Simplifiez la navigation et assurez le rendu côté serveur.',
      details
    );
  }

  if (issues.length >= 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Navigation à optimiser',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    hasMegaMenu ? 'Mega menu bien implémenté' : 'Navigation bien structurée',
    details
  );
}
