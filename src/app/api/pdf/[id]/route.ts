import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { renderToBuffer } from '@react-pdf/renderer';
import { db, audits } from '@/lib/db';
import { AuditPDF } from '@/lib/pdf/generator';
import type { AuditCategory } from '@/types/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface AuditResults {
  summary: {
    passed: number;
    warnings: number;
    critical: number;
    notApplicable: number;
  };
  categories: AuditCategory[];
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Fetch audit from database
    const audit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit non trouve' },
        { status: 404 }
      );
    }

    if (audit.status !== 'completed') {
      return NextResponse.json(
        { error: 'L\'audit n\'est pas encore termine' },
        { status: 400 }
      );
    }

    if (!audit.results) {
      return NextResponse.json(
        { error: 'Aucun resultat disponible' },
        { status: 400 }
      );
    }

    const results = audit.results as AuditResults;

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      AuditPDF({
        id: audit.id,
        domain: audit.domain,
        url: audit.url,
        score: audit.score || 0,
        summary: results.summary,
        categories: results.categories,
        createdAt: audit.createdAt,
      })
    );

    // Convert Buffer to Uint8Array for Response compatibility
    const uint8Array = new Uint8Array(pdfBuffer);

    // Return PDF as response
    return new Response(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit-seo-${audit.domain}-${id.slice(0, 8)}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la generation du PDF',
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
