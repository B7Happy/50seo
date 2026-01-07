import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 49;
const CHECK_NAME = 'Robots.txt';
const CATEGORY = 'technical';

export function analyzeRobots(context: AuditContext): CheckResult {
  const { robotsData, domain } = context;

  if (!robotsData.exists) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun fichier robots.txt trouvé',
      'Créez un fichier robots.txt pour contrôler l\'exploration de votre site par les moteurs de recherche.',
      `URL testée: ${domain}/robots.txt`
    );
  }

  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for sitemap declaration
  if (robotsData.sitemaps.length === 0) {
    warnings.push('Aucun sitemap déclaré dans robots.txt');
  }

  // Check for wildcard user-agent
  const hasWildcardAgent = robotsData.rules.some(rule => rule.userAgent === '*');
  if (!hasWildcardAgent) {
    warnings.push('Pas de règle pour User-agent: * (tous les robots)');
  }

  // Check for overly restrictive rules
  const wildcardRule = robotsData.rules.find(rule => rule.userAgent === '*');
  if (wildcardRule) {
    // Check if disallowing everything
    if (wildcardRule.disallow.includes('/')) {
      issues.push('Disallow: / bloque l\'intégralité du site');
    }

    // Check for common problematic patterns
    const problematicPatterns = ['/wp-admin', '/admin', '/cart', '/checkout', '/account'];
    const disallowedPaths = wildcardRule.disallow;

    // Check if important paths are blocked
    if (disallowedPaths.some(p => p === '/wp-content/uploads')) {
      warnings.push('/wp-content/uploads bloqué - les images ne seront pas indexées');
    }
  }

  // Check for Googlebot-specific rules
  const googlebotRule = robotsData.rules.find(rule =>
    rule.userAgent.toLowerCase().includes('googlebot')
  );
  if (googlebotRule && googlebotRule.disallow.length > 0) {
    warnings.push(`Règles spécifiques pour Googlebot: ${googlebotRule.disallow.length} chemins bloqués`);
  }

  // Build details
  const details = [
    `${robotsData.rules.length} règle(s) User-agent`,
    `${robotsData.sitemaps.length} sitemap(s) déclaré(s)`,
  ];

  if (robotsData.sitemaps.length > 0) {
    details.push(`Sitemaps: ${robotsData.sitemaps.join(', ')}`);
  }

  if (issues.length > 0) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Problèmes critiques dans robots.txt`,
      issues.join('. '),
      details.join('. ')
    );
  }

  if (warnings.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `robots.txt présent avec ${warnings.length} avertissement(s)`,
      warnings.join('. '),
      details.join('. ')
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'robots.txt correctement configuré',
    details.join('. ')
  );
}
