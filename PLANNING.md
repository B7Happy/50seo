# PLANNING.md — 50SEO.fr

> **Instructions pour Claude Code**
> Ce fichier décrit le projet et les tâches à réaliser pour construire 50seo.fr

---

## Contexte du Projet

**Nom :** 50SEO.fr
**Type :** Outil d'audit SEO technique automatisé
**Objectif :** Analyser un site web sur 50 points SEO et générer un score + recommandations
**Monétisation :** Gratuit (lead generation pour SearchXLab)
**Branding :** Footer "Propulsé par SearchXLab"

### Stack Technique

- **Framework :** Next.js 14 (App Router)
- **Styling :** Tailwind CSS + shadcn/ui
- **Language :** TypeScript
- **Database :** Supabase (PostgreSQL) + Drizzle ORM
- **Scraping :** Browserless.io (headless Chrome)
- **Email :** Resend
- **PDF :** @react-pdf/renderer
- **Hosting :** Vercel

### Structure Cible

```
50seo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css
│   │   ├── resultats/[id]/page.tsx     # Page résultats
│   │   ├── checklist/page.tsx          # Guide SEO (contenu)
│   │   └── api/
│   │       ├── audit/route.ts          # POST: lancer audit
│   │       ├── audit/[id]/route.ts     # GET: récupérer résultats
│   │       └── pdf/[id]/route.ts       # GET: générer PDF
│   ├── components/
│   │   ├── ui/                         # Composants shadcn/ui (auto-générés)
│   │   ├── layout/                     # Header, Footer
│   │   ├── landing/                    # Sections landing page
│   │   └── audit/                      # Composants résultats
│   ├── lib/
│   │   ├── db/                         # Neon + Drizzle
│   │   ├── scraper/                    # Client Browserless
│   │   ├── analyzers/                  # 50 checks SEO
│   │   ├── email/                      # Client Resend
│   │   └── pdf/                        # Génération PDF
│   ├── types/
│   │   └── audit.ts
│   └── config/
│       ├── checks.ts                   # Définition 50 points
│       └── site.ts
├── public/
├── drizzle/                            # Migrations DB
├── .env.local
├── tailwind.config.ts
├── drizzle.config.ts
└── package.json
```

---

## Variables d'Environnement Requises

```env
# .env.local
# Supabase: Dashboard > Settings > Database > Connection string > URI
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
BROWSERLESS_TOKEN=xxx
RESEND_API_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://50seo.fr
NEXT_PUBLIC_SEARCHXLAB_URL=https://www.searchxlab.com
NEXT_PUBLIC_CAL_LINK=searchxlab/discovery-call
```

---

## Tâches de Développement

### PHASE 1 : Setup Initial

- [x] Créer le projet Next.js avec TypeScript et Tailwind
- [x] Installer les dépendances : `cheerio`, `puppeteer-core`, `zod`, `@neondatabase/serverless`, `drizzle-orm`, `framer-motion`, `lucide-react`, `nanoid`, `resend`
- [x] Initialiser shadcn/ui : `npx shadcn@latest init`
- [x] Ajouter les composants shadcn : `npx shadcn@latest add button input card badge accordion progress tabs separator sonner`
- [x] Configurer Tailwind avec le thème (couleurs : primary #2563EB, success #10B981, warning #F59E0B, error #EF4444, background #0A0A0B)
- [x] Créer le schema Drizzle pour la table `audits` (id, url, domain, score, status, results, email, createdAt, completedAt)
- [x] Configurer la connexion Supabase

### PHASE 2 : Composants UI de Base (shadcn/ui)

Les composants UI sont fournis par shadcn/ui. Personnaliser si besoin :

- [x] Configurer le thème shadcn (couleurs : primary #2563EB, destructive #EF4444)
- [x] Vérifier `src/components/ui/button.tsx` (variants: default, secondary, ghost, destructive)
- [x] Vérifier `src/components/ui/input.tsx` (ajouté variant size: default, lg)
- [x] Vérifier `src/components/ui/card.tsx`
- [x] Vérifier `src/components/ui/badge.tsx` (ajouté variants: success, warning, error)
- [x] Vérifier `src/components/ui/accordion.tsx`
- [x] Vérifier `src/components/ui/progress.tsx` (ajouté indicatorClassName prop, animation duration)
- [x] Créer `src/components/layout/Header.tsx` (logo 50SEO)
- [x] Créer `src/components/layout/Footer.tsx` (avec "Propulsé par SearchXLab")

### PHASE 3 : Landing Page

- [x] Créer `src/components/landing/Hero.tsx` : titre + input URL + bouton "Analyser"
- [x] Créer `src/components/landing/Stats.tsx` : "50 points", "2 min", "100% gratuit"
- [x] Créer `src/components/landing/HowItWorks.tsx` : 3 étapes illustrées
- [x] Créer `src/components/landing/ChecklistPreview.tsx` : aperçu 10 catégories
- [x] Créer `src/components/landing/FAQ.tsx` : 5 questions fréquentes
- [x] Créer `src/components/landing/CTASearchXLab.tsx` : CTA vers audit GEO
- [x] Assembler dans `src/app/page.tsx`

### PHASE 4 : Scraper & API

- [x] Créer `src/lib/scraper/index.ts` : client Browserless avec fonctions fetchPage, fetchRobots, fetchSitemap
- [x] Créer `src/app/api/audit/route.ts` : POST pour lancer un audit (valide URL, crée entrée DB, lance analyse)
- [x] Créer `src/app/api/audit/[id]/route.ts` : GET pour récupérer résultats
- [x] Implémenter le système de queue/background job pour l'analyse

### PHASE 5 : Analyzers (50 checks)

Créer les analyzers dans `src/lib/analyzers/` :

**International (5 points)**
- [x] `hreflang.ts` : Vérifie balises hreflang (#1)
- [x] `lang-tags.ts` : Vérifie attribut lang et codes ISO (#26, #27)
- [x] `intl-linking.ts` : Vérifie liens entre versions linguistiques (#28)

**Technique (8 points)**
- [x] `https.ts` : Vérifie HTTPS + HSTS (#4)
- [x] `robots.ts` : Parse et valide robots.txt (#49)
- [x] `sitemap.ts` : Vérifie sitemap.xml (#42)
- [x] `canonical.ts` : Vérifie canonicals (#48, #14)
- [x] `redirects.ts` : Vérifie redirections www, trailing slash, HTTP (#18, #22, #36, #44)
- [x] `url-structure.ts` : Analyse structure URLs (#23)

**Contenu (7 points)**
- [x] `breadcrumbs.ts` : Détecte Schema BreadcrumbList (#3)
- [x] `thin-content.ts` : Compte mots par page (#12)
- [x] `anchor-texts.ts` : Analyse qualité des ancres (#9, #33)
- [x] `internal-links.ts` : Vérifie liens internes (#32, #35, #41)
- [x] `click-depth.ts` : Calcule profondeur de clic (#8)

**Schema (4 points)**
- [x] `json-ld.ts` : Parse et valide tous les JSON-LD (#19, #21, #24, #25)

**Médias (2 points)**
- [x] `images.ts` : Vérifie optimisation images (#2)
- [x] `fonts.ts` : Vérifie optimisation fonts (#5)

**Performance (7 points)**
- [x] `critical-path.ts` : Analyse render-blocking resources (#20)
- [x] `caching.ts` : Vérifie headers cache (#15)
- [x] `css.ts` : Analyse optimisation CSS (#6)
- [x] `javascript.ts` : Analyse optimisation JS (#43)
- [x] `server.ts` : Mesure TTFB (#34)

**JavaScript (4 points)**
- [x] `rendering.ts` : Compare HTML initial vs rendered (#30, #46)
- [x] `js-links.ts` : Vérifie liens JavaScript (#10, #47)

**Navigation (6 points)**
- [x] `mega-menu.ts` : Analyse navigation complexe (#11)
- [x] `mobile-nav.ts` : Compare nav desktop/mobile (#29)
- [x] `pagination.ts` : Vérifie pagination (#38)

**Erreurs (2 points)**
- [x] `404-page.ts` : Vérifie page 404 (#40)
- [x] `broken-links.ts` : Détecte liens cassés (#50)

**Manuel/Recommendations (8 points)**
- [x] `manual-checks.ts` : Génère recommandations pour #7, #13, #16, #17, #31, #37, #39, #45

- [x] Créer `src/lib/analyzers/index.ts` : orchestrateur qui lance tous les checks
- [x] Créer `src/lib/analyzers/scoring.ts` : calcule score global 0-100

### PHASE 6 : Page Résultats

- [x] Créer `src/components/audit/ScoreCircle.tsx` : cercle animé avec score
- [x] Créer `src/components/audit/ResultsSummary.tsx` : résumé passed/warnings/critical
- [x] Créer `src/components/audit/CategoryCard.tsx` : accordéon par catégorie
- [x] Créer `src/components/audit/CheckItem.tsx` : ligne par check avec détails
- [x] Créer `src/components/audit/EmailCapture.tsx` : formulaire email pour PDF
- [x] Créer `src/components/audit/CTASearchXLab.tsx` : CTA vers audit GEO
- [x] Assembler dans `src/app/resultats/[id]/page.tsx`
- [x] Implémenter filtres (Tous/Critiques/Warnings/Passés)
- [x] Ajouter animations Framer Motion

### PHASE 7 : PDF & Email

- [x] Créer `src/lib/pdf/generator.tsx` : template PDF avec react-pdf
- [x] Créer `src/app/api/pdf/[id]/route.ts` : génère et retourne PDF
- [x] Créer `src/lib/email/index.ts` : client Resend pour envoi rapport
- [x] Connecter EmailCapture à l'envoi

### PHASE 8 : Page Checklist (SEO Content)

- [x] Créer `src/app/checklist/page.tsx` : guide détaillé des 50 points
- [x] Rédiger contenu SEO-friendly pour chaque point
- [x] Ajouter Schema FAQPage et HowTo

### PHASE 9 : SEO & Polish

- [x] Optimiser meta titles/descriptions toutes pages
- [x] Implémenter Schema WebApplication, Organization
- [x] Créer sitemap.xml dynamique
- [x] Créer robots.txt
- [x] Ajouter Open Graph images
- [x] Vérifier Core Web Vitals (optimise via Next.js)
- [x] Tester responsive mobile (Tailwind responsive classes)
- [x] Ajouter loading states et error handling

### PHASE 10 : Déploiement

- [ ] Configurer domaine 50seo.fr sur Vercel
- [ ] Configurer variables d'environnement production
- [ ] Tester flow complet en production
- [ ] Monitorer avec Vercel Analytics

---

## Types Principaux

```typescript
// src/types/audit.ts

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'na' | 'manual';

export interface CheckResult {
  id: number;
  name: string;
  category: string;
  status: CheckStatus;
  score: number; // 0, 0.5, ou 1
  message: string;
  details?: string;
  recommendation?: string;
  learnMoreUrl?: string;
}

export interface AuditCategory {
  id: string;
  name: string;
  icon: string;
  checks: CheckResult[];
  score: number;
  maxScore: number;
}

export interface AuditResult {
  id: string;
  url: string;
  domain: string;
  score: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  summary: {
    passed: number;
    warnings: number;
    critical: number;
    notApplicable: number;
  };
  categories: AuditCategory[];
  createdAt: Date;
  completedAt?: Date;
}
```

---

## Configuration des 50 Points

```typescript
// src/config/checks.ts

export const CHECK_CATEGORIES = [
  { id: 'international', name: 'International SEO', icon: '🌐', checks: [1, 26, 27, 28, 37] },
  { id: 'technical', name: 'Fondation Technique', icon: '🔧', checks: [4, 18, 22, 23, 42, 44, 48, 49] },
  { id: 'content', name: 'Contenu & Structure', icon: '📝', checks: [3, 8, 9, 12, 32, 33, 35] },
  { id: 'schema', name: 'Schema & Données', icon: '📊', checks: [19, 21, 24, 25] },
  { id: 'media', name: 'Images & Médias', icon: '🖼️', checks: [2, 5] },
  { id: 'performance', name: 'Performance', icon: '⚡', checks: [6, 15, 20, 31, 34, 43, 46] },
  { id: 'javascript', name: 'JavaScript & Rendering', icon: '🔄', checks: [10, 30, 47] },
  { id: 'navigation', name: 'Navigation & Liens', icon: '🧭', checks: [11, 29, 36, 38, 39, 41] },
  { id: 'analysis', name: 'Analyse Technique', icon: '🔬', checks: [7, 13, 14, 16, 17, 45] },
  { id: 'errors', name: 'Gestion d\'Erreurs', icon: '🚫', checks: [40, 50] },
];

export const CHECKS: Record<number, { name: string; weight: number; automatable: boolean }> = {
  1: { name: 'Balises hreflang', weight: 1, automatable: true },
  2: { name: 'Optimisation images', weight: 1, automatable: true },
  3: { name: 'Fil d\'Ariane (Breadcrumbs)', weight: 1, automatable: true },
  4: { name: 'HTTPS actif', weight: 1, automatable: true },
  // ... définir les 50 points
};
```

---

## Thème Tailwind (via shadcn/ui)

shadcn/ui init configure automatiquement Tailwind avec CSS variables. Personnaliser dans `globals.css` :

```css
/* src/app/globals.css - Personnalisation des couleurs */
:root {
  --primary: 217 91% 60%;        /* #2563EB */
  --primary-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;      /* #EF4444 */
  --success: 160 84% 39%;        /* #10B981 */
  --warning: 38 92% 50%;         /* #F59E0B */
  --background: 0 0% 4%;         /* #0A0A0B */
  --foreground: 0 0% 98%;        /* #FAFAFA */
  --muted: 240 4% 46%;           /* #71717A */
  --card: 0 0% 9%;               /* #18181B */
  --border: 0 0% 15%;            /* #27272A */
}
```

---

## Commandes Utiles

```bash
# Développement
npm run dev

# Database
npm run db:generate   # Génère migrations Drizzle
npm run db:push       # Applique sur Neon
npm run db:studio     # Interface Drizzle Studio

# Build & Deploy
npm run build
npm run start

# Tests
npm run test
npm run lint
```

---

## Notes Importantes

1. **Browserless** : Utiliser le plan payant pour éviter les limites. Timeout recommandé : 30s par page.

2. **Rate limiting** : Implémenter un rate limit sur /api/audit pour éviter les abus (2 audits/IP/heure).

3. **Caching** : Stocker les résultats en DB pour permettre de partager l'URL des résultats.

4. **Broken links check** : Limiter à 50 liens internes max pour éviter timeout.

5. **PDF** : Générer côté serveur, stocker temporairement, envoyer URL par email.

6. **RGPD** : Checkbox obligatoire pour collecte email, mention dans footer.

7. **shadcn/ui** : Utiliser les composants shadcn pour l'UI. Docs : https://ui.shadcn.com. Ne pas réinventer les composants de base.

---

*Ce fichier sert de référence pour Claude Code. Cocher les tâches au fur et à mesure de l'avancement.*
