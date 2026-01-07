"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "C'est vraiment gratuit ?",
    answer:
      "Oui, 50SEO est 100% gratuit et le restera. Nous ne demandons aucune inscription ni carte bancaire. Notre objectif est de vous aider à améliorer votre SEO technique.",
  },
  {
    question: "Combien de temps dure l'analyse ?",
    answer:
      "L'analyse complète prend généralement moins de 2 minutes. Nous vérifions 50 points SEO techniques de manière automatisée pour vous fournir des résultats rapides et précis.",
  },
  {
    question: "Quels sont les 50 points vérifiés ?",
    answer:
      "Notre checklist couvre 10 catégories : SEO International, Fondation Technique, Contenu & Structure, Schema & Données, Images & Médias, Performance, JavaScript & Rendering, Navigation & Liens, Analyse Technique et Gestion d'Erreurs.",
  },
  {
    question: "Puis-je exporter les résultats ?",
    answer:
      "Oui, vous pouvez recevoir un rapport PDF complet par email. Il contient tous les résultats de l'audit avec des recommandations détaillées pour améliorer votre score.",
  },
  {
    question: "Mon site est-il compatible ?",
    answer:
      "50SEO fonctionne avec tous les types de sites web : WordPress, Shopify, sites custom, etc. Notre outil analyse le rendu final de votre site, peu importe la technologie utilisée.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Support
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Questions <span className="text-gradient">frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tout ce que vous devez savoir sur 50SEO
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className={`group rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-primary/50 bg-card glow-sm'
                    : 'border-border bg-card/50 hover:border-border/80'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display font-semibold text-lg pr-4">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-primary text-primary-foreground rotate-0' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <p className="text-muted-foreground mb-2">
              Vous avez d'autres questions ?
            </p>
            <a
              href="mailto:contact@50seo.fr"
              className="font-semibold text-primary hover:underline"
            >
              Contactez-nous →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
