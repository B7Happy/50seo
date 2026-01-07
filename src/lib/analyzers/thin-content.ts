import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 12;
const CHECK_NAME = 'Contenu suffisant';
const CATEGORY = 'content';

export function analyzeThinContent(context: AuditContext): CheckResult {
  const { $ } = context;

  // Remove script, style, and other non-content elements
  const $content = $.root().clone();
  $content.find('script, style, noscript, iframe, svg, nav, header, footer, aside, [role="navigation"], [role="banner"], [role="contentinfo"]').remove();

  // Get main content area if identifiable
  let mainContent = $content.find('main, [role="main"], article, .content, #content, .post-content, .article-content, .entry-content').first();

  if (mainContent.length === 0) {
    mainContent = $content.find('body');
  }

  // Extract text content
  const textContent = mainContent.text()
    .replace(/\s+/g, ' ')
    .trim();

  // Count words (French and English word patterns)
  const words = textContent.match(/[\wÀ-ÿ]+/g) || [];
  const wordCount = words.length;

  // Count unique words
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const uniqueWordCount = uniqueWords.size;

  // Calculate word diversity ratio
  const diversityRatio = wordCount > 0 ? uniqueWordCount / wordCount : 0;

  // Check for common thin content indicators
  const hasForm = $('form').length > 0;
  const hasVideo = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0;
  const hasImages = $('img').length;
  const hasTables = $('table').length > 0;

  // Adjust expectations based on page type
  const isLikelyContactPage = /contact|kontakt|contacto/i.test(context.pageData.finalUrl);
  const isLikelyProductPage = /product|produit|produkt|shop|boutique/i.test(context.pageData.finalUrl);

  let minWordCount = 300; // Default minimum
  let goodWordCount = 600; // Good amount
  let excellentWordCount = 1000; // Excellent

  if (isLikelyContactPage) {
    minWordCount = 50;
    goodWordCount = 150;
    excellentWordCount = 300;
  } else if (isLikelyProductPage) {
    minWordCount = 150;
    goodWordCount = 300;
    excellentWordCount = 500;
  }

  // Build details
  const details = [
    `${wordCount} mots`,
    `${uniqueWordCount} mots uniques`,
    `Diversité: ${Math.round(diversityRatio * 100)}%`,
    hasImages > 0 ? `${hasImages} image(s)` : '',
    hasVideo ? 'Vidéo présente' : '',
    hasForm ? 'Formulaire présent' : '',
  ].filter(Boolean).join(', ');

  // Very thin content
  if (wordCount < minWordCount / 2) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Contenu très insuffisant (${wordCount} mots)`,
      `Ajoutez du contenu substantiel. Minimum recommandé: ${minWordCount} mots pour ce type de page.`,
      details
    );
  }

  // Thin content
  if (wordCount < minWordCount) {
    // But if there's rich media, it might be acceptable
    if (hasVideo || (hasImages > 5 && wordCount > 100)) {
      return warning(
        CHECK_ID,
        CHECK_NAME,
        CATEGORY,
        `Contenu textuel limité (${wordCount} mots) mais média riche présent`,
        'Envisagez d\'ajouter plus de texte descriptif pour améliorer le SEO.',
        details
      );
    }

    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Contenu insuffisant (${wordCount} mots)`,
      `Visez au moins ${goodWordCount} mots de contenu unique et pertinent.`,
      details
    );
  }

  // Low diversity might indicate keyword stuffing or poor content
  if (diversityRatio < 0.3 && wordCount > 200) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Diversité de vocabulaire faible (${Math.round(diversityRatio * 100)}%)`,
      'Le contenu semble répétitif. Enrichissez le vocabulaire pour un meilleur SEO.',
      details
    );
  }

  // Good content
  if (wordCount >= excellentWordCount) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Excellent volume de contenu (${wordCount} mots)`,
      details
    );
  }

  if (wordCount >= goodWordCount) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Bon volume de contenu (${wordCount} mots)`,
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    `Contenu acceptable (${wordCount} mots)`,
    details
  );
}
