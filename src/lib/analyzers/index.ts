import type { CheckResult, AuditCategory } from '@/types/audit';
import type { AuditContext } from './types';
import { CHECK_CATEGORIES, CHECKS } from '@/config/checks';

// Import all analyzers
import { analyzeHreflang } from './hreflang';
import { analyzeLangAttribute, analyzeLanguageCodes } from './lang-tags';
import { analyzeIntlLinking } from './intl-linking';
import { analyzeHttps } from './https';
import { analyzeRobots } from './robots';
import { analyzeSitemap } from './sitemap';
import { analyzeCanonical, analyzeDuplicateContent } from './canonical';
import { analyzeTrailingSlash, analyzeWwwRedirect, analyzeInternalRedirects, analyzeHttpLinks } from './redirects';
import { analyzeUrlStructure } from './url-structure';
import { analyzeBreadcrumbs } from './breadcrumbs';
import { analyzeThinContent } from './thin-content';
import { analyzeAnchorQuality, analyzeAnchorTexts } from './anchor-texts';
import { analyzeInternalLinksSpam, analyzeOrphanRisk, analyzeInternalNofollow } from './internal-links';
import { analyzeClickDepth } from './click-depth';
import { analyzeAdvancedSchema, analyzeSchemaValidation, analyzeJsonLdFormat, analyzeAdvancedSchemaTypes } from './json-ld';
import { analyzeImages } from './images';
import { analyzeFonts } from './fonts';
import { analyzeCriticalPath } from './critical-path';
import { analyzeCaching } from './caching';
import { analyzeCss } from './css';
import { analyzeJavascript } from './javascript';
import { analyzeServerPerformance } from './server';
import { analyzeClientRendering, analyzeRenderingAnalysis } from './rendering';
import { analyzeJsLinks, analyzeSmartJsLinks } from './js-links';
import { analyzeMegaMenu } from './mega-menu';
import { analyzeMobileNav } from './mobile-nav';
import { analyzePagination } from './pagination';
import { analyze404Page } from './404-page';
import { analyzeBrokenLinks } from './broken-links';
import { getManualChecks } from './manual-checks';

// Map of check IDs to their analyzer functions
type AnalyzerFn = (context: AuditContext) => CheckResult | Promise<CheckResult>;

const analyzers: Record<number, AnalyzerFn> = {
  // International (5 points)
  1: analyzeHreflang,
  26: analyzeLangAttribute,
  27: analyzeLanguageCodes,
  28: analyzeIntlLinking,
  // 37 is manual

  // Technical (8 points)
  4: analyzeHttps,
  18: analyzeTrailingSlash,
  22: analyzeWwwRedirect,
  23: analyzeUrlStructure,
  42: analyzeSitemap,
  44: analyzeHttpLinks,
  48: analyzeCanonical,
  49: analyzeRobots,

  // Content (7 points)
  3: analyzeBreadcrumbs,
  8: analyzeClickDepth,
  9: analyzeAnchorQuality,
  12: analyzeThinContent,
  32: analyzeInternalLinksSpam,
  33: analyzeAnchorTexts,
  35: analyzeOrphanRisk,

  // Schema (4 points)
  19: analyzeAdvancedSchema,
  21: analyzeSchemaValidation,
  24: analyzeJsonLdFormat,
  25: analyzeAdvancedSchemaTypes,

  // Media (2 points)
  2: analyzeImages,
  5: analyzeFonts,

  // Performance (7 points)
  6: analyzeCss,
  15: analyzeCaching,
  20: analyzeCriticalPath,
  // 31 is manual
  34: analyzeServerPerformance,
  43: analyzeJavascript,
  46: analyzeRenderingAnalysis,

  // JavaScript (3 points)
  10: analyzeJsLinks,
  30: analyzeClientRendering,
  47: analyzeSmartJsLinks,

  // Navigation (6 points)
  11: analyzeMegaMenu,
  29: analyzeMobileNav,
  36: analyzeInternalRedirects,
  38: analyzePagination,
  // 39 is manual
  41: analyzeInternalNofollow,

  // Analysis (6 points) - mostly manual
  // 7 is manual
  // 13 is manual
  14: analyzeDuplicateContent,
  // 16 is manual
  // 17 is manual
  // 45 is manual

  // Errors (2 points)
  40: analyze404Page,
  50: analyzeBrokenLinks,
};

export async function runAllAnalyzers(context: AuditContext): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Run all automated analyzers
  for (const [idStr, analyzer] of Object.entries(analyzers)) {
    const id = parseInt(idStr, 10);
    const checkInfo = CHECKS[id];

    if (!checkInfo) {
      console.warn(`Check ${id} not found in CHECKS config`);
      continue;
    }

    try {
      const result = await analyzer(context);
      results.push(result);
    } catch (error) {
      console.error(`Error running analyzer for check ${id}:`, error);
      results.push({
        id,
        name: checkInfo.name,
        category: getCategoryForCheck(id),
        status: 'fail',
        score: 0,
        message: `Erreur lors de l'analyse: ${error instanceof Error ? error.message : 'Unknown'}`,
      });
    }
  }

  // Add manual checks
  const manualChecks = getManualChecks();
  results.push(...manualChecks);

  // Sort by ID for consistency
  results.sort((a, b) => a.id - b.id);

  return results;
}

function getCategoryForCheck(checkId: number): string {
  for (const cat of CHECK_CATEGORIES) {
    if ((cat.checks as readonly number[]).includes(checkId)) {
      return cat.id;
    }
  }
  return 'unknown';
}

export function organizeByCategory(checks: CheckResult[]): AuditCategory[] {
  return CHECK_CATEGORIES.map((cat) => {
    const categoryChecks = checks.filter((c) =>
      (cat.checks as readonly number[]).includes(c.id)
    );
    const score = categoryChecks.reduce((sum, c) => sum + c.score, 0);
    const maxScore = categoryChecks.filter(c => c.status !== 'manual' && c.status !== 'na').length;

    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      checks: categoryChecks,
      score,
      maxScore: maxScore || categoryChecks.length,
    };
  });
}

export { calculateScore, calculateSummary } from './scoring';
export type { AuditContext } from './types';
