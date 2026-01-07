import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, audits } from '@/lib/db';
import { sendAuditReport } from '@/lib/email';

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
}

const emailSchema = z.object({
  email: z.string().email('Email invalide'),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Parse and validate request body
    const body = await request.json();
    const validation = emailSchema.safeParse(body);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || 'Email invalide' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

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

    // Update audit with email
    await db.update(audits).set({ email }).where(eq(audits.id, id));

    // Send email
    await sendAuditReport({
      to: email,
      domain: audit.domain,
      score: audit.score || 0,
      auditId: audit.id,
      summary: {
        passed: results.summary.passed,
        warnings: results.summary.warnings,
        critical: results.summary.critical,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email envoye avec succes',
    });
  } catch (error) {
    console.error('Error sending email:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de l\'envoi de l\'email',
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
