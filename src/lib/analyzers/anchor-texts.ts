import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

// Check #9: Qualité des ancres
export function analyzeAnchorQuality(context: AuditContext): CheckResult {
  const CHECK_ID = 9;
  const CHECK_NAME = 'Qualité des ancres';
  const CATEGORY = 'content';

  const { $ } = context;

  const anchors: { text: string; href: string; isImage: boolean }[] = [];

  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';

    // Skip anchors, javascript, and mailto links
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    const text = $el.text().trim();
    const hasImage = $el.find('img').length > 0;
    const imgAlt = $el.find('img').attr('alt') || '';

    anchors.push({
      text: text || imgAlt,
      href,
      isImage: hasImage && !text,
    });
  });

  if (anchors.length === 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucun lien détecté sur la page',
      'Ajoutez des liens internes et externes pertinents.'
    );
  }

  // Analyze anchor quality
  const genericAnchors = ['cliquez ici', 'click here', 'ici', 'here', 'lire la suite', 'read more', 'en savoir plus', 'learn more', 'voir', 'voir plus', 'suite', 'more', 'link', 'lien'];
  const emptyAnchors: string[] = [];
  const genericAnchorTexts: string[] = [];
  const tooLongAnchors: string[] = [];
  const tooShortAnchors: string[] = [];
  const imageWithoutAlt: number[] = [];

  anchors.forEach((anchor, index) => {
    const text = anchor.text.toLowerCase().trim();

    if (!text) {
      if (anchor.isImage) {
        imageWithoutAlt.push(index);
      } else {
        emptyAnchors.push(anchor.href);
      }
      return;
    }

    if (genericAnchors.includes(text)) {
      genericAnchorTexts.push(text);
    }

    if (text.length > 100) {
      tooLongAnchors.push(text.substring(0, 50) + '...');
    }

    if (text.length < 2 && !anchor.isImage) {
      tooShortAnchors.push(text);
    }
  });

  const issues: string[] = [];

  if (emptyAnchors.length > 0) {
    issues.push(`${emptyAnchors.length} lien(s) sans texte d'ancre`);
  }

  if (imageWithoutAlt.length > 0) {
    issues.push(`${imageWithoutAlt.length} lien(s) image sans alt`);
  }

  if (genericAnchorTexts.length > 3) {
    issues.push(`${genericAnchorTexts.length} ancres génériques ("cliquez ici", etc.)`);
  }

  if (tooLongAnchors.length > 0) {
    issues.push(`${tooLongAnchors.length} ancre(s) trop longue(s)`);
  }

  const totalIssues = emptyAnchors.length + imageWithoutAlt.length + genericAnchorTexts.length;
  const issueRatio = totalIssues / anchors.length;

  const details = `${anchors.length} liens analysés, ${totalIssues} problème(s) détecté(s)`;

  if (issueRatio > 0.3 || emptyAnchors.length > 5) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Qualité des ancres insuffisante',
      issues.join('. ') + '. Utilisez des textes d\'ancre descriptifs et pertinents.',
      details
    );
  }

  if (issueRatio > 0.1 || genericAnchorTexts.length > 3) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Qualité des ancres à améliorer',
      issues.join('. ') || 'Évitez les ancres génériques et utilisez des textes descriptifs.',
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Bonne qualité des textes d\'ancre',
    details
  );
}

// Check #33: Textes d'ancre (duplicate/over-optimized)
export function analyzeAnchorTexts(context: AuditContext): CheckResult {
  const CHECK_ID = 33;
  const CHECK_NAME = "Textes d'ancre";
  const CATEGORY = 'content';

  const { $, domain } = context;

  const internalAnchors: Map<string, number> = new Map();
  const externalAnchors: Map<string, number> = new Map();

  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    const text = $el.text().trim().toLowerCase();

    if (!text || href.startsWith('#') || href.startsWith('javascript:')) {
      return;
    }

    try {
      const linkUrl = new URL(href, domain);
      const isInternal = linkUrl.origin === new URL(domain).origin;

      const map = isInternal ? internalAnchors : externalAnchors;
      map.set(text, (map.get(text) || 0) + 1);
    } catch {
      // Invalid URL
    }
  });

  const issues: string[] = [];

  // Check for over-repeated anchor texts
  const overUsedInternal: string[] = [];
  const overUsedExternal: string[] = [];

  internalAnchors.forEach((count, text) => {
    if (count > 5 && text.length > 3) {
      overUsedInternal.push(`"${text}" (${count}x)`);
    }
  });

  externalAnchors.forEach((count, text) => {
    if (count > 3 && text.length > 3) {
      overUsedExternal.push(`"${text}" (${count}x)`);
    }
  });

  if (overUsedInternal.length > 0) {
    issues.push(`Ancres internes sur-utilisées: ${overUsedInternal.slice(0, 3).join(', ')}`);
  }

  if (overUsedExternal.length > 0) {
    issues.push(`Ancres externes répétées: ${overUsedExternal.slice(0, 3).join(', ')}`);
  }

  // Check for keyword-stuffed anchors
  const suspiciousPatterns = [
    /\b(meilleur|best|top|#1|number one|premier)\b/i,
    /\b(acheter|achat|buy|purchase|cheap|pas cher)\b/i,
  ];

  let suspiciousCount = 0;
  internalAnchors.forEach((count, text) => {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text) && count > 2) {
        suspiciousCount++;
        break;
      }
    }
  });

  if (suspiciousCount > 3) {
    issues.push(`${suspiciousCount} ancres potentiellement sur-optimisées`);
  }

  const totalAnchors = internalAnchors.size + externalAnchors.size;
  const details = `${internalAnchors.size} ancres internes uniques, ${externalAnchors.size} externes`;

  if (issues.length > 2) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Problèmes de diversité des textes d\'ancre',
      issues.join('. ') + '. Variez davantage vos textes d\'ancre.',
      details
    );
  }

  if (issues.length > 0) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Diversité des ancres à améliorer',
      issues.join('. '),
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Bonne diversité des textes d\'ancre',
    details
  );
}
