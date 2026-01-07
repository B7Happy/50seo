import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 40;
const CHECK_NAME = 'Page 404';
const CATEGORY = 'errors';

export async function analyze404Page(context: AuditContext): Promise<CheckResult> {
  const { domain } = context;

  // Test a random non-existent URL
  const testUrls = [
    `${domain}/this-page-does-not-exist-${Date.now()}`,
    `${domain}/404-test-page-xyz`,
  ];

  try {
    const testUrl = testUrls[0];
    const response = await fetch(testUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; 50SEO-Bot/1.0)',
      },
    });

    const statusCode = response.status;
    const html = await response.text();

    // Check status code
    if (statusCode !== 404) {
      if (statusCode === 200) {
        // Soft 404 - returns 200 but might be a 404 page
        const is404Content = /404|not found|page introuvable|n'existe pas|doesn't exist/i.test(html);

        if (is404Content) {
          return fail(
            CHECK_ID,
            CHECK_NAME,
            CATEGORY,
            'Soft 404 détecté (status 200 au lieu de 404)',
            'La page 404 retourne un status HTTP 200. Configurez votre serveur pour retourner un vrai code 404.',
            `URL testée: ${testUrl}, Status: ${statusCode}`
          );
        }

        return fail(
          CHECK_ID,
          CHECK_NAME,
          CATEGORY,
          'Pas de page 404 - les URLs inexistantes retournent 200',
          'Configurez une page 404 personnalisée avec le bon code de statut HTTP.',
          `URL testée: ${testUrl}, Status: ${statusCode}`
        );
      }

      if (statusCode >= 300 && statusCode < 400) {
        return warning(
          CHECK_ID,
          CHECK_NAME,
          CATEGORY,
          `Pages inexistantes redirigées (status ${statusCode})`,
          'Idéalement, les URLs inexistantes devraient retourner un code 404.',
          `URL testée: ${testUrl}`
        );
      }

      if (statusCode >= 500) {
        return fail(
          CHECK_ID,
          CHECK_NAME,
          CATEGORY,
          `Erreur serveur pour les pages inexistantes (status ${statusCode})`,
          'Le serveur retourne une erreur 500 au lieu de 404. Corrigez la configuration.',
          `URL testée: ${testUrl}`
        );
      }
    }

    // Analyze 404 page content
    const issues: string[] = [];
    const goodPractices: string[] = [];

    // Check if it's a custom 404 page
    const hasCustomContent = html.length > 500;
    const hasSearchForm = /search|recherche/i.test(html) && /<(input|form)/i.test(html);
    const hasHomeLink = /href=["']\/["']|href=["'][^"']*home/i.test(html);
    const hasHelpfulLinks = /<a[^>]+href/gi.test(html);
    const hasLogo = /<img[^>]+(logo|brand)/i.test(html);

    // Check for noindex on 404
    const hasNoindex = /noindex/i.test(html);

    if (!hasCustomContent) {
      issues.push('Page 404 générique/minimale');
    } else {
      goodPractices.push('Page 404 personnalisée');
    }

    if (hasSearchForm) {
      goodPractices.push('Recherche disponible');
    }

    if (hasHomeLink) {
      goodPractices.push('Lien vers l\'accueil');
    }

    const linkCount = html.match(/<a/g)?.length ?? 0;
    if (!hasHelpfulLinks || linkCount < 3) {
      issues.push('Peu de liens utiles sur la page 404');
    }

    if (!hasNoindex) {
      // 404 pages shouldn't typically be indexed, but the 404 status should handle it
      // This is more of a best practice
    }

    const details = [
      `Status: ${statusCode}`,
      goodPractices.length > 0 ? goodPractices.join(', ') : '',
      `Contenu: ${html.length} caractères`,
    ].filter(Boolean).join('. ');

    if (issues.length >= 2) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Page 404 fonctionnelle mais basique',
        issues.join('. ') + '. Améliorez l\'expérience utilisateur.',
        details
      );
    }

    if (issues.length === 1) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        'Page 404 correcte avec amélioration possible',
        issues[0],
        details
      );
    }

    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Page 404 bien configurée',
      details
    );
  } catch (error) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Impossible de tester la page 404',
      `Erreur: ${error instanceof Error ? error.message : 'Unknown'}. Vérifiez manuellement.`,
      `URL testée: ${testUrls[0]}`
    );
  }
}
