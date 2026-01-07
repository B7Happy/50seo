import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

// Check #30: Rendu côté client
export function analyzeClientRendering(context: AuditContext): CheckResult {
  const CHECK_ID = 30;
  const CHECK_NAME = 'Rendu côté client';
  const CATEGORY = 'javascript';

  const { $, $raw } = context;

  // Compare rendered HTML vs raw HTML
  const renderedText = $('body').text().replace(/\s+/g, ' ').trim();
  const rawText = $raw('body').text().replace(/\s+/g, ' ').trim();

  const renderedLinks = $('a[href]').length;
  const rawLinks = $raw('a[href]').length;

  const renderedImages = $('img').length;
  const rawImages = $raw('img').length;

  // Check for SPA indicators
  const hasReactRoot = $('[data-reactroot], [data-react-root], #root, #app, #__next').length > 0;
  const hasVueApp = $('[data-v-], [data-server-rendered]').length > 0 || $raw('html').html()?.includes('__NUXT__');
  const hasAngular = $('[ng-app], [ng-version], app-root').length > 0;

  const isSPA = hasReactRoot || hasVueApp || hasAngular;

  // Calculate differences
  const textDiff = Math.abs(renderedText.length - rawText.length);
  const textDiffPercent = rawText.length > 0 ? (textDiff / rawText.length) * 100 : 0;

  const linkDiff = renderedLinks - rawLinks;
  const imageDiff = renderedImages - rawImages;

  // Check for loading/skeleton states in raw HTML
  const hasLoadingState = $raw('body').html()?.match(/loading|skeleton|spinner|placeholder/i);

  // Check for noscript fallback
  const hasNoscript = $raw('noscript').length > 0;
  const noscriptContent = $raw('noscript').text().length;

  // Build analysis
  const issues: string[] = [];
  const details: string[] = [];

  // Heavy client-side rendering
  if (textDiffPercent > 50) {
    issues.push(`${Math.round(textDiffPercent)}% du contenu rendu par JS`);
  }

  if (linkDiff > 10) {
    issues.push(`${linkDiff} liens ajoutés par JS`);
  }

  if (rawText.length < 100 && renderedText.length > 500) {
    issues.push('Contenu quasi-inexistant sans JavaScript');
  }

  // Details
  details.push(`HTML initial: ${rawText.length} caractères`);
  details.push(`HTML rendu: ${renderedText.length} caractères`);
  details.push(`Liens: ${rawLinks} → ${renderedLinks}`);

  if (isSPA) {
    const framework = hasReactRoot ? 'React/Next.js' : hasVueApp ? 'Vue/Nuxt' : 'Angular';
    details.push(`Framework: ${framework}`);
  }

  // Evaluate
  if (rawText.length < 200 && renderedText.length > 500 && !hasNoscript) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Contenu fortement dépendant du JavaScript',
      issues.join('. ') + '. Les moteurs de recherche peuvent avoir des difficultés à indexer le contenu. Utilisez SSR ou pre-rendering.',
      details.join('. ')
    );
  }

  if (textDiffPercent > 30 || linkDiff > 20) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Partie significative du contenu rendue côté client',
      issues.join('. ') + '. Envisagez le pré-rendu pour un meilleur SEO.',
      details.join('. ')
    );
  }

  if (isSPA && rawText.length > 500) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Application JavaScript avec bon rendu initial (SSR/SSG détecté)',
      details.join('. ')
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Contenu principalement rendu côté serveur',
    details.join('. ')
  );
}

// Check #46: Analyse rendu (rendering analysis)
export function analyzeRenderingAnalysis(context: AuditContext): CheckResult {
  const CHECK_ID = 46;
  const CHECK_NAME = 'Analyse rendu';
  const CATEGORY = 'performance';

  const { $, $raw, pageData } = context;

  // Check for hydration issues
  const renderedHtml = $('body').html() || '';
  const rawHtml = $raw('body').html() || '';

  // Check for common hydration mismatch patterns
  const hydrationIssues: string[] = [];

  // Dynamic timestamps or IDs that change
  const dynamicPatterns = [
    /id="[^"]*\d{10,}[^"]*"/g,
    /data-[^=]*="[^"]*\d{10,}[^"]*"/g,
  ];

  // Check if initial HTML has "flash" indicators
  const hasFlashContent = rawHtml.includes('flash') || rawHtml.includes('FOUC');

  // Check for layout shift indicators
  const hasPlaceholders = $raw('[class*="placeholder"], [class*="skeleton"], [class*="loading"]').length;

  // Check for prerender/SSR meta tags
  const hasPrerender = $('meta[name="prerender"]').length > 0;
  const hasSSRIndicator = renderedHtml.includes('data-server-rendered') ||
                          renderedHtml.includes('data-reactroot') ||
                          rawHtml.includes('__NEXT_DATA__') ||
                          rawHtml.includes('__NUXT__');

  // Check DOM size difference
  const rawDomSize = $raw('*').length;
  const renderedDomSize = $('*').length;
  const domGrowth = renderedDomSize - rawDomSize;
  const domGrowthPercent = rawDomSize > 0 ? (domGrowth / rawDomSize) * 100 : 0;

  // Check load time as rendering indicator
  const loadTime = pageData.loadTime;

  const details: string[] = [
    `DOM initial: ${rawDomSize} éléments`,
    `DOM final: ${renderedDomSize} éléments`,
    `Temps de chargement: ${loadTime}ms`,
  ];

  if (hasSSRIndicator) {
    details.push('SSR/SSG détecté');
  }

  // Build result
  if (domGrowthPercent > 100 && loadTime > 3000) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Rendu JavaScript lourd détecté',
      `DOM augmente de ${Math.round(domGrowthPercent)}% après JS. Temps de chargement: ${loadTime}ms. Optimisez le rendu initial.`,
      details.join('. ')
    );
  }

  if (domGrowthPercent > 50 || (loadTime > 2000 && !hasSSRIndicator)) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Rendu côté client significatif',
      `Le DOM augmente de ${Math.round(domGrowthPercent)}% après exécution JS. Envisagez l'optimisation.`,
      details.join('. ')
    );
  }

  if (hasSSRIndicator || domGrowthPercent < 20) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Bon équilibre serveur/client pour le rendu',
      details.join('. ')
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Rendu acceptable',
    details.join('. ')
  );
}
