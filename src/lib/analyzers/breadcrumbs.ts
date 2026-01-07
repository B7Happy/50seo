import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail, notApplicable } from './types';

const CHECK_ID = 3;
const CHECK_NAME = "Fil d'Ariane (Breadcrumbs)";
const CATEGORY = 'content';

export function analyzeBreadcrumbs(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  // Check if it's the homepage (breadcrumbs not needed)
  const path = new URL(pageData.finalUrl).pathname;
  if (path === '/' || path === '') {
    return notApplicable(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Page d\'accueil - fil d\'Ariane non nécessaire.'
    );
  }

  // Look for BreadcrumbList schema
  let hasBreadcrumbSchema = false;
  let breadcrumbItems: string[] = [];

  // Check JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '');
      const schemas = Array.isArray(json) ? json : [json];

      for (const schema of schemas) {
        if (schema['@type'] === 'BreadcrumbList' ||
            (schema['@graph'] && schema['@graph'].some((s: { '@type': string }) => s['@type'] === 'BreadcrumbList'))) {
          hasBreadcrumbSchema = true;

          // Extract items
          const list = schema['@type'] === 'BreadcrumbList' ? schema :
            schema['@graph']?.find((s: { '@type': string }) => s['@type'] === 'BreadcrumbList');

          if (list?.itemListElement) {
            breadcrumbItems = list.itemListElement.map((item: { name?: string; item?: { name?: string } }) =>
              item.name || item.item?.name || ''
            ).filter(Boolean);
          }
        }
      }
    } catch {
      // Invalid JSON
    }
  });

  // Look for breadcrumb HTML patterns
  const breadcrumbSelectors = [
    '[class*="breadcrumb"]',
    '[id*="breadcrumb"]',
    'nav[aria-label*="breadcrumb"]',
    'nav[aria-label*="fil"]',
    '[itemtype*="BreadcrumbList"]',
    '.breadcrumbs',
    '#breadcrumbs',
    '[role="navigation"][aria-label*="bread"]',
  ];

  let hasBreadcrumbHtml = false;
  let htmlBreadcrumbText = '';

  for (const selector of breadcrumbSelectors) {
    const element = $(selector).first();
    if (element.length > 0) {
      hasBreadcrumbHtml = true;
      htmlBreadcrumbText = element.text().trim().substring(0, 100);
      break;
    }
  }

  // Check for microdata breadcrumbs
  const microdataBreadcrumb = $('[itemtype="https://schema.org/BreadcrumbList"], [itemtype="http://schema.org/BreadcrumbList"]');
  if (microdataBreadcrumb.length > 0) {
    hasBreadcrumbSchema = true;
  }

  // Determine result
  if (hasBreadcrumbSchema && hasBreadcrumbHtml) {
    const details = breadcrumbItems.length > 0
      ? `${breadcrumbItems.length} niveau(x): ${breadcrumbItems.join(' > ')}`
      : htmlBreadcrumbText;

    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Fil d\'Ariane présent avec Schema BreadcrumbList',
      details
    );
  }

  if (hasBreadcrumbHtml && !hasBreadcrumbSchema) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Fil d\'Ariane présent mais sans Schema BreadcrumbList',
      'Ajoutez le balisage Schema.org BreadcrumbList pour améliorer l\'affichage dans les résultats de recherche.',
      htmlBreadcrumbText
    );
  }

  if (hasBreadcrumbSchema && !hasBreadcrumbHtml) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Schema BreadcrumbList présent mais pas de fil d\'Ariane visible',
      'Assurez-vous que le fil d\'Ariane est visible pour les utilisateurs.',
      breadcrumbItems.join(' > ')
    );
  }

  return fail(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Aucun fil d\'Ariane détecté',
    'Ajoutez un fil d\'Ariane avec balisage Schema.org pour améliorer la navigation et le SEO.'
  );
}
