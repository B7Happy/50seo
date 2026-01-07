import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 4;
const CHECK_NAME = 'HTTPS actif';
const CATEGORY = 'technical';

export function analyzeHttps(context: AuditContext): CheckResult {
  const { url, pageData } = context;

  const isHttps = url.startsWith('https://');
  const hstsHeader = pageData.headers['strict-transport-security'];

  if (!isHttps) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Le site n\'utilise pas HTTPS',
      'Migrez votre site vers HTTPS. C\'est un facteur de classement et essentiel pour la sécurité des utilisateurs.'
    );
  }

  if (!hstsHeader) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'HTTPS actif mais HSTS non configuré',
      'Ajoutez l\'en-tête Strict-Transport-Security pour forcer les connexions HTTPS et protéger contre les attaques MITM.',
      'Exemple: Strict-Transport-Security: max-age=31536000; includeSubDomains'
    );
  }

  // Parse HSTS header
  const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/i);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;
  const includesSubDomains = /includeSubDomains/i.test(hstsHeader);
  const hasPreload = /preload/i.test(hstsHeader);

  // Check if max-age is sufficient (at least 1 year = 31536000)
  if (maxAge < 31536000) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'HSTS configuré mais max-age trop court',
      'Augmentez max-age à au moins 31536000 (1 an) pour une protection optimale.',
      `HSTS actuel: ${hstsHeader}`
    );
  }

  const details = [
    `HSTS: ${hstsHeader}`,
    `max-age: ${maxAge} secondes`,
    includesSubDomains ? 'includeSubDomains: oui' : 'includeSubDomains: non',
    hasPreload ? 'preload: oui' : 'preload: non',
  ].join(', ');

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'HTTPS et HSTS correctement configurés',
    details
  );
}
