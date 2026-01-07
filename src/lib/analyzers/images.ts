import type { CheckResult } from '@/types/audit';
import type { AuditContext } from './types';
import { pass, warning, fail } from './types';

const CHECK_ID = 2;
const CHECK_NAME = 'Optimisation images';
const CATEGORY = 'media';

export function analyzeImages(context: AuditContext): CheckResult {
  const { $, pageData } = context;

  const images = $('img');
  const imageCount = images.length;

  if (imageCount === 0) {
    return pass(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Aucune image sur la page',
      'Pas d\'optimisation nécessaire'
    );
  }

  const issues: string[] = [];
  let missingAlt = 0;
  let emptyAlt = 0;
  let missingDimensions = 0;
  let lazyLoadCount = 0;
  let modernFormatCount = 0;
  let largeImages = 0;

  // Analyze each image
  images.each((_, el) => {
    const $img = $(el);
    const alt = $img.attr('alt');
    const src = $img.attr('src') || '';
    const width = $img.attr('width');
    const height = $img.attr('height');
    const loading = $img.attr('loading');
    const decoding = $img.attr('decoding');

    // Check alt attribute
    if (alt === undefined) {
      missingAlt++;
    } else if (alt.trim() === '') {
      emptyAlt++; // Might be decorative
    }

    // Check dimensions
    if (!width || !height) {
      missingDimensions++;
    }

    // Check lazy loading
    if (loading === 'lazy') {
      lazyLoadCount++;
    }

    // Check modern formats
    const modernFormats = ['.webp', '.avif'];
    if (modernFormats.some(f => src.toLowerCase().includes(f))) {
      modernFormatCount++;
    }
  });

  // Check loaded image resources for size
  const imageResources = pageData.resources.filter(r =>
    r.type === 'image' && r.size > 0
  );

  const totalImageSize = imageResources.reduce((sum, r) => sum + r.size, 0);
  const avgImageSize = imageResources.length > 0 ? totalImageSize / imageResources.length : 0;

  // Large images (> 200KB)
  largeImages = imageResources.filter(r => r.size > 200 * 1024).length;

  // Check for srcset (responsive images)
  const responsiveImages = $('img[srcset], picture source[srcset]').length;

  // Build issues list
  if (missingAlt > 0) {
    issues.push(`${missingAlt} image(s) sans attribut alt`);
  }

  if (missingDimensions > imageCount * 0.5) {
    issues.push(`${missingDimensions} image(s) sans dimensions (width/height)`);
  }

  if (largeImages > 0) {
    issues.push(`${largeImages} image(s) > 200KB`);
  }

  if (lazyLoadCount === 0 && imageCount > 3) {
    issues.push('Aucun lazy loading détecté');
  }

  if (modernFormatCount === 0 && imageCount > 0) {
    issues.push('Aucune image en format moderne (WebP/AVIF)');
  }

  if (responsiveImages === 0 && imageCount > 2) {
    issues.push('Pas d\'images responsives (srcset)');
  }

  // Build details
  const details = [
    `${imageCount} image(s)`,
    `${missingAlt} sans alt`,
    lazyLoadCount > 0 ? `${lazyLoadCount} lazy-loaded` : '',
    modernFormatCount > 0 ? `${modernFormatCount} WebP/AVIF` : '',
    responsiveImages > 0 ? `${responsiveImages} responsive` : '',
    totalImageSize > 0 ? `Total: ${(totalImageSize / 1024).toFixed(0)}KB` : '',
  ].filter(Boolean).join(', ');

  // Determine result
  const issueScore = issues.length;

  if (issueScore >= 4 || missingAlt > imageCount * 0.3) {
    return fail(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `${issues.length} problème(s) d'optimisation images`,
      issues.join('. ') + '. Optimisez vos images pour de meilleures performances et accessibilité.',
      details
    );
  }

  if (issueScore >= 2) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      `Images partiellement optimisées`,
      issues.join('. '),
      details
    );
  }

  if (issueScore === 1) {
    return warning(
      CHECK_ID,
      CHECK_NAME,
      CATEGORY,
      'Images bien optimisées avec un point d\'amélioration',
      issues[0],
      details
    );
  }

  return pass(
    CHECK_ID,
    CHECK_NAME,
    CATEGORY,
    'Images bien optimisées',
    details
  );
}
