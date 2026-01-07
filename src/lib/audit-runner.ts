import { eq } from 'drizzle-orm';
import { db, audits } from '@/lib/db';
import { fetchPage, fetchRawHtml, fetchRobots, fetchSitemapFromDomain, parseHtml } from '@/lib/scraper';
import { runAllAnalyzers, organizeByCategory, calculateScore, calculateSummary } from '@/lib/analyzers';
import type { AuditContext } from '@/lib/analyzers';

export async function runAudit(auditId: string): Promise<void> {
  console.log(`Starting audit ${auditId}`);

  try {
    // Update status to running
    const [audit] = await db
      .update(audits)
      .set({ status: 'running' })
      .where(eq(audits.id, auditId))
      .returning();

    if (!audit) {
      throw new Error(`Audit ${auditId} not found`);
    }

    const { url, domain } = audit;

    // Fetch all required data in parallel where possible
    const [pageData, rawHtmlData, robotsData, sitemapData] = await Promise.all([
      fetchPage(url),
      fetchRawHtml(url),
      fetchRobots(domain),
      fetchSitemapFromDomain(domain),
    ]);

    // Parse HTML
    const $ = parseHtml(pageData.html);
    const $raw = parseHtml(rawHtmlData.html);

    const context: AuditContext = {
      url,
      domain,
      pageData,
      rawHtml: rawHtmlData,
      robotsData,
      sitemapData,
      $,
      $raw,
    };

    // Run all analyzers
    const checkResults = await runAllAnalyzers(context);

    // Calculate scores and organize by category
    const categories = organizeByCategory(checkResults);
    const score = calculateScore(checkResults);
    const summary = calculateSummary(checkResults);

    // Update database with results
    await db
      .update(audits)
      .set({
        status: 'completed',
        score,
        results: {
          summary,
          categories,
          checks: checkResults,
        },
        completedAt: new Date(),
      })
      .where(eq(audits.id, auditId));

    console.log(`Audit ${auditId} completed with score ${score}`);
  } catch (error) {
    console.error(`Audit ${auditId} failed:`, error);

    // Update status to failed
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    }

    await db
      .update(audits)
      .set({
        status: 'failed',
        results: {
          error: errorMessage,
        },
        completedAt: new Date(),
      })
      .where(eq(audits.id, auditId));

    throw error;
  }
}
