import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const VALID_LANG_CODES = new Set([
  'aa', 'ab', 'af', 'ak', 'sq', 'am', 'ar', 'an', 'hy', 'as', 'av', 'ae', 'ay', 'az',
  'ba', 'bm', 'eu', 'be', 'bn', 'bh', 'bi', 'bs', 'br', 'bg', 'my', 'ca', 'ch', 'ce',
  'zh', 'cu', 'cv', 'kw', 'co', 'cr', 'cs', 'da', 'dv', 'nl', 'dz', 'en', 'eo', 'et',
  'ee', 'fo', 'fj', 'fi', 'fr', 'fy', 'ff', 'ka', 'de', 'gd', 'ga', 'gl', 'gv', 'el',
  'gn', 'gu', 'ht', 'ha', 'he', 'hz', 'hi', 'ho', 'hr', 'hu', 'ig', 'is', 'io', 'ii',
  'iu', 'ie', 'ia', 'id', 'ik', 'it', 'jv', 'ja', 'kl', 'kn', 'ks', 'kr', 'kk', 'km',
  'ki', 'rw', 'ky', 'kv', 'kg', 'ko', 'kj', 'ku', 'lo', 'la', 'lv', 'li', 'ln', 'lt',
  'lb', 'lu', 'lg', 'mk', 'mh', 'ml', 'mi', 'mr', 'ms', 'mg', 'mt', 'mn', 'na', 'nv',
  'nr', 'nd', 'ng', 'ne', 'nn', 'nb', 'no', 'ny', 'oc', 'oj', 'or', 'om', 'os', 'pa',
  'fa', 'pi', 'pl', 'pt', 'ps', 'qu', 'rm', 'ro', 'rn', 'ru', 'sg', 'sa', 'si', 'sk',
  'sl', 'se', 'sm', 'sn', 'sd', 'so', 'st', 'es', 'sc', 'sr', 'ss', 'su', 'sw', 'sv',
  'ty', 'ta', 'tt', 'te', 'tg', 'tl', 'th', 'bo', 'ti', 'to', 'tn', 'ts', 'tk', 'tr',
  'tw', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'cy', 'wa', 'wo', 'xh', 'yi', 'yo',
  'za', 'zu'
]);

// Check #26: Attribut lang
export function analyzeLangAttribute(context: AuditContext): CheckResult {
  const CHECK_ID = 26;
  const CHECK_NAME = 'Attribut lang';
  const CATEGORY = 'international';

  const { $ } = context;
  const lang = $('html').attr('lang');

  if (!lang) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Attribut lang manquant sur la balise <html>',
      'Ajoutez l\'attribut lang à la balise <html> (ex: <html lang="fr">). Cela aide les moteurs de recherche et les lecteurs d\'écran.'
    );
  }

  // Extract base language code
  const baseLang = lang.split('-')[0].toLowerCase();

  if (!VALID_LANG_CODES.has(baseLang)) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Code langue non reconnu: ${lang}`,
      'Utilisez un code ISO 639-1 valide (ex: fr, en, de, es).',
      `Code détecté: ${lang}`
    );
  }

  // Check format (should be lowercase for language, uppercase for region)
  const isValidFormat = /^[a-z]{2}(-[A-Z]{2})?$/.test(lang);

  if (!isValidFormat && lang.includes('-')) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Format de l'attribut lang non standard: ${lang}`,
      'Utilisez le format standard: langue minuscule, région majuscule (ex: fr-FR, en-US).',
      `Format détecté: ${lang}`
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    `Attribut lang correctement défini: ${lang}`,
    `La balise <html> a l'attribut lang="${lang}"`
  );
}

// Check #27: Codes langue/pays
export function analyzeLanguageCodes(context: AuditContext): CheckResult {
  const CHECK_ID = 27;
  const CHECK_NAME = 'Codes langue/pays';
  const CATEGORY = 'international';

  const { $ } = context;

  // Collect all language codes from various sources
  const languageCodes: { source: string; code: string }[] = [];
  const issues: string[] = [];

  // Check html lang
  const htmlLang = $('html').attr('lang');
  if (htmlLang) {
    languageCodes.push({ source: 'html[lang]', code: htmlLang });
  }

  // Check Content-Language header
  const contentLanguage = context.pageData.headers['content-language'];
  if (contentLanguage) {
    languageCodes.push({ source: 'Content-Language header', code: contentLanguage });
  }

  // Check meta content-language
  const metaLang = $('meta[http-equiv="content-language"]').attr('content');
  if (metaLang) {
    languageCodes.push({ source: 'meta[content-language]', code: metaLang });
  }

  // Check hreflang tags
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    const hreflang = $(el).attr('hreflang');
    if (hreflang && hreflang !== 'x-default') {
      languageCodes.push({ source: 'hreflang', code: hreflang });
    }
  });

  if (languageCodes.length === 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun code langue détecté',
      'Définissez au minimum l\'attribut lang sur la balise <html>.'
    );
  }

  // Validate all codes
  for (const { source, code } of languageCodes) {
    const baseLang = code.split('-')[0].toLowerCase();
    if (!VALID_LANG_CODES.has(baseLang)) {
      issues.push(`${source}: code invalide "${code}"`);
    }
  }

  // Check consistency between html lang and Content-Language
  if (htmlLang && contentLanguage) {
    const htmlBase = htmlLang.split('-')[0].toLowerCase();
    const headerBase = contentLanguage.split('-')[0].toLowerCase();
    if (htmlBase !== headerBase) {
      issues.push(`Incohérence: html lang="${htmlLang}" vs Content-Language="${contentLanguage}"`);
    }
  }

  const details = languageCodes.map(lc => `${lc.source}: ${lc.code}`).join(', ');

  if (issues.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Problèmes détectés avec les codes langue`,
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Codes langue/pays correctement configurés',
    details
  );
}
