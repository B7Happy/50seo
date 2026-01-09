import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, AlertTriangle, Zap, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CHECK_CATEGORIES } from '@/config/checks'
import { CHECKLIST_CONTENT, FAQ_ITEMS } from '@/config/checklist-content'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Checklist SEO Technique - 50 Points Essentiels | 50SEO',
  description: 'Guide complet des 50 points SEO techniques a verifier sur votre site. HTTPS, Core Web Vitals, sitemap, robots.txt, donnees structurees et plus encore.',
  keywords: [
    'checklist seo',
    'audit seo technique',
    'verification seo',
    'points seo',
    'guide seo technique',
    'optimisation seo'
  ],
  openGraph: {
    title: 'Checklist SEO Technique - 50 Points Essentiels',
    description: 'Guide complet des 50 points SEO techniques a verifier sur votre site.',
    type: 'website',
  },
}

// Impact badge component
function ImpactBadge({ impact }: { impact: string }) {
  const config = {
    critical: { label: 'Critique', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    high: { label: 'Eleve', className: 'bg-warning/10 text-warning border-warning/20' },
    medium: { label: 'Moyen', className: 'bg-primary/10 text-primary border-primary/20' },
    low: { label: 'Faible', className: 'bg-muted text-muted-foreground border-muted' },
  }
  const { label, className } = config[impact as keyof typeof config] || config.low
  return <Badge variant="outline" className={className}>{label}</Badge>
}

// Get category info
function getCategoryInfo(categoryId: string) {
  return CHECK_CATEGORIES.find(cat => cat.id === categoryId)
}

// Generate JSON-LD structured data
function generateStructuredData() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment realiser un audit SEO technique complet',
    description: 'Guide etape par etape pour verifier les 50 points SEO techniques essentiels de votre site web.',
    totalTime: 'PT2H',
    tool: [
      { '@type': 'HowToTool', name: '50SEO.fr - Outil d\'audit gratuit' },
      { '@type': 'HowToTool', name: 'Google Search Console' },
      { '@type': 'HowToTool', name: 'Google PageSpeed Insights' }
    ],
    step: CHECK_CATEGORIES.map((category, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Verifier ${category.name}`,
      text: `Analysez les ${category.checks.length} points de la categorie ${category.name}`,
      url: `${siteConfig.url}/checklist#${category.id}`
    }))
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Checklist SEO Technique - 50 Points Essentiels',
    description: 'Guide complet des 50 points SEO techniques a verifier sur votre site.',
    author: {
      '@type': 'Organization',
      name: 'SearchXLab',
      url: siteConfig.searchXLabUrl
    },
    publisher: {
      '@type': 'Organization',
      name: '50SEO',
      url: siteConfig.url
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/checklist`
    }
  }

  return [faqSchema, howToSchema, articleSchema]
}

export default function ChecklistPage() {
  const structuredData = generateStructuredData()

  // Group content by category
  const contentByCategory = CHECK_CATEGORIES.map(category => ({
    ...category,
    items: CHECKLIST_CONTENT.filter(item => item.category === category.id)
      .sort((a, b) => a.id - b.id)
  }))

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              Guide Complet
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Checklist SEO Technique
              <span className="block text-gradient">50 Points Essentiels</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Le guide de reference pour optimiser le SEO technique de votre site.
              Chaque point explique, avec des solutions concretes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/#hero">
                  <Search className="w-4 h-4" />
                  Lancer un audit gratuit
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#categories">
                  Voir la checklist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">50</div>
              <div className="text-sm text-muted-foreground">Points verifies</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">10</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-success mb-2">2 min</div>
              <div className="text-sm text-muted-foreground">Audit automatique</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Gratuit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section id="categories" className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Categories d'Audit
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
              {CHECK_CATEGORIES.map(category => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all text-center group"
                >
                  <span className="text-2xl mb-2 block">{category.icon}</span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {category.checks.length} points
                  </span>
                </a>
              ))}
            </div>

            {/* Category Sections */}
            {contentByCategory.map(category => (
              <section key={category.id} id={category.id} className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {category.items.length} points a verifier
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.items.map(item => (
                    <AccordionItem
                      key={item.id}
                      value={`item-${item.id}`}
                      className="border border-border rounded-xl overflow-hidden bg-card/50"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30">
                        <div className="flex items-center gap-4 text-left">
                          <span className="text-sm font-mono text-muted-foreground w-8">
                            #{item.id}
                          </span>
                          <span className="font-semibold flex-1">{item.name}</span>
                          <ImpactBadge impact={item.impact} />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-6 pt-2">
                          {/* Description */}
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                              Description
                            </h4>
                            <p className="text-foreground/90">{item.description}</p>
                          </div>

                          {/* Why it matters */}
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Pourquoi c'est important
                            </h4>
                            <p className="text-sm text-foreground/80">{item.why}</p>
                          </div>

                          {/* How to fix */}
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-success" />
                              Comment corriger
                            </h4>
                            <ul className="space-y-2">
                              {item.howToFix.map((step, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                  <span className="text-sm text-foreground/80">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              Questions Frequentes
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="max-w-3xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-display">
                Pret a analyser votre site ?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Notre outil analyse automatiquement ces 50 points en moins de 2 minutes.
                Obtenez un score detaille et des recommandations personnalisees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 glow-sm">
                  <Link href="/#hero">
                    <Search className="w-4 h-4" />
                    Lancer l'audit gratuit
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href={siteConfig.calLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Parler a un expert
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
