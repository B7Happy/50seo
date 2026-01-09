"use client"

import { Bot, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export function CTASearchXLab() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      {/* Animated orbs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          {/* Card */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-primary/50 via-accent/30 to-primary/20">
              <div className="absolute inset-px rounded-[calc(1.5rem-1px)] bg-card" />
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Decorative elements */}
              <div className="absolute top-8 right-8 text-primary/20">
                <Sparkles className="w-24 h-24" />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                {/* Icon */}
                <div className="shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-md">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                    Et votre visibilite <span className="text-gradient">IA</span> ?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                    Les moteurs IA (ChatGPT, Claude, Perplexity) citent-ils votre marque ?
                    Découvrez votre score <span className="font-semibold text-foreground">GEO</span> (Generative Engine Optimization).
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {['Audit personnalisé', 'Stratégie IA', 'Appel gratuit'].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button asChild size="lg" className="group gap-2 glow-sm hover:glow-md transition-all duration-300">
                    <a
                      href={siteConfig.calLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Réserver un appel découverte
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            {/* Scan line effect */}
            <div className="absolute inset-0 scan-line pointer-events-none" />
          </div>

          {/* Powered by */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Propulsé par{' '}
              <a
                href={siteConfig.searchXLabUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                SearchXLab
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
