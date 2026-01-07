import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, notApplicable } from './types';

const CHECK_ID = 28;
const CHECK_NAME = 'Liens internationaux';
const CATEGORY = 'international';

export function analyzeIntlLinking(context: AuditContext): CheckResult {
  const { $ } = context;

  // Find all hreflang tags to determine if site is multilingual
  const hreflangTags = $('link[rel="alternate"][hreflang]');

  if (hreflangTags.length === 0) {
    return notApplicable(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Non applicable - aucune version linguistique alternative détectée.'
    );
  }

  // Collect alternate URLs
  const alternateUrls: { lang: string; url: string }[] = [];

  hreflangTags.each((_, el) => {
    const hreflang = $(el).attr('hreflang');
    const href = $(el).attr('href');
    if (hreflang && href && hreflang !== 'x-default') {
      alternateUrls.push({ lang: hreflang, url: href });
    }
  });

  if (alternateUrls.length === 0) {
    return notApplicable(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Non applicable - aucune version linguistique alternative détectée.'
    );
  }

  // Check for language switcher in the page
  const languageSwitcherPatterns = [
    '[class*="language"]',
    '[class*="lang-"]',
    '[class*="locale"]',
    '[id*="language"]',
    '[id*="lang-"]',
    '[aria-label*="language"]',
    '[aria-label*="langue"]',
    'select[name*="lang"]',
    '.lang-switcher',
    '.language-selector',
    '#language-menu',
  ];

  let hasLanguageSwitcher = false;
  for (const pattern of languageSwitcherPatterns) {
    if ($(pattern).length > 0) {
      hasLanguageSwitcher = true;
      break;
    }
  }

  // Check if alternate URLs are linked in the content
  const pageLinks = $('a[href]').map((_, el) => $(el).attr('href')).get();
  const linkedAlternates = alternateUrls.filter(alt =>
    pageLinks.some(link => link && (link === alt.url || link.includes(alt.url)))
  );

  const details = `${alternateUrls.length} versions linguistiques déclarées: ${alternateUrls.map(a => a.lang).join(', ')}`;

  if (!hasLanguageSwitcher && linkedAlternates.length === 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Versions alternatives déclarées mais non liées dans la page',
      'Ajoutez un sélecteur de langue visible pour permettre aux utilisateurs de changer de version.',
      details
    );
  }

  if (hasLanguageSwitcher) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Sélecteur de langue détecté avec versions alternatives correctement déclarées',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Liens vers les versions linguistiques alternatives présents',
    `${linkedAlternates.length}/${alternateUrls.length} versions liées. ${details}`
  );
}
