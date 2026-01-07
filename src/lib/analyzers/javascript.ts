import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 43;
const CHECK_NAME = 'Optimisation JavaScript';
const CATEGORY = 'performance';

export function analyzeJavascript(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Get JS resources
  const jsResources = pageData.resources.filter(r => r.type === 'script');
  const totalJsSize = jsResources.reduce((sum, r) => sum + r.size, 0);

  // Count script elements
  const externalScripts = $('script[src]');
  const inlineScripts = $('script:not([src])').filter((_, el) => {
    const type = $(el).attr('type');
    return !type || type === 'text/javascript' || type === 'application/javascript';
  });

  // Check for async/defer
  let asyncCount = 0;
  let deferCount = 0;
  let blockingCount = 0;
  let moduleCount = 0;

  externalScripts.each((_, el) => {
    const $script = $(el);
    if ($script.attr('async') !== undefined) asyncCount++;
    else if ($script.attr('defer') !== undefined) deferCount++;
    else if ($script.attr('type') === 'module') moduleCount++;
    else blockingCount++;
  });

  // Check inline script sizes
  let inlineJsSize = 0;
  inlineScripts.each((_, el) => {
    inlineJsSize += ($(el).html() || '').length;
  });

  // Check for minification indicators
  let minifiedCount = 0;
  jsResources.forEach(r => {
    if (r.url.includes('.min.js') || r.url.includes('.min-')) {
      minifiedCount++;
    }
  });

  // Check for console errors (might indicate JS issues)
  const consoleErrors = pageData.consoleErrors.filter(e =>
    !e.includes('favicon') && !e.includes('404')
  );

  // Check for third-party scripts
  const thirdPartyDomains = new Set<string>();
  const pageDomain = new URL(context.domain).hostname;

  jsResources.forEach(r => {
    try {
      const scriptDomain = new URL(r.url).hostname;
      if (scriptDomain !== pageDomain && !scriptDomain.includes(pageDomain)) {
        thirdPartyDomains.add(scriptDomain);
      }
    } catch {
      // Invalid URL
    }
  });

  // Large JS files
  const largeJsFiles = jsResources.filter(r => r.size > 150 * 1024);

  // Build issues
  if (blockingCount > 2) {
    issues.push(`${blockingCount} script(s) bloquant(s) (sans async/defer)`);
  }

  if (totalJsSize > 500 * 1024) {
    issues.push(`JavaScript total trop volumineux: ${(totalJsSize / 1024).toFixed(0)}KB`);
  }

  if (largeJsFiles.length > 0) {
    issues.push(`${largeJsFiles.length} fichier(s) JS > 150KB`);
  }

  if (externalScripts.length > 10) {
    issues.push(`Trop de scripts: ${externalScripts.length}`);
  }

  if (jsResources.length > 0 && minifiedCount === 0) {
    issues.push('JS non minifié détecté');
  }

  if (consoleErrors.length > 2) {
    issues.push(`${consoleErrors.length} erreur(s) console`);
  }

  if (thirdPartyDomains.size > 5) {
    issues.push(`${thirdPartyDomains.size} domaines tiers (impact performance)`);
  }

  // Good practices
  if (asyncCount > 0 || deferCount > 0) {
    goodPractices.push(`${asyncCount} async, ${deferCount} defer`);
  }

  if (moduleCount > 0) {
    goodPractices.push(`${moduleCount} module(s) ES`);
  }

  if (minifiedCount > 0) {
    goodPractices.push(`${minifiedCount}/${jsResources.length} JS minifié`);
  }

  // Check for preload
  const preloadedJs = $('link[rel="preload"][as="script"]').length;
  if (preloadedJs > 0) {
    goodPractices.push(`${preloadedJs} JS preload`);
  }

  // Build details
  const details = [
    `${externalScripts.length} script(s) externe(s)`,
    `${inlineScripts.length} inline`,
    totalJsSize > 0 ? `Taille: ${(totalJsSize / 1024).toFixed(0)}KB` : '',
    goodPractices.length > 0 ? goodPractices.join(', ') : '',
  ].filter(Boolean).join('. ');

  // Determine result
  if (issues.length >= 3 || totalJsSize > 1024 * 1024) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'JavaScript mal optimisé',
      issues.join('. ') + '. Optimisez, minifiez et utilisez async/defer.',
      details
    );
  }

  if (issues.length >= 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'JavaScript partiellement optimisé',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'JavaScript bien optimisé',
    details
  );
}
