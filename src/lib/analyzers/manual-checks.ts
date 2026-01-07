import type { CheckResult } from '@/types/audit';
import { manual } from './types';

// These checks require manual review or access to external tools like Google Search Console

// Check #7: Analyse Crawl Stats
export function getAnalyzeCrawlStats(): CheckResult {
  return manual(
    7,
    'Analyse Crawl Stats',
    'analysis',
    'Nécessite l\'accès à Google Search Console',
    'Consultez Search Console > Paramètres > Statistiques d\'exploration pour analyser le comportement de Googlebot sur votre site.'
  );
}

// Check #13: Paramètres URL
export function getUrlParameters(): CheckResult {
  return manual(
    13,
    'Paramètres URL',
    'analysis',
    'Vérification manuelle recommandée',
    'Analysez vos paramètres URL dans Search Console et configurez leur traitement. Utilisez le rapport de couverture pour identifier les problèmes.'
  );
}

// Check #16: Recherche interne
export function getInternalSearch(): CheckResult {
  return manual(
    16,
    'Recherche interne',
    'analysis',
    'Configuration manuelle requise',
    'Vérifiez que vos pages de recherche interne sont en noindex ou que les paramètres de recherche sont correctement gérés dans Search Console.'
  );
}

// Check #17: Rapport Coverage
export function getCoverageReport(): CheckResult {
  return manual(
    17,
    'Rapport Coverage',
    'analysis',
    'Nécessite l\'accès à Google Search Console',
    'Consultez Search Console > Indexation > Pages pour identifier les erreurs d\'indexation, les pages exclues et les avertissements.'
  );
}

// Check #31: Performance utilisateur réel
export function getRealUserPerformance(): CheckResult {
  return manual(
    31,
    'Performance utilisateur réel',
    'performance',
    'Nécessite des données de terrain (RUM)',
    'Utilisez Chrome UX Report, PageSpeed Insights ou votre propre solution RUM pour mesurer les Core Web Vitals sur de vrais utilisateurs.'
  );
}

// Check #37: Localisation contenu
export function getContentLocalization(): CheckResult {
  return manual(
    37,
    'Localisation contenu',
    'international',
    'Vérification manuelle du contenu',
    'Vérifiez que le contenu est correctement traduit/localisé, pas seulement les balises techniques. Adaptez le contenu aux spécificités locales.'
  );
}

// Check #39: Stratégie filtres
export function getFilterStrategy(): CheckResult {
  return manual(
    39,
    'Stratégie filtres',
    'navigation',
    'Analyse manuelle de la stratégie de filtrage',
    'Vérifiez la gestion des pages de filtres/facettes : canonicals, noindex, robots.txt, et la pagination. Évitez la duplication de contenu.'
  );
}

// Check #45: Analyse logs serveur
export function getServerLogsAnalysis(): CheckResult {
  return manual(
    45,
    'Analyse logs serveur',
    'analysis',
    'Nécessite l\'accès aux logs serveur',
    'Analysez vos logs serveur pour comprendre le comportement des bots, identifier les erreurs et optimiser le crawl budget.'
  );
}

// Export all manual checks
export function getManualChecks(): CheckResult[] {
  return [
    getAnalyzeCrawlStats(),
    getUrlParameters(),
    getInternalSearch(),
    getCoverageReport(),
    getRealUserPerformance(),
    getContentLocalization(),
    getFilterStrategy(),
    getServerLogsAnalysis(),
  ];
}
