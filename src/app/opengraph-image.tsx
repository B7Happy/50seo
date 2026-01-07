import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '50SEO - Audit SEO Technique Gratuit'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
              fontSize: 80,
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
            Audit SEO Technique Gratuit
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: '#a1a1aa',
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            Analysez votre site sur 50 points en 2 minutes
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: 32,
            }}
          >
            {[
              { icon: '50', label: 'Points analyses' },
              { icon: '2', label: 'Minutes' },
              { icon: '0', label: 'Euros' },
            ].map((feature) => (
              <div
                key={feature.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 32px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 16,
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: '#3b82f6',
                    marginBottom: 4,
                  }}
                >
                  {feature.icon}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: '#a1a1aa',
                  }}
                >
                  {feature.label}
                </div>
              </div>
            ))}
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
