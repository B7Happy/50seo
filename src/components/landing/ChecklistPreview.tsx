"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CHECK_CATEGORIES } from "@/config/checks"

const categoryStyles: Record<string, { gradient: string; border: string; text: string }> = {
  international: { gradient: "from-blue-500/15 to-cyan-500/10", border: "border-blue-500/20 hover:border-blue-500/40", text: "text-blue-400" },
  technical: { gradient: "from-violet-500/15 to-purple-500/10", border: "border-violet-500/20 hover:border-violet-500/40", text: "text-violet-400" },
  content: { gradient: "from-emerald-500/15 to-green-500/10", border: "border-emerald-500/20 hover:border-emerald-500/40", text: "text-emerald-400" },
  schema: { gradient: "from-orange-500/15 to-amber-500/10", border: "border-orange-500/20 hover:border-orange-500/40", text: "text-orange-400" },
  media: { gradient: "from-pink-500/15 to-rose-500/10", border: "border-pink-500/20 hover:border-pink-500/40", text: "text-pink-400" },
  performance: { gradient: "from-yellow-500/15 to-orange-500/10", border: "border-yellow-500/20 hover:border-yellow-500/40", text: "text-yellow-400" },
  javascript: { gradient: "from-cyan-500/15 to-blue-500/10", border: "border-cyan-500/20 hover:border-cyan-500/40", text: "text-cyan-400" },
  navigation: { gradient: "from-teal-500/15 to-emerald-500/10", border: "border-teal-500/20 hover:border-teal-500/40", text: "text-teal-400" },
  analysis: { gradient: "from-indigo-500/15 to-violet-500/10", border: "border-indigo-500/20 hover:border-indigo-500/40", text: "text-indigo-400" },
  errors: { gradient: "from-red-500/15 to-rose-500/10", border: "border-red-500/20 hover:border-red-500/40", text: "text-red-400" },
}

const defaultStyle = { gradient: "from-primary/15 to-accent/10", border: "border-primary/20 hover:border-primary/40", text: "text-primary" }

export function ChecklistPreview() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Decorative orbs */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-success/20 bg-success/5 text-sm">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Checklist complete</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="text-gradient">50 points</span> SEO analyses
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Notre checklist couvre tous les aspects du SEO technique moderne
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
          {CHECK_CATEGORIES.map((category) => {
            const style = categoryStyles[category.id] || defaultStyle
            return (
              <div
                key={category.id}
                className={`group relative p-5 rounded-2xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-500 cursor-default hover:scale-[1.02] ${style.gradient} ${style.border}`}
              >
                {/* Icon */}
                <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>

                {/* Name */}
                <h3 className="font-display font-semibold text-sm leading-tight mb-3">
                  {category.name}
                </h3>

                {/* Count */}
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-mono text-3xl font-bold ${style.text}`}>
                    {category.checks.length}
                  </span>
                  <span className="text-xs text-muted-foreground">points</span>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* Total count banner */}
        <div className="max-w-3xl mx-auto mb-14">
          <div className="relative p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="text-sm text-muted-foreground mb-2">Total des points verifies</div>
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient">50 points</div>
              </div>

              {/* Visual bars */}
              <div className="flex items-end gap-2">
                {[1, 2, 3, 4, 5, 4, 3, 5, 2, 4].map((height, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-gradient-to-t from-primary/40 to-primary/10 transition-all duration-300 hover:from-primary/60 hover:to-primary/20"
                    style={{ height: `${height * 12}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild className="group gap-3 px-8 py-6 text-base border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
            <Link href="/checklist">
              Decouvrir les 50 points en detail
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
