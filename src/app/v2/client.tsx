"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Loader2,
  Globe2,
  Wrench,
  FileText,
  Database,
  Image,
  Zap,
  Code2,
  Navigation,
  Search,
  AlertTriangle,
  Minus,
  Plus,
  ChevronRight,
  BarChart3,
  FileDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Stats {
  weeklyCount: number
  totalCount: number
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection({ stats }: { stats: Stats }) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    let validUrl = url.trim()
    if (!validUrl) {
      setError("Veuillez entrer une URL")
      return
    }

    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl
    }

    try {
      new URL(validUrl)
    } catch {
      setError("Hmm, cette URL ne semble pas valide. Vérifiez le format (https://exemple.fr)")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse")
      }

      router.push(`/resultats/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'analyse")
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center overflow-hidden pt-20">
      {/* Animated scan grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[180px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Floating diagnostic elements */}
      <div className="absolute top-32 right-[15%] hidden lg:block">
        <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/30 text-success text-sm font-mono animate-float">
          ✓ HTTPS actif
        </div>
      </div>
      <div className="absolute top-48 left-[10%] hidden lg:block">
        <div className="px-4 py-2 rounded-lg bg-warning/10 border border-warning/30 text-warning text-sm font-mono animate-float" style={{ animationDelay: '1s' }}>
          ⚠ robots.txt manquant
        </div>
      </div>
      <div className="absolute bottom-40 right-[8%] hidden lg:block">
        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-mono animate-float" style={{ animationDelay: '2s' }}>
          ◉ Scan en cours...
        </div>
      </div>

      {/* Main content */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with real stats */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium reveal">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {stats.weeklyCount > 0
              ? `+${formatNumber(stats.weeklyCount)} sites analysés cette semaine`
              : stats.totalCount > 0
                ? `${formatNumber(stats.totalCount)} sites déjà analysés`
                : "Audit SEO technique gratuit"
            }
          </div>

          {/* Title */}
          <h1 className="mb-8 reveal stagger-1">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-4 leading-[1.1]">
              Votre SEO technique
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1]">
              tient-il <span className="text-gradient">la route</span> ?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto reveal stagger-2 leading-relaxed">
            Découvrez ce qui freine votre référencement. Analyse technique complète, gratuite, sans inscription.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 reveal stagger-3">
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/30 to-primary/50 opacity-50 blur-lg group-hover:opacity-70 transition-opacity duration-500" />

              {/* Form container */}
              <div className="relative p-1.5 rounded-2xl bg-gradient-to-r from-primary/40 via-accent/20 to-primary/40">
                <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl bg-background/95 backdrop-blur-xl">
                  <Input
                    type="text"
                    placeholder="https://votre-site.fr"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="h-14 px-5 text-lg bg-secondary/50 border-0 rounded-xl placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/50 font-medium flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="h-14 px-8 text-base font-semibold rounded-xl glow-sm hover:glow-md transition-all duration-300 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        Analyser mon site
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-center text-sm text-destructive font-medium">{error}</p>
            )}
          </form>

          {/* Micro-copy */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground reveal stagger-4">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              100% gratuit
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Sans inscription
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Résultats en 2 min
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

// ============================================================================
// PAIN POINTS SECTION
// ============================================================================
function PainPointsSection() {
  const painPoints = [
    { emoji: "😤", text: "\"Mon site est introuvable sur Google, je ne sais pas pourquoi\"" },
    { emoji: "🤯", text: "\"J'ai payé 3 000€ une agence SEO, je n'ai rien compris à leur audit\"" },
    { emoji: "😰", text: "\"Je ne sais pas si mon site est bien configuré techniquement\"" },
    { emoji: "🤔", text: "\"Lighthouse dit 98, mais je ne ranke toujours pas\"" }
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/[0.02] to-background" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
            Le SEO technique, c&apos;est invisible.
            <br />
            <span className="text-destructive">Jusqu&apos;à ce que ça casse tout.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-16">
          {painPoints.map((point, index) => (
            <div key={index} className="group p-6 rounded-2xl border border-border/50 bg-card/30 hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-300">
              <span className="text-3xl mb-3 block">{point.emoji}</span>
              <p className="text-muted-foreground italic">{point.text}</p>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
            <p className="text-foreground font-medium">
              Le problème ? <span className="text-destructive font-bold">73%</span> des sites ont des erreurs techniques invisibles qui sabotent leur référencement.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// 50 POINTS SOLUTION SECTION
// ============================================================================
function SolutionSection() {
  const categories = [
    { icon: Globe2, name: "International SEO", points: 5, description: "Hreflang, balises lang, structure multi-langue", note: "Pour les sites qui visent plusieurs pays", color: "primary" },
    { icon: Wrench, name: "Fondation Technique", points: 8, description: "HTTPS, robots.txt, sitemap, canonicals, redirections", note: "Les bases que 40% des sites négligent", color: "success" },
    { icon: FileText, name: "Contenu & Structure", points: 7, description: "Breadcrumbs, profondeur de clic, maillage interne", note: "Ce qui aide Google à comprendre votre site", color: "accent" },
    { icon: Database, name: "Schema & Données", points: 4, description: "JSON-LD, rich snippets, validation", note: "Pour apparaître avec les étoiles et les prix dans Google", color: "warning" },
    { icon: Image, name: "Images & Médias", points: 2, description: "Formats modernes, lazy loading, attributs alt", note: "25% du poids de votre site, souvent mal optimisé", color: "primary" },
    { icon: Zap, name: "Performance", points: 7, description: "Core Web Vitals, TTFB, caching, CSS/JS", note: "Google pénalise les sites lents depuis 2021", color: "success" },
    { icon: Code2, name: "JavaScript & Rendering", points: 4, description: "SSR vs CSR, liens JS, rendu côté serveur", note: "Critique pour les sites React/Vue/Next.js", color: "accent" },
    { icon: Navigation, name: "Navigation & Liens", points: 6, description: "Menu mobile, pagination, liens internes", note: "Comment Google crawle votre site", color: "warning" },
    { icon: Search, name: "Analyse Avancée", points: 5, description: "Duplicate content, paramètres URL, logs serveur", note: "Pour aller au-delà des bases", color: "primary" },
    { icon: AlertTriangle, name: "Gestion d'Erreurs", points: 2, description: "Page 404, liens cassés", note: "L'expérience utilisateur compte pour le SEO", color: "destructive" }
  ]

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
      success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
      accent: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
      warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
      destructive: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' }
    }
    return colors[color]?.[type] || colors.primary[type]
  }

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            Analyse complète
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-gradient">50 points</span> techniques passés au crible
          </h2>
          <p className="text-lg text-muted-foreground">On vérifie tout ce que Google regarde. Vraiment tout.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
          {categories.map((cat, index) => {
            const Icon = cat.icon
            return (
              <div key={index} className={`group relative p-5 rounded-2xl border bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 ${getColorClass(cat.color, 'border')}`}>
                <div className={`absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${getColorClass(cat.color, 'bg')} ${getColorClass(cat.color, 'text')}`}>{cat.points}</div>
                <div className={`inline-flex p-2.5 rounded-xl mb-4 ${getColorClass(cat.color, 'bg')}`}>
                  <Icon className={`w-5 h-5 ${getColorClass(cat.color, 'text')}`} />
                </div>
                <h3 className="font-display font-semibold mb-2 text-sm">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{cat.description}</p>
                <p className={`text-xs ${getColorClass(cat.color, 'text')} opacity-70`}>→ {cat.note}</p>
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <Button size="lg" className="glow-sm hover:glow-md transition-all duration-300" asChild>
            <a href="#hero">Tester mon site gratuitement<ArrowRight className="h-5 w-5 ml-2" /></a>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================
function HowItWorksSection() {
  const steps = [
    { number: "1", title: "Entrez votre URL", description: "Collez l'adresse de votre site. C'est tout ce qu'on vous demande.", icon: Globe2 },
    { number: "2", title: "On scanne tout", description: "Notre robot analyse 50 points techniques en temps réel. Pas de file d'attente.", icon: Search },
    { number: "3", title: "Recevez votre score", description: "Score sur 100 + liste des problèmes + comment les corriger. Clair et actionnable.", icon: BarChart3 }
  ]

  return (
    <section className="relative py-32 overflow-hidden bg-card/20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">Comment ça <span className="text-gradient">marche</span> ?</h2>
          <p className="text-lg text-muted-foreground">3 étapes. 2 minutes. Zéro prise de tête.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />}
                <div className="relative p-8 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg glow-sm">{step.number}</div>
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-16">
          <Button size="lg" variant="outline" className="group" asChild>
            <a href="#hero">Lancer mon audit<ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" /></a>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// RESULTS PREVIEW SECTION
// ============================================================================
function ResultsPreviewSection() {
  const features = [
    { icon: BarChart3, title: "Score global sur 100", description: "Comparez-vous à la moyenne des sites de votre secteur", color: "primary" },
    { icon: CheckCircle2, title: "Ce qui va bien", description: "Vos points forts, pour ne pas y toucher", color: "success" },
    { icon: AlertCircle, title: "Ce qu'il faut améliorer", description: "Priorisé par impact SEO", color: "warning" },
    { icon: Wrench, title: "Comment corriger", description: "Instructions claires, même si vous n'êtes pas dev", color: "accent" },
    { icon: FileDown, title: "Export PDF", description: "Pour votre équipe ou votre prestataire", color: "primary" }
  ]

  const getColorClass = (color: string, type: 'bg' | 'text') => {
    const colors: Record<string, Record<string, string>> = {
      primary: { bg: 'bg-primary/10', text: 'text-primary' },
      success: { bg: 'bg-success/10', text: 'text-success' },
      accent: { bg: 'bg-accent/10', text: 'text-accent' },
      warning: { bg: 'bg-warning/10', text: 'text-warning' }
    }
    return colors[color]?.[type] || colors.primary[type]
  }

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">Un rapport que vous allez <span className="text-gradient">vraiment comprendre</span></h2>
          <p className="text-lg text-muted-foreground">Pas de jargon. Pas de graphiques inutiles. Juste ce qu&apos;il faut corriger.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border transition-all duration-300 text-center">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${getColorClass(feature.color, 'bg')}`}>
                  <Icon className={`w-6 h-6 ${getColorClass(feature.color, 'text')}`} />
                </div>
                <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FAQ SECTION
// ============================================================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = [
    { question: "C'est vraiment gratuit ? Où est le piège ?", answer: "Pas de piège. 50SEO est propulsé par SearchXLab, une agence GEO. L'outil nous permet de montrer notre expertise et d'aider ceux qui veulent aller plus loin. Mais l'audit reste 100% gratuit, sans limite." },
    { question: "Combien de temps prend l'analyse ?", answer: "Entre 1 et 3 minutes selon la taille de votre site. On analyse en temps réel, pas de file d'attente." },
    { question: "Mes données sont-elles stockées ?", answer: "On stocke uniquement l'URL et les résultats pour vous permettre de partager votre rapport. Aucune donnée personnelle collectée sans votre consentement (email optionnel pour le PDF)." },
    { question: "Quelle différence avec Lighthouse ?", answer: "Lighthouse se concentre sur la performance et l'accessibilité. 50SEO vérifie le SEO technique : structure, indexation, données structurées, maillage... Ce que Google utilise pour classer votre site." },
    { question: "Je ne suis pas développeur, je vais comprendre ?", answer: "C'est fait pour ça. Chaque problème est expliqué simplement avec des instructions pour le corriger, que vous soyez dev ou non." },
    { question: "Vous analysez combien de pages ?", answer: "On analyse la page que vous soumettez + les éléments globaux du site (robots.txt, sitemap, etc.). Pour un crawl complet de toutes vos pages, contactez-nous pour un audit approfondi." },
    { question: "C'est quoi SearchXLab ?", answer: "SearchXLab est une agence française spécialisée en GEO (Generative Engine Optimization). On aide les entreprises à être visibles quand ChatGPT, Claude ou Google AI recommandent des solutions. 50SEO est notre contribution gratuite à la communauté." }
  ]

  return (
    <section id="faq" className="relative py-32 overflow-hidden bg-card/20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">Questions <span className="text-gradient">fréquentes</span></h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'border-primary/50 bg-card glow-sm' : 'border-border/50 bg-background/50 hover:border-border'}`}>
                <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-display font-semibold text-lg pr-4">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.answer}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================
function FinalCTASection({ stats }: { stats: Stats }) {
  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num)

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">Prêt à découvrir ce qui <span className="text-gradient">cloche</span> ?</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">2 minutes pour savoir si votre SEO technique est au niveau. Gratuit. Sans inscription.</p>
          <Button size="lg" className="h-14 px-10 text-lg glow-md hover:glow-lg transition-all duration-300" asChild>
            <a href="#hero">Analyser mon site maintenant<ArrowRight className="h-5 w-5 ml-2" /></a>
          </Button>
          {stats.totalCount > 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              Déjà <span className="text-foreground font-semibold">{formatNumber(stats.totalCount)}</span> sites analysés
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SEARCHXLAB CTA SECTION
// ============================================================================
function SearchXLabCTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-accent/10 via-background to-primary/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-3xl border border-accent/20 bg-card/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
            <div className="relative grid md:grid-cols-[1fr,auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  SEO AI - Search Engine Optimization pour l&apos;IA
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Et votre visibilité IA ?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Le SEO, c&apos;est bien. Mais en 2026, ChatGPT, Claude et Perplexity recommandent aussi des solutions à vos futurs clients.
                  <br /><br />
                  <span className="text-foreground font-medium">Est-ce qu&apos;ils parlent de vous ?</span>
                </p>
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20">
                  <span className="text-3xl font-mono font-bold text-accent">4,4x</span>
                  <span className="text-sm text-muted-foreground">Les visiteurs via IA convertissent<br />mieux que le trafic Google classique</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <Button size="lg" variant="outline" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 group" asChild>
                  <a href="https://searchxlab.com" target="_blank" rel="noopener noreferrer">
                    Découvrir mon score SEO AI
                    <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">Gratuit · searchxlab.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================
export function V2PageClient({ stats }: { stats: Stats }) {
  return (
    <>
      <HeroSection stats={stats} />
      <PainPointsSection />
      <SolutionSection />
      <HowItWorksSection />
      <ResultsPreviewSection />
      <FAQSection />
      <SearchXLabCTA />
      <FinalCTASection stats={stats} />
    </>
  )
}
