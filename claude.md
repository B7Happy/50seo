# 50SEO.fr - Project Context

## Overview
50SEO.fr is an automated SEO audit tool that analyzes websites on 50 technical SEO points and generates a score with recommendations. It's a lead generation tool for SearchXLab.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (dark theme)
- **Database:** Supabase (PostgreSQL) + Drizzle ORM
- **Scraping:** Browserless.io (headless Chrome) + Cheerio
- **Email:** Resend
- **PDF:** @react-pdf/renderer
- **Animations:** tw-animate-css
- **Hosting:** Vercel

## Fonts
- **Display:** Space Grotesk (headings, logo)
- **Body:** DM Sans (default sans)
- **Mono:** JetBrains Mono (numbers, code)

## Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts config)
│   ├── globals.css                 # Theme + utilities
│   ├── resultats/[id]/page.tsx     # Results page
│   ├── checklist/page.tsx          # SEO guide content
│   └── api/
│       ├── audit/route.ts          # POST: start audit
│       ├── audit/[id]/route.ts     # GET: get results
│       └── pdf/[id]/route.ts       # GET: generate PDF
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/                     # Header, Footer
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── landing/                    # Landing page sections
│   │   ├── Hero.tsx                # URL input + CTA
│   │   ├── Stats.tsx               # 3 stat cards (50 points, 2 min, 100% gratuit)
│   │   ├── HowItWorks.tsx          # 3-step process
│   │   ├── ChecklistPreview.tsx    # 10 category grid
│   │   ├── FAQ.tsx                 # Accordion FAQ
│   │   └── CTASearchXLab.tsx       # GEO audit CTA
│   └── audit/                      # Results components
├── lib/
│   ├── db/                         # Supabase + Drizzle
│   │   ├── index.ts                # Database connection
│   │   └── schema.ts               # Drizzle schema
│   ├── scraper/                    # Browserless client
│   ├── analyzers/                  # 50 SEO checks
│   ├── email/                      # Resend client
│   └── pdf/                        # PDF generation
├── types/
│   └── audit.ts                    # TypeScript types
└── config/
    ├── checks.ts                   # 50 checks definition (10 categories)
    └── site.ts                     # Site config
```

## Theme (OKLCH colors in globals.css)
- Primary: oklch(0.65 0.24 255) - blue
- Success: oklch(0.7 0.2 155) - green
- Warning: oklch(0.8 0.18 75) - orange
- Destructive: oklch(0.65 0.25 25) - red
- Accent: oklch(0.7 0.15 200) - cyan
- Background: oklch(0.08 0.01 260) - dark
- Card: oklch(0.12 0.015 260)
- Border: oklch(0.22 0.02 260)

## CSS Utilities (globals.css)
- `.font-display` - Space Grotesk font
- `.text-gradient` - Primary to accent gradient text
- `.glow-sm/md/lg` - Box shadow glow effects
- `.glow-success` - Green glow
- `.grid-pattern` - Grid background
- `.dot-pattern` - Dot background
- `.noise-texture` - Subtle noise overlay
- `.animate-float` - Floating animation
- `.animate-pulse-slow` - Slow pulse
- `.reveal` + `.stagger-1-5` - Reveal animations

## Database Schema
Table `audits`:
- id (UUID, primary key)
- url (text)
- domain (text)
- score (integer)
- status (pending | running | completed | failed)
- results (JSONB)
- email (text, optional)
- createdAt (timestamp)
- completedAt (timestamp, optional)

## Key Commands
```bash
npm run dev          # Development
npm run build        # Build
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to Supabase
npm run db:studio    # Open Drizzle Studio
```

## Development Phases
1. ✅ Phase 1: Initial Setup
2. ✅ Phase 2: Base UI Components
3. ✅ Phase 3: Landing Page
4. ✅ Phase 4: Scraper & API
5. ✅ Phase 5: Analyzers (50 checks)
6. ✅ Phase 6: Results Page
7. ✅ Phase 7: PDF & Email
8. ✅ Phase 8: Checklist Page
9. ✅ Phase 9: SEO & Polish
10. Phase 10: Deployment

## Important Notes
- Site is dark-themed by default (html has `dark` class)
- Use `font-display` class for headings
- Footer must include "Propulse par SearchXLab"
- CTA redirects to SearchXLab for GEO audit
- Use shadcn/ui components (sonner for toasts)
- Rate limit /api/audit (2 audits/IP/hour)
- Limit broken links check to 50 internal links max
