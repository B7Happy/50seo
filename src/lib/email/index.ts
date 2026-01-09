import { Resend } from 'resend';
import { siteConfig } from '@/config/site';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendAuditReportParams {
  to: string;
  domain: string;
  score: number;
  auditId: string;
  summary: {
    passed: number;
    warnings: number;
    critical: number;
  };
}

// Helper to get score color
function getScoreColor(score: number): string {
  if (score >= 80) return '#22C55E';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

// Helper to get score label
function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'A ameliorer';
  return 'Critique';
}

export async function sendAuditReport({
  to,
  domain,
  score,
  auditId,
  summary,
}: SendAuditReportParams) {
  const pdfUrl = `${siteConfig.url}/api/pdf/${auditId}`;
  const resultsUrl = `${siteConfig.url}/resultats/${auditId}`;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre rapport d'audit SEO - ${domain}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; color: #18181b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6, #6366F1); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">50SEO</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Votre rapport d'audit SEO est pret</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- Domain -->
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #71717a;">
                Analyse de <strong style="color: #18181b;">${domain}</strong>
              </p>

              <!-- Score Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <div style="font-size: 64px; font-weight: 700; color: ${scoreColor}; line-height: 1;">
                      ${score}
                    </div>
                    <div style="font-size: 14px; color: #71717a; margin-top: 4px;">sur 100</div>
                    <div style="font-size: 16px; font-weight: 600; color: ${scoreColor}; margin-top: 8px;">${scoreLabel}</div>
                  </td>
                </tr>
              </table>

              <!-- Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="33%" style="padding: 16px; text-align: center; background-color: #dcfce7; border-radius: 8px 0 0 8px;">
                    <div style="font-size: 24px; font-weight: 700; color: #22C55E;">${summary.passed}</div>
                    <div style="font-size: 11px; color: #22C55E; text-transform: uppercase;">Reussis</div>
                  </td>
                  <td width="34%" style="padding: 16px; text-align: center; background-color: #fef3c7;">
                    <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${summary.warnings}</div>
                    <div style="font-size: 11px; color: #F59E0B; text-transform: uppercase;">Avertissements</div>
                  </td>
                  <td width="33%" style="padding: 16px; text-align: center; background-color: #fee2e2; border-radius: 0 8px 8px 0;">
                    <div style="font-size: 24px; font-weight: 700; color: #EF4444;">${summary.critical}</div>
                    <div style="font-size: 11px; color: #EF4444; text-transform: uppercase;">Critiques</div>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px;">
                    <a href="${pdfUrl}" style="display: block; background-color: #3B82F6; color: #ffffff; text-decoration: none; text-align: center; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                      Telecharger le rapport PDF
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px;">
                    <a href="${resultsUrl}" style="display: block; background-color: #f4f4f5; color: #18181b; text-decoration: none; text-align: center; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                      Voir les resultats en ligne
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- GEO CTA -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #EEF2FF, #E0E7FF); border-radius: 12px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #4F46E5;">Et votre visibilite IA ?</h3>
                    <p style="margin: 0 0 16px 0; font-size: 13px; color: #6366F1;">
                      Decouvrez si ChatGPT et Perplexity mentionnent votre marque
                    </p>
                    <a href="${siteConfig.calLink}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 13px; font-weight: 600;">
                      Reserver un appel gratuit
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a;">
                Propulse par <a href="${siteConfig.searchXLabUrl}" style="color: #3B82F6; text-decoration: none;">SearchXLab</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
                Vous recevez cet email car vous avez demande un rapport d'audit SEO sur 50seo.fr
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const { data, error } = await resend.emails.send({
    from: '50SEO <rapport50@searchxlab.com>',
    to: [to],
    subject: `Votre rapport SEO pour ${domain} - Score: ${score}/100`,
    html,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw new Error(error.message);
  }

  return data;
}
