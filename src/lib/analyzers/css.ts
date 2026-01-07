import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 6;
const CHECK_NAME = 'Optimisation CSS';
const CATEGORY = 'performance';

export function analyzeCss(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Get CSS resources
  const cssResources = pageData.resources.filter(r => r.type === 'stylesheet');
  const totalCssSize = cssResources.reduce((sum, r) => sum + r.size, 0);

  // Count CSS files
  const externalCss = $('link[rel="stylesheet"]').length;
  const inlineStyles = $('style').length;
  const inlineStyleAttrs = $('[style]').length;

  // Calculate inline CSS size
  let inlineCssSize = 0;
  $('style').each((_, el) => {
    inlineCssSize += ($(el).html() || '').length;
  });

  // Check for minification indicators (rough check)
  let minifiedCount = 0;
  cssResources.forEach(r => {
    // Minified CSS typically has .min.css or high compression ratio
    if (r.url.includes('.min.css') || r.url.includes('.min-')) {
      minifiedCount++;
    }
  });

  // Check for critical CSS inline
  const hasCriticalCss = inlineStyles > 0 && inlineCssSize > 500 && inlineCssSize < 15000;

  // Check for CSS preload
  const preloadedCss = $('link[rel="preload"][as="style"]').length;

  // Check for unused CSS indicators (media queries that don't match)
  const printCss = $('link[rel="stylesheet"][media="print"]').length;

  // Check for @import in inline styles (bad practice)
  let hasImport = false;
  $('style').each((_, el) => {
    if (($(el).html() || '').includes('@import')) {
      hasImport = true;
    }
  });

  // Build issues
  if (externalCss > 5) {
    issues.push(`Trop de fichiers CSS: ${externalCss} (combinez-les)`);
  }

  if (totalCssSize > 200 * 1024) {
    issues.push(`CSS total trop volumineux: ${(totalCssSize / 1024).toFixed(0)}KB`);
  }

  if (hasImport) {
    issues.push('@import détecté (utiliser <link> à la place)');
  }

  if (inlineStyleAttrs > 20) {
    issues.push(`${inlineStyleAttrs} attributs style inline (utilisez des classes)`);
  }

  if (externalCss > 0 && minifiedCount === 0) {
    issues.push('CSS non minifié détecté');
  }

  // Good practices
  if (hasCriticalCss) {
    goodPractices.push('CSS critique inline');
  }

  if (preloadedCss > 0) {
    goodPractices.push(`${preloadedCss} CSS preload`);
  }

  if (printCss > 0) {
    goodPractices.push('CSS print séparé');
  }

  if (minifiedCount > 0) {
    goodPractices.push(`${minifiedCount}/${cssResources.length} CSS minifié`);
  }

  // Build details
  const details = [
    `${externalCss} fichier(s) CSS externe(s)`,
    `${inlineStyles} bloc(s) <style>`,
    totalCssSize > 0 ? `Taille: ${(totalCssSize / 1024).toFixed(0)}KB` : '',
    goodPractices.length > 0 ? goodPractices.join(', ') : '',
  ].filter(Boolean).join('. ');

  // Determine result
  if (issues.length >= 3 || totalCssSize > 500 * 1024) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'CSS mal optimisé',
      issues.join('. ') + '. Minifiez, combinez et optimisez vos fichiers CSS.',
      details
    );
  }

  if (issues.length >= 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'CSS partiellement optimisé',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'CSS bien optimisé',
    details
  );
}
