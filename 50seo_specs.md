# 🔍 50SEO.fr — Spécifications Fonctionnelles & Techniques

## Vue d'ensemble

**Nom :** 50SEO.fr  
**Tagline :** "Auditez votre SEO technique en 2 minutes. 50 points. Gratuit."  
**Objectif :** Outil d'audit SEO technique automatisé basé sur une checklist de 50 points  
**Monétisation :** Gratuit (lead generation pour SearchXLab)  
**Stack :** Next.js 14, Tailwind CSS, shadcn/ui, TypeScript  

---

## 1. User Flow Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │     🔍 Auditez votre SEO technique en 2 minutes          │   │
│  │     ┌─────────────────────────────────┬─────────────┐    │   │
│  │     │ https://monsite.fr              │  Analyser → │    │   │
│  │     └─────────────────────────────────┴─────────────┘    │   │
│  │     50 points vérifiés • 100% gratuit • Sans inscription │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Stats] [Comment ça marche] [Les 50 points] [FAQ]              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ANALYSE EN COURS                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │     Analyse de exemple.fr en cours...                     │   │
│  │     ████████████░░░░░░░░░░░░░░░░░░  35%                  │   │
│  │                                                           │   │
│  │     ✓ Connexion HTTPS vérifiée                           │   │
│  │     ✓ Robots.txt analysé                                 │   │
│  │     ⟳ Analyse du Schema markup...                        │   │
│  │     ○ Vérification des images                            │   │
│  │     ○ Analyse des performances                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAGE RÉSULTATS                              │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │     SCORE GLOBAL    │  │  RÉSUMÉ                         │   │
│  │        78/100       │  │  ✓ 39 points validés            │   │
│  │     ██████████░░    │  │  ⚠ 6 améliorations suggérées    │   │
│  │        BIEN         │  │  ✗ 3 problèmes critiques        │   │
│  └─────────────────────┘  │  ○ 2 non applicables            │   │
│                           └─────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [Tous] [Critiques ✗] [Warnings ⚠] [Passés ✓]           │   │
│  │                                                           │   │
│  │  🌐 INTERNATIONAL SEO                           5/5 ✓    │   │
│  │  ├─ ✓ Hreflang tags                                      │   │
│  │  ├─ ✓ Lang attribute                                     │   │
│  │  └─ ...                                                  │   │
│  │                                                           │   │
│  │  🔧 FONDATION TECHNIQUE                        7/8 ⚠     │   │
│  │  ├─ ✓ HTTPS actif                                        │   │
│  │  ├─ ✗ HTTP redirect mal configuré         [Voir fix →]   │   │
│  │  └─ ...                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📧 Recevoir le rapport PDF complet                      │   │
│  │  ┌─────────────────────────────┬───────────────────┐     │   │
│  │  │ votre@email.com             │ Envoyer le PDF →  │     │   │
│  │  └─────────────────────────────┴───────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🤖 Et votre visibilité IA ?                             │   │
│  │  Les moteurs IA (ChatGPT, Claude, Perplexity) citent-ils │   │
│  │  votre marque ? Découvrez-le avec un audit GEO gratuit.  │   │
│  │                                                           │   │
│  │  [Réserver un appel découverte → SearchXLab]             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Les 50 Points — Catégorisation par Automatisation

### 🟢 AUTOMATISABLES (28 points)
*Vérification 100% programmatique*

| # | Point | Méthode de vérification |
|---|-------|------------------------|
| 1 | Use hreflangs | Parser HTML `<link rel="alternate" hreflang>` |
| 2 | Optimize images | Vérifier formats (WebP/AVIF), alt tags, lazy loading, taille |
| 3 | Add breadcrumbs | Détecter BreadcrumbList Schema JSON-LD |
| 4 | Implement HTTPS | Check protocole + HSTS header |
| 5 | Optimize font files | Vérifier preload fonts, format WOFF2 |
| 6 | Optimize CSS code | Analyser nombre/taille CSS, inline critical |
| 9 | Add relevancy to links | Analyser anchor texts (éviter "cliquez ici") |
| 10 | Check JavaScript links | Détecter liens en JS vs href standard |
| 14 | Analyze duplicate content | Comparer canonicals vs URL actuelle |
| 18 | Set up trailing slash redirects | Test URL avec/sans trailing slash |
| 19 | Use new structured data types | Parser tous les JSON-LD |
| 20 | Optimize critical rendering path | Analyser render-blocking resources |
| 21 | Validate Schema implementation | Valider JSON-LD syntax |
| 22 | Set up alternative domain redirects | Test www vs non-www |
| 23 | Create SEO-friendly URL structure | Analyser pattern URL |
| 24 | Use JSON-LD format | Vérifier format Schema |
| 26 | Add lang/content-language tags | Parser attribut lang |
| 27 | Verify language/country codes | Valider codes ISO |
| 32 | Remove spammy internal links | Ratio liens/contenu |
| 33 | Create valuable anchor texts | Analyser diversité anchors |
| 36 | Remove internal redirects | Suivre liens internes, détecter 301/302 |
| 40 | Optimize 404 page | Test URL inexistante → status code |
| 41 | Remove nofollow internal links | Parser rel="nofollow" sur liens internes |
| 42 | Build XML sitemap | Fetch /sitemap.xml, valider structure |
| 44 | Remove HTTP links | Scanner liens internes en http:// |
| 48 | Set up canonicals | Vérifier présence et cohérence |
| 49 | Create robots.txt | Fetch /robots.txt, parser directives |
| 50 | Fix broken links | Crawler liens internes, vérifier 200 |

### 🟡 SEMI-AUTOMATISABLES (14 points)
*Vérification auto + interprétation/heuristiques*

| # | Point | Méthode |
|---|-------|---------|
| 8 | Improve click depth | Crawler le site, calculer profondeur max |
| 11 | Manage mega menu | Détecter nav complexe, compter liens |
| 12 | Avoid thin content | Compter mots par page (seuil: 300+) |
| 13 | Analyze URL parameters | Détecter ?param= dans URLs |
| 15 | Optimize caching strategy | Analyser headers Cache-Control, ETag |
| 25 | Expand Schema past Google's docs | Compter propriétés Schema avancées |
| 28 | Analyze international internal linking | Détecter liens cross-language |
| 29 | Analyze internal linking on mobile | Comparer nav desktop vs mobile |
| 30 | Analyze client-side rendering | Comparer HTML initial vs JS-rendered |
| 34 | Improve server performance | Mesurer TTFB |
| 35 | Add links to orphan pages | Crawler, détecter pages sans liens entrants |
| 38 | Optimize pagination links | Détecter rel="next/prev" ou patterns |
| 43 | Optimize JavaScript | Analyser taille/nombre JS, async/defer |
| 47 | Use JS links smart | Heuristique sur liens critiques en JS |

### 🔴 MANUELS / NON-VÉRIFIABLES (8 points)
*Afficher recommandations + lien ressource*

| # | Point | Approche |
|---|-------|----------|
| 7 | Analyze Crawl Stats | Recommander GSC + guide |
| 16 | Optimize internal search | Détecter présence search, recommander |
| 17 | Analyze Coverage report | Recommander GSC + guide |
| 37 | Verify content localization | Détecter langue, recommander review manuel |
| 39 | Manage filtering strategy | Détecter filtres, recommander audit |
| 45 | Analyze server logs | Recommander outils + guide |
| 46 | Analyze rendering | Test basique + recommander outils |
| 31 | Analyze real-user performance | Recommander RUM tools |

---

## 3. Architecture Technique

### 3.1 Stack

```
Frontend                    Backend                     Services
─────────────────────────────────────────────────────────────────
Next.js 14 (App Router)     Next.js API Routes          Browserless.io
Tailwind CSS + shadcn/ui    Cheerio (parsing)           (headless Chrome)
TypeScript                  
React Query                 Neon PostgreSQL             Resend
Framer Motion               (stockage résultats)        (envoi PDF)

                            PDF Generation              Vercel
                            (react-pdf ou Puppeteer)    (hosting)
```

### 3.2 Flow de données

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│  Client  │────▶│  API Route   │────▶│  Browserless    │
│  (URL)   │     │  /api/audit  │     │  (fetch HTML)   │
└──────────┘     └──────────────┘     └─────────────────┘
                        │                      │
                        │                      ▼
                        │              ┌─────────────────┐
                        │              │  HTML + Headers │
                        │              └─────────────────┘
                        │                      │
                        ▼                      ▼
                 ┌──────────────┐     ┌─────────────────┐
                 │  Analyseurs  │◀────│  Parser         │
                 │  (50 checks) │     │  (Cheerio)      │
                 └──────────────┘     └─────────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  Score +     │
                 │  Résultats   │
                 └──────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  Client  │  │  Neon DB │  │  PDF     │
    │  (JSON)  │  │  (save)  │  │  (Resend) │
    └──────────┘  └──────────┘  └──────────┘
```

### 3.3 Structure du projet

```
50seo.fr/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── resultats/[id]/page.tsx     # Page résultats
│   ├── checklist/page.tsx          # Les 50 points expliqués
│   ├── api/
│   │   ├── audit/route.ts          # Lance l'audit
│   │   ├── audit/[id]/route.ts     # Récupère résultats
│   │   └── pdf/[id]/route.ts       # Génère PDF
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn/ui (auto-générés)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── accordion.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   └── toast.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── audit/
│   │   ├── AuditForm.tsx
│   │   ├── AuditProgress.tsx
│   │   ├── ScoreCircle.tsx
│   │   ├── ResultsCard.tsx
│   │   ├── CheckItem.tsx
│   │   ├── EmailCapture.tsx
│   │   └── CTASearchXLab.tsx
│   └── landing/
│       ├── Hero.tsx
│       ├── HowItWorks.tsx
│       ├── Stats.tsx
│       └── FAQ.tsx
├── lib/
│   ├── analyzers/
│   │   ├── index.ts
│   │   ├── https.ts
│   │   ├── hreflang.ts
│   │   ├── schema.ts
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── images.ts
│   │   ├── performance.ts
│   │   └── ... (1 fichier par catégorie)
│   ├── scraper.ts                  # Browserless client
│   ├── scoring.ts                  # Calcul score global
│   ├── pdf-generator.ts
│   └── db.ts                       # Neon client
├── types/
│   └── audit.ts                    # Types TypeScript
└── public/
    └── ...
```

### 3.4 Modèle de données

```typescript
// types/audit.ts

interface AuditResult {
  id: string;
  url: string;
  createdAt: Date;
  
  score: number;              // 0-100
  
  summary: {
    passed: number;
    warnings: number;
    critical: number;
    notApplicable: number;
  };
  
  categories: AuditCategory[];
}

interface AuditCategory {
  id: string;
  name: string;               // "International SEO"
  icon: string;               // "🌐"
  score: number;              // Points obtenus
  maxScore: number;           // Points possibles
  checks: AuditCheck[];
}

interface AuditCheck {
  id: number;                 // 1-50
  name: string;               // "Use hreflangs"
  status: 'pass' | 'warning' | 'fail' | 'na' | 'manual';
  score: number;              // 0, 0.5, ou 1
  message: string;            // Explication
  details?: string;           // Détails techniques
  recommendation?: string;    // Comment fixer
  learnMoreUrl?: string;      // Lien vers guide
}
```

---

## 4. Système de Scoring

### 4.1 Pondération par catégorie

| Catégorie | Points | Poids |
|-----------|--------|-------|
| 🌐 International SEO | 5 | 10% |
| 🔧 Fondation Technique | 8 | 16% |
| 📝 Contenu & Structure | 7 | 14% |
| 📊 Schema & Données Structurées | 4 | 8% |
| 🖼️ Images & Médias | 2 | 4% |
| ⚡ Performance & Core Web Vitals | 7 | 14% |
| 🔄 JavaScript & Rendering | 4 | 8% |
| 🧭 Navigation & Liens Internes | 6 | 12% |
| 🔬 Analyse Technique | 5 | 10% |
| 🚫 Gestion d'Erreurs | 2 | 4% |
| **TOTAL** | **50** | **100%** |

### 4.2 Calcul du score

```typescript
// Chaque check vaut entre 0 et 1 point
// pass = 1, warning = 0.5, fail = 0, na = exclu du calcul

const calculateScore = (checks: AuditCheck[]): number => {
  const validChecks = checks.filter(c => c.status !== 'na' && c.status !== 'manual');
  const totalPoints = validChecks.reduce((sum, c) => sum + c.score, 0);
  const maxPoints = validChecks.length;
  
  return Math.round((totalPoints / maxPoints) * 100);
};
```

### 4.3 Grille d'interprétation

| Score | Label | Couleur | Message |
|-------|-------|---------|---------|
| 90-100 | Excellent | 🟢 Vert | "Votre SEO technique est au top !" |
| 75-89 | Bien | 🟢 Vert clair | "Quelques optimisations à faire" |
| 50-74 | Moyen | 🟡 Orange | "Des améliorations importantes nécessaires" |
| 25-49 | Faible | 🟠 Orange foncé | "Votre SEO technique freine votre visibilité" |
| 0-24 | Critique | 🔴 Rouge | "Action urgente requise" |

---

## 5. Pages du Site

### 5.1 Landing Page (`/`)

**Sections :**
1. Hero + Input URL
2. Stats ("+10,000 sites analysés", "50 points vérifiés", "100% gratuit")
3. Comment ça marche (3 étapes)
4. Aperçu des 50 points par catégorie
5. FAQ
6. CTA SearchXLab (teaser GEO)
7. Footer ("Propulsé par SearchXLab")

### 5.2 Page Résultats (`/resultats/[id]`)

**Sections :**
1. Score global + résumé
2. Filtres (Tous / Critiques / Warnings / Passés)
3. Liste des checks par catégorie (accordéon)
4. CTA email pour PDF
5. CTA SearchXLab (audit GEO)
6. Partage social

### 5.3 Page Checklist (`/checklist`)

**But :** SEO content, ranker sur "checklist SEO technique"

**Contenu :**
- Introduction au SEO technique
- Les 50 points expliqués en détail
- Exemples de code pour chaque point
- Liens vers ressources externes
- CTA vers l'outil

### 5.4 Pages légales

- `/mentions-legales`
- `/confidentialite`
- `/cgu`

---

## 6. Intégrations

### 6.1 Browserless.io

```typescript
// lib/scraper.ts
import puppeteer from 'puppeteer-core';

export async function fetchPage(url: string) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
  });
  
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const html = await page.content();
  const metrics = await page.metrics();
  
  // Récupérer aussi les headers, redirects, etc.
  
  await browser.close();
  
  return { html, metrics };
}
```

### 6.2 Resend (envoi PDF)

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPdfReport(email: string, pdfUrl: string, auditId: string, domain: string) {
  await resend.emails.send({
    from: '50SEO <rapport50@searchxlab.com>',
    to: email,
    subject: `Votre rapport SEO pour ${domain}`,
    html: `
      <h1>Votre rapport SEO est prêt !</h1>
      <p>Téléchargez votre rapport complet :</p>
      <a href="${pdfUrl}">📄 Télécharger le PDF</a>
      <p>Voir en ligne : <a href="https://50seo.fr/resultats/${auditId}">Résultats</a></p>
      <hr>
      <p><small>Propulsé par <a href="https://www.searchxlab.com">SearchXLab</a></small></p>
    `
  });
}
```

### 6.3 Neon (stockage)

```sql
-- Schema de base
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  score INTEGER,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  email TEXT  -- Si fourni pour PDF
);

CREATE INDEX idx_audits_url ON audits(url);
CREATE INDEX idx_audits_created ON audits(created_at);
```

---

## 7. Plan de Développement

### Phase 1 : MVP Core (Semaine 1-2)
- [ ] Setup projet Next.js + Tailwind
- [ ] Initialiser shadcn/ui : `npx shadcn@latest init`
- [ ] Ajouter composants shadcn : `npx shadcn@latest add button input card badge accordion progress tabs toast`
- [ ] Landing page
- [ ] Intégration Browserless
- [ ] 10 premiers analyzers (les plus importants)
- [ ] Page résultats basique
- [ ] Déploiement Vercel

### Phase 2 : Analyzers Complets (Semaine 3-4)
- [ ] 28 analyzers automatiques restants
- [ ] 14 analyzers semi-auto
- [ ] Recommandations pour les 8 manuels
- [ ] Système de scoring affiné
- [ ] Tests unitaires analyzers

### Phase 3 : Polish & Features (Semaine 5-6)
- [ ] Génération PDF
- [ ] Intégration Resend
- [ ] Page /checklist (contenu SEO)
- [ ] Animations et polish UI
- [ ] Stockage Neon
- [ ] SEO on-page (meta, Schema, etc.)

### Phase 4 : Launch (Semaine 6+)
- [ ] Tests end-to-end
- [ ] Monitoring (Vercel Analytics)
- [ ] Soft launch
- [ ] Feedback et itérations

---

## 8. Design Guidelines

### Couleurs (cohérent avec SearchXLab mais distinct)

```css
:root {
  --primary: #2563EB;       /* Bleu vif */
  --primary-dark: #1D4ED8;
  --success: #10B981;       /* Vert */
  --warning: #F59E0B;       /* Orange */
  --error: #EF4444;         /* Rouge */
  --background: #0A0A0B;    /* Fond sombre */
  --foreground: #FAFAFA;
  --muted: #71717A;
  --card-bg: #18181B;
  --card-border: #27272A;
}
```

### Typo

- **Titres :** Inter ou IBM Plex Sans (comme SearchXLab)
- **Monospace :** IBM Plex Mono (pour code/URLs)

### Composants clés

- Score circulaire animé (type Lighthouse)
- Accordéons pour catégories
- Progress bar temps réel pendant analyse
- Cards avec statut coloré

---

## 9. SEO du site lui-même

### Mots-clés cibles

- "audit seo gratuit"
- "checker seo"
- "analyse seo site"
- "outil seo gratuit"
- "checklist seo technique"
- "vérifier seo site"

### Schema à implémenter

- WebApplication
- SoftwareApplication
- FAQPage
- HowTo
- Organization (→ SearchXLab)

---

## 10. Métriques de succès

| KPI | Objectif M+3 | Objectif M+6 |
|-----|--------------|--------------|
| Audits/mois | 500 | 2,000 |
| Emails collectés | 100 | 500 |
| Conversion → SearchXLab | 5% | 8% |
| Trafic organique | 200/mois | 1,000/mois |
| Backlinks | 10 | 50 |

---

*Document créé le 5 janvier 2026*  
*Propulsé par SearchXLab*
