import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail, notApplicable } from './types';

const CHECK_ID = 1;
const CHECK_NAME = 'Balises hreflang';
const CATEGORY = 'international';

export function analyzeHreflang(context: AuditContext): CheckResult {
  const { $ } = context;

  // Find all hreflang tags
  const hreflangTags = $('link[rel="alternate"][hreflang]');
  const hreflangCount = hreflangTags.length;

  if (hreflangCount === 0) {
    // Check if page has lang attribute to determine if international SEO is relevant
    const pageLang = $('html').attr('lang');

    if (!pageLang) {
      return notApplicable(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Aucune balise hreflang détectée. Non applicable si le site est monolingue.'
      );
    }

    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune balise hreflang trouvée',
      'Si votre site cible plusieurs langues ou régions, ajoutez des balises hreflang pour indiquer les versions alternatives.'
    );
  }

  // Validate hreflang tags
  const issues: string[] = [];
  const languages = new Set<string>();
  let hasSelfReference = false;
  let hasXDefault = false;

  hreflangTags.each((_, el) => {
    const hreflang = $(el).attr('hreflang');
    const href = $(el).attr('href');

    if (!hreflang || !href) {
      issues.push('Balise hreflang avec attributs manquants');
      return;
    }

    languages.add(hreflang);

    // Check for x-default
    if (hreflang === 'x-default') {
      hasXDefault = true;
    }

    // Validate language code format
    const validLangFormat = /^[a-z]{2}(-[A-Z]{2})?$|^x-default$/.test(hreflang);
    if (!validLangFormat) {
      issues.push(`Code langue invalide: ${hreflang}`);
    }

    // Check for self-reference
    const currentUrl = context.pageData.finalUrl || context.url;
    if (href === currentUrl || href === context.url) {
      hasSelfReference = true;
    }

    // Validate URL format
    try {
      new URL(href);
    } catch {
      issues.push(`URL invalide: ${href}`);
    }
  });

  // Build details
  const details = `${hreflangCount} balises hreflang trouvées pour ${languages.size} langues: ${Array.from(languages).join(', ')}`;

  if (issues.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Balises hreflang présentes mais avec ${issues.length} problème(s)`,
      issues.join('. '),
      details
    );
  }

  if (!hasSelfReference) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Balises hreflang présentes mais sans auto-référence',
      'Ajoutez une balise hreflang pointant vers la page actuelle.',
      details
    );
  }

  if (!hasXDefault && languages.size > 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Balises hreflang présentes mais sans x-default',
      'Ajoutez une balise hreflang avec x-default pour les utilisateurs dont la langue n\'est pas ciblée.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Balises hreflang correctement implémentées',
    details
  );
}
