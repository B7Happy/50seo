import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 20;
const CHECK_NAME = 'Chemin de rendu critique';
const CATEGORY = 'performance';

export function analyzeCriticalPath(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Check for render-blocking CSS
  const renderBlockingCss = $('link[rel="stylesheet"]').filter((_, el) => {
    const media = $(el).attr('media');
    // CSS is render-blocking unless media query doesn't match
    return !media || media === 'all' || media === 'screen';
  });

  // Check for render-blocking JS
  const renderBlockingJs = $('script[src]').filter((_, el) => {
    const $script = $(el);
    const async = $script.attr('async');
    const defer = $script.attr('defer');
    const type = $script.attr('type');
    // Scripts are blocking unless async/defer or module
    return !async && !defer && type !== 'module';
  });

  // Check CSS in head
  const cssInHead = $('head link[rel="stylesheet"]').length;

  // Check for inline critical CSS
  const inlineStyles = $('head style').length;

  // Check for preload hints
  const preloadCss = $('link[rel="preload"][as="style"]').length;
  const preloadJs = $('link[rel="preload"][as="script"]').length;
  const preloadFonts = $('link[rel="preload"][as="font"]').length;

  // Check for async/defer scripts
  const asyncScripts = $('script[async]').length;
  const deferScripts = $('script[defer]').length;
  const totalScripts = $('script[src]').length;

  // Analyze resources from network
  const cssResources = pageData.resources.filter(r => r.type === 'stylesheet');
  const jsResources = pageData.resources.filter(r => r.type === 'script');

  // Large blocking resources
  const largeBlockingCss = cssResources.filter(r => r.size > 50 * 1024);
  const largeBlockingJs = jsResources.filter(r => r.size > 100 * 1024);

  // Build issues
  if (renderBlockingCss.length > 3) {
    issues.push(`${renderBlockingCss.length} CSS render-blocking`);
  }

  if (renderBlockingJs.length > 2) {
    issues.push(`${renderBlockingJs.length} JS render-blocking (sans async/defer)`);
  }

  if (largeBlockingCss.length > 0) {
    issues.push(`${largeBlockingCss.length} CSS > 50KB`);
  }

  if (largeBlockingJs.length > 0) {
    issues.push(`${largeBlockingJs.length} JS > 100KB`);
  }

  if (inlineStyles === 0 && cssInHead > 2) {
    issues.push('Pas de CSS critique inline');
  }

  // Good practices
  if (inlineStyles > 0) {
    goodPractices.push('CSS critique inline');
  }

  if (asyncScripts > 0 || deferScripts > 0) {
    goodPractices.push(`${asyncScripts + deferScripts}/${totalScripts} scripts async/defer`);
  }

  if (preloadCss > 0 || preloadJs > 0 || preloadFonts > 0) {
    goodPractices.push(`${preloadCss + preloadJs + preloadFonts} ressource(s) preload`);
  }

  // Build details
  const details = [
    `${cssResources.length} CSS, ${jsResources.length} JS`,
    `${renderBlockingCss.length} CSS bloquants`,
    `${renderBlockingJs.length} JS bloquants`,
    goodPractices.length > 0 ? goodPractices.join(', ') : '',
  ].filter(Boolean).join('. ');

  // Determine result
  if (issues.length >= 3 || (renderBlockingCss.length + renderBlockingJs.length) > 6) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Chemin de rendu critique non optimisé',
      issues.join('. ') + '. Utilisez async/defer pour JS, inlinez le CSS critique, et utilisez preload.',
      details
    );
  }

  if (issues.length >= 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Chemin de rendu partiellement optimisé',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Chemin de rendu critique bien optimisé',
    details
  );
}
