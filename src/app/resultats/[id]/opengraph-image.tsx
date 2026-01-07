import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Resultat Audit SEO - 50SEO'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Note: In a real scenario, you'd fetch the audit data here
  // For now, we'll create a generic image
  const shortId = id.slice(0, 8)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0b',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1e3a5f 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0d2847 0%, transparent 50%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
            }}
          >
            50SEO
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            Resultat d'Audit SEO
          </div>

          {/* Audit ID */}
          <div
            style={{
              fontSize: 20,
              color: '#a1a1aa',
              textAlign: 'center',
              marginBottom: 40,
              fontFamily: 'monospace',
            }}
          >
            Audit #{shortId}
          </div>

          {/* Score placeholder circle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: '8px solid #3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#3b82f6',
              }}
            >
              ?
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#a1a1aa',
              }}
            >
              sur 100
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 32,
              fontSize: 18,
              color: '#a1a1aa',
            }}
          >
            Voir les resultats sur 50seo.fr
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#71717a',
            fontSize: 16,
          }}
        >
          Propulse par SearchXLab
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
