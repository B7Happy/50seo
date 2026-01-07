import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, audits } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          error: 'ID invalide',
          message: 'L\'identifiant de l\'audit n\'est pas valide',
        },
        { status: 400 }
      );
    }

    // Fetch audit from database
    const audit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!audit) {
      return NextResponse.json(
        {
          error: 'Audit non trouvé',
          message: 'Aucun audit trouvé avec cet identifiant',
        },
        { status: 404 }
      );
    }

    // Format response based on status
    const response = {
      id: audit.id,
      url: audit.url,
      domain: audit.domain,
      status: audit.status,
      score: audit.score,
      createdAt: audit.createdAt,
      completedAt: audit.completedAt,
      ...(audit.status === 'completed' && audit.results
        ? { results: audit.results }
        : {}),
      ...(audit.status === 'failed' && audit.results
        ? { error: (audit.results as { error?: string }).error }
        : {}),
    };

    // Set appropriate cache headers based on status
    const headers: Record<string, string> = {};

    if (audit.status === 'pending' || audit.status === 'running') {
      // Short cache for in-progress audits (poll frequently)
      headers['Cache-Control'] = 'no-cache';
    } else {
      // Longer cache for completed/failed audits
      headers['Cache-Control'] = 'public, max-age=3600, s-maxage=3600';
    }

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Error fetching audit:', error);

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la récupération de l\'audit',
      },
      { status: 500 }
    );
  }
}
