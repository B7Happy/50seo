import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, audits } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { extractDomain } from '@/lib/scraper';
import { runAudit } from '@/lib/audit-runner';
import { after } from 'next/server';

const auditRequestSchema = z.object({
  url: z.string().url('URL invalide').refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'L\'URL doit commencer par http:// ou https://' }
  ),
  email: z.string().email('Email invalide').optional(),
});

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Limite atteinte',
          message: 'Vous avez atteint la limite de 3 audits par jour. Revenez demain !',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = auditRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { url, email } = validation.data;

    // Normalize URL (ensure trailing slash consistency)
    let normalizedUrl = url;
    try {
      const parsed = new URL(url);
      // Remove trailing slash for consistency
      normalizedUrl = parsed.origin + parsed.pathname.replace(/\/$/, '') + parsed.search;
    } catch {
      normalizedUrl = url;
    }

    const domain = extractDomain(normalizedUrl);

    // Create audit entry in database
    const [audit] = await db
      .insert(audits)
      .values({
        url: normalizedUrl,
        domain,
        status: 'pending',
        email: email || null,
      })
      .returning();

    // Schedule background audit execution using Next.js after()
    after(async () => {
      try {
        await runAudit(audit.id);
      } catch (error) {
        console.error(`Audit ${audit.id} failed:`, error);
      }
    });

    return NextResponse.json(
      {
        id: audit.id,
        url: audit.url,
        domain: audit.domain,
        status: audit.status,
        message: 'Audit démarré avec succès',
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Error creating audit:', error);

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la création de l\'audit',
      },
      { status: 500 }
    );
  }
}
