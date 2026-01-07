import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 5;
const CHECK_NAME = 'Optimisation fonts';
const CATEGORY = 'media';

export function analyzeFonts(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  const issues: string[] = [];
  const goodPractices: string[] = [];

  // Check for font-display in preloaded fonts
  const preloadedFonts = $('link[rel="preload"][as="font"]');
  const hasPreloadedFonts = preloadedFonts.length > 0;

  if (hasPreloadedFonts) {
    goodPractices.push(`${preloadedFonts.length} font(s) préchargée(s)`);
  }

  // Check for font-display in CSS (via style tags)
  let hasFontDisplay = false;
  $('style').each((_, el) => {
    const css = $(el).html() || '';
    if (css.includes('font-display')) {
      hasFontDisplay = true;
    }
  });

  // Check link elements for fonts
  const googleFonts = $('link[href*="fonts.googleapis.com"]');
  const adobeFonts = $('link[href*="use.typekit.net"]');
  const fontAwesome = $('link[href*="fontawesome"], link[href*="font-awesome"]');

  // Check font resources loaded
  const fontResources = pageData.resources.filter(r =>
    r.type === 'font' ||
    r.url.match(/\.(woff2?|ttf|otf|eot)(\?|$)/i)
  );

  const totalFontSize = fontResources.reduce((sum, r) => sum + r.size, 0);
  const fontCount = fontResources.length;

  // Check for WOFF2 format
  const woff2Fonts = fontResources.filter(r => r.url.includes('.woff2'));
  const hasWoff2 = woff2Fonts.length > 0;

  // Check for too many font files
  if (fontCount > 6) {
    issues.push(`Trop de fichiers de police: ${fontCount} (recommandé: ≤ 6)`);
  }

  // Check total font size
  if (totalFontSize > 300 * 1024) {
    issues.push(`Taille totale des polices élevée: ${(totalFontSize / 1024).toFixed(0)}KB`);
  }

  // Check for Google Fonts optimization
  if (googleFonts.length > 0) {
    const href = googleFonts.first().attr('href') || '';

    // Check for display=swap
    if (href.includes('display=swap')) {
      goodPractices.push('Google Fonts avec display=swap');
    } else {
      issues.push('Google Fonts sans display=swap');
    }

    // Check for subset
    if (!href.includes('subset=') && !href.includes('text=')) {
      issues.push('Google Fonts sans subset (charge tous les caractères)');
    }
  }

  // Check for self-hosted fonts without font-display
  if (fontCount > 0 && !hasFontDisplay && googleFonts.length === 0) {
    issues.push('Polices auto-hébergées sans font-display détecté');
  }

  // Check for WOFF2 usage
  if (fontCount > 0 && !hasWoff2) {
    issues.push('Pas de format WOFF2 détecté (format le plus optimisé)');
  } else if (hasWoff2) {
    goodPractices.push('Format WOFF2 utilisé');
  }

  // Check for preconnect to font CDNs
  const preconnectHosts = $('link[rel="preconnect"]').map((_, el) => $(el).attr('href')).get();
  const fontCDNs = ['fonts.googleapis.com', 'fonts.gstatic.com', 'use.typekit.net'];

  if (googleFonts.length > 0) {
    const hasPreconnect = preconnectHosts.some(h =>
      h?.includes('fonts.googleapis.com') || h?.includes('fonts.gstatic.com')
    );
    if (!hasPreconnect) {
      issues.push('Pas de preconnect pour Google Fonts');
    } else {
      goodPractices.push('Preconnect pour Google Fonts');
    }
  }

  // Build details
  const fontSources: string[] = [];
  if (googleFonts.length > 0) fontSources.push('Google Fonts');
  if (adobeFonts.length > 0) fontSources.push('Adobe Fonts');
  if (fontAwesome.length > 0) fontSources.push('Font Awesome');
  if (fontCount > 0 && fontSources.length === 0) fontSources.push('Auto-hébergées');

  const details = [
    fontCount > 0 ? `${fontCount} fichier(s) de police` : 'Aucune police personnalisée',
    fontSources.length > 0 ? `Sources: ${fontSources.join(', ')}` : '',
    totalFontSize > 0 ? `Taille: ${(totalFontSize / 1024).toFixed(0)}KB` : '',
    goodPractices.length > 0 ? `Bonnes pratiques: ${goodPractices.join(', ')}` : '',
  ].filter(Boolean).join('. ');

  // No custom fonts is not necessarily bad
  if (fontCount === 0 && googleFonts.length === 0) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Polices système uniquement (optimal pour les performances)',
      'Aucune police personnalisée à charger'
    );
  }

  // Determine result
  if (issues.length >= 3) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${issues.length} problème(s) d'optimisation des polices`,
      issues.join('. '),
      details
    );
  }

  if (issues.length >= 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Polices partiellement optimisées',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Polices bien optimisées',
    details
  );
}
