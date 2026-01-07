import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail, notApplicable } from './types';

const CHECK_ID = 8;
const CHECK_NAME = 'Profondeur de clic';
const CATEGORY = 'content';

export function analyzeClickDepth(context: AuditContext): CheckResult {
  const { pageData, domain } = context;
  const currentUrl = pageData.finalUrl;

  // Calculate depth from URL structure
  let path: string;
  try {
    path = new URL(currentUrl).pathname;
  } catch {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'URL invalide',
      'Impossible d\'analyser la profondeur de l\'URL.'
    );
  }

  // Home page
  if (path === '/' || path === '') {
    return notApplicable(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Page d\'accueil - profondeur 0.'
    );
  }

  // Count path segments (excluding empty ones and file extensions)
  const segments = path
    .split('/')
    .filter(s => s.length > 0)
    .filter(s => !s.includes('.')); // Remove file extensions like .html

  const urlDepth = segments.length;

  // Analyze breadcrumb for actual navigation depth
  const { $ } = context;
  let breadcrumbDepth = 0;

  // Check JSON-LD breadcrumb
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '');
      const schemas = Array.isArray(json) ? json : [json];

      for (const schema of schemas) {
        let breadcrumbList = null;

        if (schema['@type'] === 'BreadcrumbList') {
          breadcrumbList = schema;
        } else if (schema['@graph']) {
          breadcrumbList = schema['@graph'].find((s: { '@type': string }) => s['@type'] === 'BreadcrumbList');
        }

        if (breadcrumbList?.itemListElement) {
          breadcrumbDepth = Math.max(breadcrumbDepth, breadcrumbList.itemListElement.length - 1);
        }
      }
    } catch {
      // Invalid JSON
    }
  });

  // Also check HTML breadcrumb
  const htmlBreadcrumb = $('[class*="breadcrumb"] a, nav[aria-label*="breadcrumb"] a, [itemtype*="BreadcrumbList"] a');
  if (htmlBreadcrumb.length > 0) {
    breadcrumbDepth = Math.max(breadcrumbDepth, htmlBreadcrumb.length);
  }

  // Use the higher of the two as estimated depth
  const estimatedDepth = Math.max(urlDepth, breadcrumbDepth);

  // Check for navigation links that might indicate true click depth
  const navLinks = $('nav a, header a, [role="navigation"] a').length;
  const hasMainNav = navLinks > 3;

  const details = [
    `Profondeur URL: ${urlDepth} niveau(x)`,
    breadcrumbDepth > 0 ? `Fil d'Ariane: ${breadcrumbDepth} niveau(x)` : '',
    `Chemin: ${path}`,
  ].filter(Boolean).join('. ');

  // Evaluate depth
  if (estimatedDepth > 4) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Profondeur excessive: ${estimatedDepth} clics depuis l'accueil`,
      'Les pages importantes devraient être accessibles en 3 clics maximum. Restructurez votre navigation.',
      details
    );
  }

  if (estimatedDepth > 3) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Profondeur élevée: ${estimatedDepth} clics depuis l'accueil`,
      'Idéalement, les pages devraient être accessibles en 3 clics ou moins.',
      details
    );
  }

  if (estimatedDepth === 0) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Page accessible directement (niveau 1)',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    `Bonne profondeur: ${estimatedDepth} clic(s) depuis l'accueil`,
    details
  );
}
