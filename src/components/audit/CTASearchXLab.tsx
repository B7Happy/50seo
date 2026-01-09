"use client"

import { Bot, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/config/site"

interface CTASearchXLabProps {
  className?: string
}

export function CTASearchXLab({ className }: CTASearchXLabProps) {
  return (
    <Card className={cn("relative overflow-hidden border-primary/20", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />

      {/* Decorative orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />

      <CardContent className="relative pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Icon */}
          <div className="shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg mb-1">
              Et votre visibilite <span className="text-gradient">IA</span> ?
            </h3>
            <p className="text-sm text-muted-foreground">
              Decouvrez si ChatGPT, Claude et Perplexity mentionnent votre marque avec un audit GEO gratuit.
            </p>
          </div>

          {/* CTA */}
          <Button
            asChild
            className="shrink-0 gap-2 group glow-sm hover:glow-md transition-all"
          >
            <a
              href={siteConfig.calLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reserver un appel
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
