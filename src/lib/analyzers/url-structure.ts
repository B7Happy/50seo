import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 23;
const CHECK_NAME = 'Structure URL SEO-friendly';
const CATEGORY = 'technical';

export function analyzeUrlStructure(context: AuditContext): CheckResult {
  const { pageData } = context;
  const url = pageData.finalUrl;

  const issues: string[] = [];
  const warnings: string[] = [];

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'URL invalide',
      'L\'URL analysée n\'est pas valide.'
    );
  }

  const path = parsedUrl.pathname;
  const params = parsedUrl.search;

  // Check URL length
  if (url.length > 2048) {
    issues.push('URL trop longue (> 2048 caractères)');
  } else if (url.length > 100) {
    warnings.push(`URL assez longue (${url.length} caractères)`);
  }

  // Check path depth
  const pathSegments = path.split('/').filter(s => s.length > 0);
  if (pathSegments.length > 5) {
    warnings.push(`Profondeur URL élevée (${pathSegments.length} niveaux)`);
  }

  // Check for uppercase letters
  if (path !== path.toLowerCase()) {
    warnings.push('URL contient des majuscules (préférez les minuscules)');
  }

  // Check for underscores (should use hyphens)
  if (path.includes('_')) {
    warnings.push('URL contient des underscores (préférez les tirets)');
  }

  // Check for special characters
  const specialChars = path.match(/[^a-zA-Z0-9\-_\/\.]/g);
  if (specialChars && specialChars.length > 0) {
    const uniqueChars = [...new Set(specialChars)];
    warnings.push(`Caractères spéciaux détectés: ${uniqueChars.join(', ')}`);
  }

  // Check for double slashes
  if (path.includes('//')) {
    issues.push('Double slash dans l\'URL');
  }

  // Check for file extensions that might indicate non-SEO URLs
  const problematicExtensions = ['.php', '.asp', '.aspx', '.jsp', '.cgi'];
  for (const ext of problematicExtensions) {
    if (path.toLowerCase().endsWith(ext)) {
      warnings.push(`Extension ${ext} visible dans l'URL`);
      break;
    }
  }

  // Check for IDs in URL
  const idPatterns = [
    /\/\d+\/?$/, // ends with number
    /[?&]id=\d+/, // query param id
    /\/p\/\d+/, // /p/123
    /\/product\/\d+/, // /product/123
  ];

  for (const pattern of idPatterns) {
    if (pattern.test(url)) {
      warnings.push('URL semble contenir un ID numérique (préférez des slugs descriptifs)');
      break;
    }
  }

  // Check for excessive query parameters
  const paramCount = parsedUrl.searchParams.size;
  if (paramCount > 3) {
    warnings.push(`${paramCount} paramètres URL (beaucoup de paramètres peuvent diluer la valeur SEO)`);
  }

  // Check for session IDs in URL
  const sessionPatterns = ['sessionid', 'phpsessid', 'jsessionid', 'sid=', 'session='];
  for (const pattern of sessionPatterns) {
    if (url.toLowerCase().includes(pattern)) {
      issues.push('ID de session dans l\'URL (problème SEO majeur)');
      break;
    }
  }

  // Check for stop words in URL segments
  const stopWords = ['and', 'or', 'but', 'the', 'a', 'an', 'of', 'to', 'for', 'le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou'];
  const segmentWords = pathSegments.flatMap(s => s.split('-'));
  const foundStopWords = segmentWords.filter(w => stopWords.includes(w.toLowerCase()));

  if (foundStopWords.length > 2) {
    warnings.push('URL contient plusieurs mots vides (stop words)');
  }

  // Build details
  const details = [
    `Longueur: ${url.length} caractères`,
    `Profondeur: ${pathSegments.length} niveau(x)`,
    paramCount > 0 ? `${paramCount} paramètre(s)` : 'Pas de paramètres',
  ].join('. ');

  if (issues.length > 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${issues.length} problème(s) de structure URL`,
      issues.join('. '),
      details
    );
  }

  if (warnings.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Structure URL avec ${warnings.length} point(s) d'amélioration`,
      warnings.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Structure URL SEO-friendly',
    details
  );
}
